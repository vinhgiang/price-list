import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

export class ProductRouter {
    router: Router;
    productController: ProductController;

    constructor() {
        this.router = Router();
        this.productController = new ProductController();
    }

    routes() {
        this.router.get('/list', this.productController.select);
        this.router.get('/:id', this.productController.select);
        this.router.post('/add', this.productController.add);
        this.router.post('/edit', this.productController.update);
        this.router.get('/price/:id/:version', this.productController.getProductPrice);
        this.router.post('/price', this.productController.updateProductPrice);
    }
}