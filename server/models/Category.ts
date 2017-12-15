import { Schema, model } from 'mongoose';
import { CategoryDocument } from '../documents/CategoryDocument';

const categorySchema = new Schema({
    name: { type: String, required: true, trim: true },
    ebay_au: { type: String, required: true, trim: true},
    ebay_uk: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now }
})

const categoryModel = model<CategoryDocument>('Category', categorySchema);

export class Category extends categoryModel {
    name: string;
    ebay_au: string;
    ebay_uk: string;

    static async createCategory(name: string, ebay_uk: string, ebay_au: string): Promise<object> {
        const category = new Category({ name, ebay_uk, ebay_au });
        try {
            await category.save();
        } catch(ex) {
            return { status: 0, error: ex.message };
        }
        return { status: 1 };
    }
}