import { Schema, model, Document } from 'mongoose';
import { MongoError } from 'mongodb';

export interface ICategory extends Document {
    name: string;
    ebay_au: string;
    ebay_uk: string;
    created: Date;
    [key: string]: any;
}

const categorySchema = new Schema({
    name: { type: String, required: true, trim: true },
    ebay_au: { type: String, required: true, trim: true},
    ebay_uk: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now }
})

const CategoryModel = model<ICategory>('Category', categorySchema);

export class Category extends CategoryModel {

    static getCategory(): Promise<ICategory[] | MongoError> {
        return Category.find()
            .select('-__v')
            .sort({'created': -1})
            .then((result: ICategory[]) => result)
            .catch((error: MongoError) => error);
    }
    
    static createCategory(newCategory: ICategory): Promise<ICategory | MongoError> {
        return Category.create(newCategory)
                .then((result: ICategory) => result)
                .catch((error: MongoError) => error);
    }

    static updateCategory(id: string | number, data: object): Promise<ICategory | MongoError> {
        return Category.findByIdAndUpdate(id, data, { new: true } )
                .then((result: ICategory) => result)
                .catch((error: MongoError) => error);
    }
}