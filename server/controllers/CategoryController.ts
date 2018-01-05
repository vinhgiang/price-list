import * as express from 'express';
import { Request, Response } from 'express';
import { json } from 'body-parser';
import { ICategory, Category } from '../models/Category';
import { MongoError } from 'mongodb';
import * as moment from 'moment';

export class CategoryController {
    private static resolveErrorResponse(res: Response, msg: string, statusCode: number): Response {
        return res.status(statusCode).json({
            status: statusCode,
            msg
        });
    }

    private static resolveAPIResponse(res: Response, result: ICategory | ICategory[] | MongoError) : Response {
        if( result instanceof MongoError ) {
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
        });
    }

    async select(req: Request, res: Response): Promise<Response> {
        const result = await Category.getCategory();
        if( ! ( result instanceof MongoError ) ) {
            const newResult = result.map(e => {
                var newObj = e._doc;
                newObj.created_string = moment(e.created).format('DD-MM-YYYY HH:mm:ss');
                return newObj;
            });

            return CategoryController.resolveAPIResponse(res, newResult);
        }
        return CategoryController.resolveAPIResponse(res, result);
    }

    async add(req: Request, res: Response): Promise<Response> {
        const { name, ebay_uk, ebay_au } = req.body;

        if( ! name ) {
            return CategoryController.resolveErrorResponse(res, 'Category name cannot be empty.', 400);
        }
        if( ! ebay_uk ) {
            return CategoryController.resolveErrorResponse(res, 'eBay UK cannot be empty.', 400);
        }
        if( ! ebay_au ) {
            return CategoryController.resolveErrorResponse(res, 'eBay AU cannot be empty.', 400);
        }

        const newCategory = new Category();
        newCategory.name = name;
        newCategory.ebay_au = ebay_au;
        newCategory.ebay_uk = ebay_uk;

        const result = await Category.createCategory(newCategory);
        return CategoryController.resolveAPIResponse(res, result);
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { _id, name, ebay_uk, ebay_au } = req.body;

        if( ! _id ) {
            return CategoryController.resolveErrorResponse(res, 'ID cannot be empty.', 400);
        }
        if( ! name ) {
            return CategoryController.resolveErrorResponse(res, 'Category name cannot be empty.', 400);
        }
        if( ! ebay_uk ) {
            return CategoryController.resolveErrorResponse(res, 'eBay UK cannot be empty.', 400);
        }
        if( ! ebay_au ) {
            return CategoryController.resolveErrorResponse(res, 'eBay AU cannot be empty.', 400);
        }

        const result = await Category.updateCategory(_id, { name, ebay_au, ebay_uk });
        return CategoryController.resolveAPIResponse(res, result);
    }
}