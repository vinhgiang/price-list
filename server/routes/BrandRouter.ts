import { Router } from 'express';
import { BrandController } from '../controllers/BrandController';

export class BrandRoute {
    router: Router;
    brandController: BrandController;

    constructor() {
        this.router = Router();
        this.brandController = new BrandController();
    }

    routes() {
        this.router.post('/add', this.brandController.add);
    }
}

// brandRoute.get('/list', (req, res) => {
//     Brand.getBrand()
//         .then(brands => res.send(brands))
//         .catch(err => res.status(500).send( { message: err.message } ));
// })

// brandRoute.post('/edit', jsonParser, (req, res) => {
//     const { _id, name } = req.body;
//     Brand.updateBrand(_id, { name })
//         .then(response => res.send(response))
//         .catch(error => res.status(500).send({ message: error.message } ));
// });