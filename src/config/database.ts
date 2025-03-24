import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: Options = {
    host: process.env.DB_HOST || 'db',
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
};

const sequelize = new Sequelize(
    process.env.DB_NAME || 'library_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    dbConfig
);

const testConnection = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

testConnection();

export default sequelize;
