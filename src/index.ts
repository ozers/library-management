import express, { Request, Response } from 'express';
import sequelize from './config/database';
import bookRoutes from './routes/bookRoutes';

const app = express();
const port = 3000; // Default port to listen

sequelize.sync({ force: false }).then(() => {
    console.log('Database connected');
}).catch((err: Error) => {
    console.log('Error connecting to db: ', err);
});

app.use(express.json());

app.use('/books', bookRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Library Management API!');
});

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});
