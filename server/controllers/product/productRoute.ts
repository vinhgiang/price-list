import * as express from 'express';
import { json } from 'body-parser';
import { Product } from '../../models/Product';

export const productRoute = express.Router();

const jsonParser = json();

productRoute.get('/list', async (req, res) => {
    try {
        const products = await Product.getProduct();
        res.send(products);
    } catch(ex) {
        res.status(500).send(ex.message);
    }
});

productRoute.post('/add', jsonParser, async (req, res) => {
    const { sku, name, description, category, brand, supplier, price } = req.body;
    try {
        const response = await Product.createProduct(sku, name, supplier, brand, category, description, price);
        res.send(response);
    } catch(ex) {
        res.status(500).send(ex.message);
    }
});

productRoute.post('/edit', jsonParser, async (req, res) => {
    const { _id, sku, name, description, category, brand, supplier, price } = req.body;
    try {
        const response = await Product.updateProduct(_id, { sku, name, description, category, brand, supplier, price } );
        res.send(response);
    } catch(ex) {
        res.status(500).send(ex.message);
    }
});