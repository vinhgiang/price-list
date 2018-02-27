import { Router } from "express";
import { OptionController } from "../controllers/OptionController";

export class OptionRouter {
    router: Router
    optionController: OptionController;

    constructor() {
        this.router = Router();
        this.optionController = new OptionController();
    }

    routes() {
        this.router.get('/list', this.optionController.select);
        this.router.post('/add', this.optionController.add);
        this.router.post('/edit', this.optionController.update);
    }
}