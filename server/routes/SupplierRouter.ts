import { Router } from "express";
import { SupplierController } from "../controllers/SupplierController";

export class SupplierRouter {
    router: Router;
    supplierController: SupplierController;

    constructor() {
        this.router = Router();
        this.supplierController = new SupplierController();
    }

    routes() {
        this.router.get('/list', this.supplierController.select);
        this.router.post('/add', this.supplierController.add);
        this.router.post('/edit', this.supplierController.update);
    }
}