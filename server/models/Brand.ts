import { Schema, model } from 'mongoose';
import * as moment from 'moment';
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

    static async getBrand(): Promise<IBrand | object> {
        try {
            const result = await Brand.find()
            const newResult = result.map(e => {
                var newObj = e._doc;
                newObj.created_string = moment(e.created).format('DD-MM-YYYY HH:mm:ss');
                return newObj;
            });
            return newResult;
        } catch(ex) {
            return ex;
        }
    }

    static async createBrand(newBrand: IBrand): Promise<IBrand | MongoError> {
        return Brand.create(newBrand)
                .then((result: IBrand) => result)
                .catch((error: MongoError) => error);
    }

    static async updateBrand(id: string | number, data: object): Promise<object> {
        const updatedBrand = await Brand.findByIdAndUpdate(id, data, { new: true } );
        return { status: 1 };
    }
}