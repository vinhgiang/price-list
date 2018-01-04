import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";

export class CategoryRoute {
    router: Router;
    categoryController: CategoryController

    constructor() {
        this.router = Router();
        this.categoryController = new CategoryController();
    }

    routes() {
        this.router.get('/list', this.categoryController.select);
        this.router.post('/add', this.categoryController.add);
        this.router.put('/edit', this.categoryController.update);
    }
}