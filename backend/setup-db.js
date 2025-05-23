const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
);

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
        await sequelize.authenticate();

        await sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."enum_categories_type" AS ENUM ('expense', 'income');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await User.sync({ force: true });
        await Category.sync({ force: true });
        await Expense.sync({ force: true });
        await Budget.sync({ force: true });

        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });

        const categories = DEFAULT_CATEGORIES.map(cat => ({
            ...cat,
            userId: user.id
        }));
        await Category.bulkCreate(categories);

        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

setupDatabase(); 