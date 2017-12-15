import * as express from 'express';
import { Request, Response } from 'express';
import { json } from 'body-parser';
import { Category } from '../../models/Category';

export const categoryRoute = express.Router();

const jsonParser = json();

categoryRoute.get('/list', (req, res) => {
    Category.find({})
        .then(result => res.send(result))
        .catch(err => console.log(err.message));
})

categoryRoute.post('/add', jsonParser, (req, res) => {
    const { name, ebay_uk, ebay_au } = req.body;
    Category.createCategory(name, ebay_uk, ebay_au)
        .then(response => res.send(response))
        .catch(err => res.send(err.message));
})