const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Use DATABASE_URL if available (for production environments like Render)
if (process.env.DATABASE_URL) {
    console.log('Using DATABASE_URL for connection');
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Needed for some Postgres providers
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            underscored: true,
            freezeTableName: true
        }
    });
} else {
    // Fallback to individual connection parameters
    console.log('Using individual DB parameters for connection');
    
    // Check if we need SSL (for Neon.tech in production)
    const dialectOptions = process.env.DB_SSL === 'true' 
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
          }
        : {};
    
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: false,
            dialectOptions,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            define: {
                underscored: true,
                freezeTableName: true
            }
        }
    );
}

// Test the connection and create database if it doesn't exist
const initializeDatabase = async () => {
    try {
        console.log('Attempting to authenticate database connection...');
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

initializeDatabase();

module.exports = sequelize; 