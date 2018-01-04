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
        this.router.get('/list', this.brandController.select);
        this.router.post('/add', this.brandController.add);
        this.router.put('/edit', this.brandController.update);
    }
}