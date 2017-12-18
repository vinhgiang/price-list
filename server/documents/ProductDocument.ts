import * as mongoose from 'mongoose';
import { BrandDocument } from './BrandDocument';
import { CategoryDocument } from './CategoryDocument';

export interface ProductDocument extends mongoose.Document {
    _id: String;
    sku: string;
    name: string;
    description: string;
    category: CategoryDocument;
    brand: BrandDocument;
    price: number;
    created: Date;
    last_update: Date;
    [key: string] : any;
}