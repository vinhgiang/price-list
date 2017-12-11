import * as express from 'express';
import { brandRoute } from './controllers/brand/brandRoute';

export const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,token');
    next();
});

app.get('/', (req, res) => res.send('Home page'));

app.use('/brand', brandRoute);