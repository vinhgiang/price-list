import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { IOption, Option } from '../models/Option';

export class OptionController {
    private static resolveErrorResponse(res: Response, msg: string, statusCode: number): Response {
        return res.status(statusCode).json({
            status: statusCode,
            msg
        });
    }

    private static resolveAPIResponse(res: Response, result: IOption | IOption[] | MongoError = null): Response {
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

    async add( req: Request, res: Response ): Promise<Response> {
        const { name, key, value } = req.body;

        if ( ! name ) {
            return OptionController.resolveErrorResponse(res, "Option's name cannot be emptied", 400);
        }
        if ( ! key ) {
            return OptionController.resolveErrorResponse(res, "Option's key cannot be emptied", 400);
        }

        const newOption: IOption = new Option();
        newOption.name = name;
        newOption.key = key;
        newOption.value = value;

        const result = await Option.createOption( newOption );
        return OptionController.resolveAPIResponse(res, result);
    }

    async select( req: Request, res: Response ): Promise<Response> {
        const result = await Option.getOption();
        return OptionController.resolveAPIResponse(res, result);
    }

    async update( req: Request, res: Response ): Promise<Response> {
        const { _id, name, value } = req.body;

        if ( ! _id ) {
            return OptionController.resolveErrorResponse(res, 'ID cannot be emptied', 400);
        }
        if ( ! name ) {
            return OptionController.resolveErrorResponse(res, "Option's name cannot be emptied", 400);
        }

        const result = await Option.updateOption( _id, { name, value } );
        return OptionController.resolveAPIResponse( res, result );
    }
}