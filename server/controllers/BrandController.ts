import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { IBrand, Brand } from '../models/Brand';

export class BrandController {
    private static resolveErrorResponse(res: Response, msg: string, statusCode: number): Response {
        return res.status(statusCode).json({
            status: statusCode,
            msg
        });
    }

    private static resolveAPIResponse(res: Response, result: IBrand | MongoError = null): Response {
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

    async add(req: Request, res: Response): Promise<Response> {
        const { name } = req.body;

        if ( !name ) {
            return BrandController.resolveErrorResponse(res, 'Brand name cannot be emptied', 400);
        }

        const newBrand: IBrand = new Brand();
        newBrand.name = name;

        const result = await Brand.createBrand(newBrand);
        return BrandController.resolveAPIResponse(res, result);
    }
}