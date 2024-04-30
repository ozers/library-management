import express, { Request, Response } from 'express';


const app = express();
const port = 3000; // Default port to listen

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Library Management API!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
