import { Schema, model } from 'mongoose';
import { BrandDocument } from '../documents/BrandDocument';

const brandSchema = new Schema({
    name: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now }
});

const BrandModel = model<BrandDocument>('Brand', brandSchema);

export class Brand extends BrandModel {
    name: String;
    created: Date;

    static async createBrand(name: String): Promise<object> {
        const brand = new Brand({ name });
        await brand.save();
        return { status: 1 };
    }

    static async updateBrand(id: String | Number, data: object): Promise<object> {
        const updatedBrand = await Brand.findByIdAndUpdate(id, data, { new: true } );
        return { status: 1 };
    }
}