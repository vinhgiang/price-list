import * as express from 'express';
import { MongoError } from 'mongodb';
import { connect } from 'mongoose';
import mongoose = require('mongoose');
import * as path from 'path'
import * as logger from 'morgan';
import { json, urlencoded } from 'body-parser';

import { cfg } from './config/cfg';

import { BrandRoute } from './routes/BrandRouter';
import { CategoryRoute } from './routes/CategoryRouter';
// import { supplierRoute } from './controllers/supplier/supplierRoute';
// import { productRoute } from './controllers/product/productRoute';

import './db';

class App {
    public app: express.Application;
    public mongoDbURI: string;
    public brandRoute: BrandRoute;
    public categoryRoute: CategoryRoute;

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

        this.brandRoute = new BrandRoute();
        this.brandRoute.routes();
        
        this.categoryRoute = new CategoryRoute();
        this.categoryRoute.routes();

        // app.use('/supplier', supplierRoute);
        // app.use('/product', productRoute);
    }

    public routes(): void {
        this.app.get('/', (req, res) => res.sendFile( path.join(__dirname, 'index.html' ) ) );
        this.app.use('/api/brand/', this.brandRoute.router);
        this.app.use('/api/category', this.categoryRoute.router);
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