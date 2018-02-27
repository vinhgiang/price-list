import * as express from 'express';
import { MongoError } from 'mongodb';
import { connect } from 'mongoose';
import mongoose = require('mongoose');
import * as path from 'path'
import * as logger from 'morgan';
import { json, urlencoded } from 'body-parser';

import { cfg } from './config/cfg';

import { BrandRouter } from './routes/BrandRouter';
import { CategoryRouter } from './routes/CategoryRouter';
import { SupplierRouter } from './routes/SupplierRouter';
import { ProductRouter } from './routes/ProductRouter';
import { OptionRouter } from './routes/OptionRouter';

class App {
    public app: express.Application;
    public mongoDbURI: string;
    public brandRouter: BrandRouter;
    public categoryRouter: CategoryRouter;
    public supplierRouter: SupplierRouter;
    public productRouter: ProductRouter;
    public optionRouter: OptionRouter;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public config(): void {
        
        mongoose.Promise = global.Promise;

        this.mongoDbURI = this.getMongoDbURI();
        connect(this.mongoDbURI, { useMongoClient: true });

        // Morgan Middleware
        this.app.use(logger('dev'));

        // BodyParser Middleware
        this.app.use(json());
        this.app.use(urlencoded({
            extended: false,
            limit: '5mb',
            parameterLimit: 5000
        }));

        // Log err
        this.app.use(this.logErrors);
        
        // Static path
        this.app.use(express.static( path.join( __dirname, 'public' ) ) );

        if ( process.env.isLocal === 'true' ) {
            this.app.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,token');
                next();
            });
        }

        this.brandRouter = new BrandRouter();
        this.brandRouter.routes();
        
        this.categoryRouter = new CategoryRouter();
        this.categoryRouter.routes();

        this.supplierRouter = new SupplierRouter();
        this.supplierRouter.routes();

        this.productRouter = new ProductRouter();
        this.productRouter.routes();

        this.optionRouter = new OptionRouter();
        this.optionRouter.routes();
    }

    public routes(): void {
        this.app.get('/', (req, res) => res.sendFile( path.join(__dirname, 'index.html' ) ) );
        this.app.use('/api/brand/', this.brandRouter.router);
        this.app.use('/api/category', this.categoryRouter.router);
        this.app.use('/api/supplier', this.supplierRouter.router);
        this.app.use('/api/product', this.productRouter.router);
        this.app.use('/api/option', this.optionRouter.router);
    }

    public getMongoDbURI(): string {
        if (process.env.isTesting === 'true') return cfg.mongoTestURI
        if (process.env.PORT) return cfg.mongoProductionURI;
        return cfg.mongoLocalURI;
    }

    public logErrors(err, req, res, next) {
        console.error(err.stack)
        next(err);
    }
}

export default new App().app;