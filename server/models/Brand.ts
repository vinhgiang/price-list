import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';
import { MongoError } from 'mongodb';

export interface IBrand extends Document {
    name: String;
    created: Date;
    [key: string]: any;
}

const brandSchema = new Schema({
    name: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now }
});

const BrandModel = model<IBrand>('Brand', brandSchema);

export class Brand extends BrandModel {

    static getBrand(): Promise<IBrand[] | MongoError> {
        return Brand.find()
                .select('-__v')
                .sort({'created': -1})
                .then((result: IBrand[]) => result)
                .catch((error: MongoError) => error);
    }

    static createBrand(newBrand: IBrand): Promise<IBrand | MongoError> {
        return Brand.create(newBrand)
                .then((result: IBrand) => result)
                .catch((error: MongoError) => error);
    }

    static updateBrand(id: string | number, data: object): Promise<IBrand | MongoError> {
        return Brand.findByIdAndUpdate(id, data, { new : true } )
                .then((result: IBrand) => result)
                .catch((error: MongoError) => error);
    }
}