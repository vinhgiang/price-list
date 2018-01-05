import { Request, Response } from "express";
import { IProduct, Product } from "../models/Product";
import { MongoError } from "mongodb";
import * as moment from 'moment';

export class ProductController {
    private static resolveErrorResponse(res: Response, msg: string, statusCode: number): Response {
        return res.send(statusCode).json({
            status: statusCode,
            msg
        });
    }

    private static resolveAPIResponse(res: Response, result: IProduct | IProduct[] | MongoError = null): Response {
        if ( result instanceof MongoError ) {
            return res.status(500).json({
                status: 500,
                mongoError: result.code,
                msg: result.message,
                error: result.name
            });
        }

        return res.status(res.statusCode).json({
            status: res.statusCode,
            result
        })
    }

    async select(req: Request, res: Response): Promise<Response> {
        const result = await Product.getProduct();
        if( ! ( result instanceof MongoError ) ) {
            result.map(e => {
                var newObj = e._doc;
                newObj.created_string = moment(e.created).format('DD-MM-YYYY HH:mm:ss');
                newObj.last_updated_string = moment(e.last_update).format('DD-MM-YYYY HH:mm:ss');
                return newObj;
            });
        }
        return ProductController.resolveAPIResponse(res, result);
    }

    async add(req: Request, res: Response): Promise<Response> {
        const { sku, name, description, category, brand, supplier, price } = req.body;
        
        if ( ! sku ) {
            return ProductController.resolveErrorResponse(res, 'SKU cannot be emptied', 400);
        }
        if ( ! name ) {
            return ProductController.resolveErrorResponse(res, 'Name cannot be emptied', 400);
        }
        if ( ! category ) {
            return ProductController.resolveErrorResponse(res, 'Category cannot be emptied', 400);
        }
        if ( ! brand ) {
            return ProductController.resolveErrorResponse(res, 'Brand cannot be emptied', 400);
        }
        if ( ! supplier ) {
            return ProductController.resolveErrorResponse(res, 'Supplier cannot be emptied', 400);
        }
        if ( ! price ) {
            return ProductController.resolveErrorResponse(res, 'Price cannot be emptied', 400);
        }

        const newProduct = new Product();
        newProduct.sku = sku;
        newProduct.name = name;
        newProduct.description = description;
        newProduct.category = category;
        newProduct.brand = brand;
        newProduct.supplier = supplier;
        newProduct.price = price;

        const result = await Product.createProduct(newProduct);
        return ProductController.resolveAPIResponse(res, result);
    }

    async update(req: Request, res: Response) {
        const { _id, sku, name, description, category, brand, supplier, price } = req.body;

        if ( ! sku ) {
            return ProductController.resolveErrorResponse(res, 'SKU cannot be emptied', 400);
        }
        if ( ! name ) {
            return ProductController.resolveErrorResponse(res, 'Name cannot be emptied', 400);
        }
        if ( ! category ) {
            return ProductController.resolveErrorResponse(res, 'Category cannot be emptied', 400);
        }
        if ( ! brand ) {
            return ProductController.resolveErrorResponse(res, 'Brand cannot be emptied', 400);
        }
        if ( ! supplier ) {
            return ProductController.resolveErrorResponse(res, 'Supplier cannot be emptied', 400);
        }
        if ( ! price ) {
            return ProductController.resolveErrorResponse(res, 'Price cannot be emptied', 400);
        }

        const data = { sku, name, description, category, brand, supplier, price };
        const result = await Product.updateProduct(_id, data)
        return ProductController.resolveAPIResponse(res, result);
    }
}