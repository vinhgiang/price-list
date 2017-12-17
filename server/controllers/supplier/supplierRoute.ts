import * as express from 'express';
import { json } from 'body-parser';
import { Supplier } from '../../models/Supplier';

export const supplierRoute = express.Router();

const jsonParser = json();

supplierRoute.get('/list', (req, res) => {
    Supplier.getSupplier()
        .then(result => res.send(result))
        .catch(err => res.status(500).send(err.message));
})

supplierRoute.post('/add', jsonParser, (req, res) => {
    const { name } = req.body;
    Supplier.createSupplier(name)
        .then(response => res.send(response))
        .catch(err => res.status(500).send(err.message));
});

supplierRoute.post('/edit', jsonParser, (req, res) => {
    const { _id, name } = req.body;
    Supplier.updateSupplier(_id, { name })
        .then(response => res.send(response))
        .catch(err => res.status(500).send(err.message));
});