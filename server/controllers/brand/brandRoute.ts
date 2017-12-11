import * as express from 'express';
import { Request, Response } from 'express';
import { json } from 'body-parser';
import { Brand } from '../../models/Brand';
import * as moment from 'moment';

export const brandRoute = express.Router();

const jsonParser = json();

brandRoute.get('/list', (req, res) => {
    Brand.find()
        .then(result => {
            const newResult = result.map(e => {
                var newObj = {};
                newObj['name'] = e.name;
                newObj['created'] = moment(e.created).format('DD-MM-YYYY HH:mm:ss');
                return newObj;
            })
            res.send(newResult);
        })
        .catch(error => res.status(500).send({ message: error.message }))
})

brandRoute.post('/add', jsonParser, (req, res) => {
    const { name } = req.body;
    Brand.createBrand(name)
        .then(response => res.send(response))
        .catch(error => res.status(500).send({ message: error.message }))
});