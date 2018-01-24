import { Request, Response } from "express";
import { IProduct, Product } from "../models/Product";
import { IProductSupplier, ProductSupplier } from '../models/Product-Supplier';
import { MongoError } from "mongodb";
import * as moment from 'moment';
import { ISupplier } from "../models/Supplier";

export class ProductController {
    private static resolveErrorResponse(res: Response, msg: string, statusCode: number): Response {
        return res.send(statusCode).json({
            status: statusCode,
            msg
        });
    }

    private static resolveAPIResponse(res: Response, result: IProduct | IProduct[] | IProductSupplier | IProductSupplier[] | MongoError = null): Response {
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
        const { id } = req.params;
        const result = id ? await Product.getProduct(id) : await Product.getProduct();
        return ProductController.resolveAPIResponse(res, result);
    }

    async add(req: Request, res: Response): Promise<Response> {
        const { sku, name, description, category, brand, suppliers, price } = req.body;
        
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

        const newProduct = new Product();
        newProduct.sku = sku;
        newProduct.name = name;
        newProduct.description = description;
        newProduct.category = category;
        newProduct.brand = brand;
        newProduct.suppliers = suppliers;

        const arrProductSupplier = [];
        suppliers.forEach((s: ISupplier) => {
            let newProductSupplier = new ProductSupplier();
            newProductSupplier.product_id = newProduct._id;
            newProductSupplier.supplier_id = s._id;
            newProductSupplier.price = 0;
            arrProductSupplier.push(newProductSupplier);
        });

        ProductSupplier.createProductSupplier(arrProductSupplier);

        const result = await Product.createProduct(newProduct);
        return ProductController.resolveAPIResponse(res, newProduct);
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { _id, sku, name, description, category, brand, suppliers } = req.body;
        // TO-DO: update lowest price from suppliers
        const price = 0;
        
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
        if ( ! suppliers ) {
            return ProductController.resolveErrorResponse(res, 'Supplier cannot be emptied', 400);
        }

        const data = { sku, name, description, category, brand, suppliers, price };
        const result = await Product.updateProduct(_id, data)
        return ProductController.resolveAPIResponse(res, result);
    }

    async getProductPrice(req: Request, res: Response): Promise<Response> {
        const product_id = req.params.id;
        const version = req.params.version;

        const result = await ProductSupplier.getProductSupplier(product_id, version);
        return ProductController.resolveAPIResponse(res, result);
    }

    async updateProductPrice(req: Request, res: Response): Promise<Response> {
        const { _id, price_list, version } = req.body;
        const newVersion = version + 1;

        const newPriceList = [];
        price_list.forEach(e => {
            let productSupplier = {
                product_id: _id,
                supplier_id: e.supplier._id,
                price: parseFloat( e.price ),
                version: newVersion
            }
            newPriceList.push(productSupplier);
        })

        try {
            const updateProduct = await Product.updateProduct(_id, { version: newVersion });
            const result = await ProductSupplier.createProductSupplier(newPriceList);
            return ProductController.resolveAPIResponse(res, result);
        } catch (e) {
            return ProductController.resolveErrorResponse(res, 'Could not update product version. ' + e.message, 400);
        }
    }
}