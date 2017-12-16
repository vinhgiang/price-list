import { Schema, model } from 'mongoose';
import { BrandDocument } from '../documents/BrandDocument';
import * as moment from 'moment';

const brandSchema = new Schema({
    name: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now }
});

const BrandModel = model<BrandDocument>('Brand', brandSchema);

export class Brand extends BrandModel {

    static async getBrand(): Promise<BrandDocument | object> {
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

    static async createBrand(name: string): Promise<object> {
        const brand = new Brand({ name });
        try {
            await brand.save();
        } catch(ex) {
            return { status: 0, error: ex.message };
        }
        return { status: 1 };
    }

    static async updateBrand(id: string | number, data: object): Promise<object> {
        const updatedBrand = await Brand.findByIdAndUpdate(id, data, { new: true } );
        return { status: 1 };
    }
}