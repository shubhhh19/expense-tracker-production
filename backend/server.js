const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Enhanced startup logging
console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('Database URL exists:', !!process.env.DATABASE_URL);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

const sequelize = require('./config/database');

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Expense = require('./models/Expense');
const Budget = require('./models/Budget');
const Notification = require('./models/Notification');

// Import routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budgets');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://bestestexpensetracker.netlify.app', process.env.FRONTEND_URL] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001', 'http://localhost:5001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5001;

// Default categories that will be created for each user
const DEFAULT_CATEGORIES = [
    { name: 'Food & Dining', type: 'expense', description: 'Restaurants, groceries, and food delivery', icon: '🍽️' },
    { name: 'Transportation', type: 'expense', description: 'Public transit, fuel, car maintenance', icon: '🚗' },
    { name: 'Housing', type: 'expense', description: 'Rent, utilities, maintenance', icon: '🏠' },
    { name: 'Entertainment', type: 'expense', description: 'Movies, games, hobbies', icon: '🎮' },
    { name: 'Shopping', type: 'expense', description: 'Clothing, electronics, personal items', icon: '🛍️' },
    { name: 'Healthcare', type: 'expense', description: 'Medical expenses, medications, insurance', icon: '⚕️' },
    { name: 'Education', type: 'expense', description: 'Tuition, books, courses', icon: '📚' },
    { name: 'Bills & Utilities', type: 'expense', description: 'Phone, internet, electricity', icon: '📱' },
    { name: 'Salary', type: 'income', description: 'Regular employment income', icon: '💰' },
    { name: 'Investments', type: 'income', description: 'Stock dividends, interest, capital gains', icon: '📈' },
    { name: 'Freelance', type: 'income', description: 'Contract work and side gigs', icon: '💻' },
    { name: 'Gifts', type: 'income', description: 'Money received as gifts', icon: '🎁' }
];

const initializeDatabase = async () => {
    try {
        console.log('Initializing database...');
        // This is handled in database.js now
        
        try {
            console.log('Creating enum types if they do not exist...');
            await sequelize.query(`
                DO $$ BEGIN
                    CREATE TYPE IF NOT EXISTS "public"."enum_categories_type" AS ENUM ('expense', 'income');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
            `);
            console.log('Enum types created or already exist');
        } catch (error) {
            console.error('Error creating enum types:', error.message);
            // Continue if error
        }

        try {
            console.log('Syncing database models...');
            // Using alter: true instead of force: true for safer schema updates
            const syncOption = process.env.NODE_ENV === 'production' 
                ? { alter: true } // For production, just alter tables
                : { force: true }; // For development, can use force if needed
            
            await sequelize.sync(syncOption);
            console.log('Database sync completed successfully');
        } catch (error) {
            console.error('Error syncing database:', error.message);
            throw error;
        }
    } catch (error) {
        console.error('Database initialization failed:', error.message);
        throw error;
    }
};

// Function to create default categories for a new user
const createDefaultCategories = async (userId) => {
    try {
        console.log(`Creating default categories for user ${userId}`);
        const now = new Date();
        const categories = DEFAULT_CATEGORIES.map(cat => ({
            ...cat,
            userId,
            createdAt: now,
            updatedAt: now
        }));

        await Category.bulkCreate(categories);
        console.log('Default categories created successfully');
    } catch (error) {
        console.error('Error creating default categories:', error.message);
        throw error;
    }
};

const startServer = async () => {
    try {
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        app.locals.createDefaultCategories = createDefaultCategories;
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();