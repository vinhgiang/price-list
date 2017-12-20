import * as express from 'express';
import { brandRoute } from './controllers/brand/brandRoute';
import { categoryRoute } from './controllers/category/categoryRoute';
import { supplierRoute } from './controllers/supplier/supplierRoute';
import { productRoute } from './controllers/product/productRoute';

export const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,token');
    next();
});

app.get('/', (req, res) => res.send('Home page'));

app.use('/brand', brandRoute);
app.use('/category', categoryRoute);
app.use('/supplier', supplierRoute);
app.use('/product', productRoute);