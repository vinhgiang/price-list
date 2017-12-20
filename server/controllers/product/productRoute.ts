import * as express from 'express';
import { json } from 'body-parser';
import { Product } from '../../models/Product';

export const productRoute = express.Router();

const jsonParser = json();

productRoute.post('/add', jsonParser, async (req, res) => {
    const { sku, name, description, category, brand, supplier, price } = req.body;
    try {
        const response = await Product.createProduct(sku, name, supplier, brand, category, description, price);
        res.send(response);
    } catch(ex) {
        res.status(500).send(ex.message);
    }
});