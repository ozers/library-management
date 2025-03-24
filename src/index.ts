import express from 'express';
import dotenv from 'dotenv';
import sequelize, { testConnection } from './config/database';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import borrowRoutes from './routes/borrowRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { errorLogger, errorHandler } from './middleware/errorHandler';
import setupAssociations from './utils/associations';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/borrow', borrowRoutes);
app.use('/transactions', transactionRoutes);

// Error handling
app.use(errorLogger);
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
    try {
        await testConnection();
        
        // Setup model associations
        setupAssociations();
        console.log('Model associations have been set up');
        
        // Sync database tables without force
        await sequelize.sync({ force: false });
        console.log('Database tables have been synchronized');
        
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
