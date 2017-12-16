import { Schema, model } from 'mongoose';
import { CategoryDocument } from '../documents/CategoryDocument';
import * as moment from 'moment';

const categorySchema = new Schema({
    name: { type: String, required: true, trim: true },
    ebay_au: { type: String, required: true, trim: true},
    ebay_uk: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now }
})

const categoryModel = model<CategoryDocument>('Category', categorySchema);

export class Category extends categoryModel {

    static async getCategory(): Promise<CategoryDocument[] | object> {
        try {
            const categories = await Category.find({});
            const newResult = categories.map(e => {
                var newObj = e._doc;
                newObj.created_string = moment(e.created).format('DD-MM-YYYY HH:mm:ss');
                return newObj;
            });
            return newResult;
        } catch(ex) {
            return ex;
        }
    }
    
    static async createCategory(name: string, ebay_uk: string, ebay_au: string): Promise<object> {
        const category = new Category({ name, ebay_uk, ebay_au });
        try {
            await category.save();
        } catch(ex) {
            return { status: 0, error: ex.message };
        }
        return { status: 1 };
    }

    static async updateCategory(id: string | number, data: object): Promise<object> {
        const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true } );
        return { status: 1 };
    }
}