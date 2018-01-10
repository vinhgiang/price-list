import { Request, Response } from 'express';
import { Supplier } from '../models/Supplier';
import { MongoError } from 'mongodb';

export class SupplierController {
    private static resolveErrorResponse(res: Response, msg: string, statusCode: number): Response {
        return res.status(statusCode).json({
            status: statusCode,
            msg
        });
    }

    private static resolveAPIResponse(res: Response, result: Supplier | Supplier[] | MongoError = null): Response {
        if( result instanceof MongoError ) {
            return res.status(500).json({
                status: 500,
                mongoError: result.code,
                msg: result.message,
                code: result.code
            });
        }

        return res.status(res.statusCode).json({
            status: res.statusCode,
            result
        })
    }

    async select(req: Request, res: Response): Promise<Response> {
        const result = await Supplier.getSupplier();
        return SupplierController.resolveAPIResponse(res, result);
    }

    async add(req: Request, res: Response): Promise<Response> {
        const { name } = req.body;

        if ( ! name ) {
            return SupplierController.resolveErrorResponse(res, 'Brand name cannot be emptied', 400);
        }

        const newSupplier = new Supplier();
        newSupplier.name = name;

        const result = await Supplier.createSupplier(newSupplier);
        return SupplierController.resolveAPIResponse(res, result);
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { _id, name } = req.body;

        if( ! _id ) {
            return SupplierController.resolveErrorResponse(res, 'ID cannot be emptied', 400);
        }
        if ( ! name ) {
            return SupplierController.resolveErrorResponse(res, 'Brand name cannot be emptied', 400);
        }

        const result = await Supplier.updateSupplier(_id, { name });
        return SupplierController.resolveAPIResponse(res, result);
    }
}