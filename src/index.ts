import express, {Request, Response} from 'express';
import sequelize from './config/database';
import bookRoutes from './routes/bookRoutes';
import userRoutes from "./routes/userRoutes";
import setupAssociations from "./utils/associations";

const app = express();
const port = 3000;

setupAssociations();

sequelize.sync({force: false}).then(() => {
    console.log('Database & associations setup completed');
})
    .catch((error: any) => {
        console.error('Failed to synchronize database:', error);
    });

app.use(express.json());

app.use('/books', bookRoutes);
app.use('/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Library Management API!');
});

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});
