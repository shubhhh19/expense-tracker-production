const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.env.production' });

// Create Sequelize connection with SSL required for Neon.tech
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Expense = require('./models/Expense');
const Budget = require('./models/Budget');

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

async function setupDatabase() {
    try {
        console.log('Connecting to Neon.tech database...');
        await sequelize.authenticate();
        console.log('Connection established successfully.');

        console.log('Creating enum types if needed...');
        await sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."enum_categories_type" AS ENUM ('expense', 'income');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        console.log('Syncing models...');
        // Use { alter: true } instead of { force: true } to not drop tables in production
        await User.sync({ alter: true });
        await Category.sync({ alter: true });
        await Expense.sync({ alter: true });
        await Budget.sync({ alter: true });

        // Check if we already have categories
        const categoryCount = await Category.count();
        if (categoryCount === 0) {
            console.log('Creating default categories...');
            // If the admin user doesn't exist, create it
            let adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
            
            if (!adminUser) {
                adminUser = await User.create({
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: 'admin123', // Remember to change this in production
                    isAdmin: true
                });
                console.log('Admin user created.');
            }

            const categories = DEFAULT_CATEGORIES.map(cat => ({
                ...cat,
                userId: adminUser.id
            }));
            await Category.bulkCreate(categories);
            console.log('Default categories created.');
        } else {
            console.log('Categories already exist, skipping creation.');
        }

        console.log('Database setup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase(); 