import * as express from 'express';
import { Request, Response } from 'express';
import { json } from 'body-parser';
import { Category } from '../../models/Category';

export const categoryRoute = express.Router();

const jsonParser = json();

categoryRoute.get('/list', async (req, res) => {
    try {
        const categories = await Category.getCategory();
        res.send(categories);
    } catch(ex) {
        console.log(ex.message);
    }
})

categoryRoute.post('/add', jsonParser, (req, res) => {
    const { name, ebay_uk, ebay_au } = req.body;
    Category.createCategory(name, ebay_uk, ebay_au)
        .then(response => res.send(response))
        .catch(err => res.status(500).send(err.message));
})

categoryRoute.post('/edit', jsonParser, (req, res) => {
    const { _id, name, ebay_uk, ebay_au } = req.body;
    Category.updateCategory(_id, { name, ebay_uk, ebay_au } )
        .then(response => res.send(response))
        .catch(error => res.status(500).send({ message: error.message }));
});