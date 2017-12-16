import * as express from 'express';
import { Request, Response } from 'express';
import { json } from 'body-parser';
import { Brand } from '../../models/Brand';

export const brandRoute = express.Router();

const jsonParser = json();

brandRoute.get('/list', (req, res) => {
    Brand.getBrand()
        .then(brands => res.send(brands))
        .catch(err => res.status(500).send( { message: err.message } ));
})

brandRoute.post('/add', jsonParser, (req, res) => {
    const { name } = req.body;
    Brand.createBrand(name)
        .then(response => res.send(response))
        .catch(error => res.status(500).send({ message: error.message } ))
});

brandRoute.post('/edit', jsonParser, (req, res) => {
    const { _id, name } = req.body;
    Brand.updateBrand(_id, { name })
        .then(response => res.send(response))
        .catch(error => res.status(500).send({ message: error.message } ));
});