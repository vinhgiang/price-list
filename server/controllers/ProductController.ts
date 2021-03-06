import { Request, Response } from "express";
import { IProduct, Product } from "../models/Product";
import { IProductSupplier, ProductSupplier } from '../models/Product-Supplier';
import { MongoError } from "mongodb";
import * as moment from 'moment';
import { ISupplier } from '../models/Supplier';
import { IOption, Option } from '../models/Option';

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

        let lowestPrice;
        const newPriceList = [];
        price_list.forEach(e => {
            if ( e.price != '' ) {
                let productSupplier = {
                    product_id: _id,
                    supplier_id: e.supplier._id,
                    price: parseFloat( e.price ),
                    version: newVersion
                }
                newPriceList.push(productSupplier);

                // get lowestPrice to calculate Website Net Price (WNP)
                lowestPrice = productSupplier.price < lowestPrice || ! lowestPrice ? productSupplier.price : lowestPrice;
            }
        })

        try {
            if ( newPriceList.length > 0 ) {

                // Calculate WNP
                let shippingFeeObj = await Option.getOption('shipping_fee');
                let paypalPercentObj = await Option.getOption('paypal_percent');
                let paypalFixedObj = await Option.getOption('paypal_fixed');
                let paypalExchangeRateObj = await Option.getOption('paypal_exchange_rate');

                let shippingFee = ! ( shippingFeeObj instanceof MongoError ) ? parseFloat( shippingFeeObj.value ) : 0;
                let paypalPercent = ! ( paypalPercentObj instanceof MongoError ) ? parseFloat( paypalPercentObj.value ) : 0;
                let paypalFixed = ! ( paypalFixedObj instanceof MongoError ) ? parseFloat( paypalFixedObj.value ) : 0;
                let paypalExchangeRate = ! ( paypalExchangeRateObj instanceof MongoError ) ? parseFloat( paypalExchangeRateObj.value ) : 0;
                
                let wnp = ( lowestPrice + shippingFee + paypalFixed ) / ( ( 1 - ( paypalPercent / 100 ) ) * paypalExchangeRate );
                wnp = Math.round(wnp * 100) / 100;
                
                const updateProduct = await Product.updateProduct(_id, { price: lowestPrice, wnp, version: newVersion });
                const result = await ProductSupplier.createProductSupplier(newPriceList);

                return ProductController.resolveAPIResponse(res, updateProduct);
            }
            let error = new MongoError('There is nothing to update.');
            return ProductController.resolveAPIResponse(res, error);
        } catch (e) {
            return ProductController.resolveErrorResponse(res, 'Could not update product version. ' + e.message, 400);
        }
    }
}