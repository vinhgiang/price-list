import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { IBrand, Brand } from '../models/Brand';
import * as moment from 'moment';

export class BrandController {
    private static resolveErrorResponse(res: Response, msg: string, statusCode: number): Response {
        return res.status(statusCode).json({
            status: statusCode,
            msg
        });
    }

    private static resolveAPIResponse(res: Response, result: IBrand | IBrand[] | MongoError = null): Response {
        if( result instanceof MongoError ) {
            return res.status(500).json({
                status: 500,
                mongoError: result.code,
                message: result.message,
                error: result.name
            });
        }

        return res.status(res.statusCode).json({
            status: res.statusCode,
            result
        });
    }

    async select(req: Request, res: Response): Promise<Response>{
        const result = await Brand.getBrand();
        if( ! ( result instanceof MongoError ) ) {
            const newResult = result.map(e => {
                var newObj = e._doc;
                newObj.created_string = moment(e.created).format('DD-MM-YYYY HH:mm:ss');
                return newObj;
            });

            return BrandController.resolveAPIResponse(res, newResult);
        }
        return BrandController.resolveAPIResponse(res, result);
    }

    async add(req: Request, res: Response): Promise<Response> {
        const { name } = req.body;

        if ( ! name ) {
            return BrandController.resolveErrorResponse(res, 'Brand name cannot be emptied', 400);
        }

        const newBrand: IBrand = new Brand();
        newBrand.name = name;

        const result = await Brand.createBrand(newBrand);
        return BrandController.resolveAPIResponse(res, result);
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { _id, name } = req.body;

        if ( ! name ) {
            return BrandController.resolveErrorResponse(res, 'Brand name cannot be emptied', 400);
        }
        
        const result = await Brand.updateBrand(_id, { name });
        return BrandController.resolveAPIResponse(res, result);
    }
}