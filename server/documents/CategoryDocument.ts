import * as mongoose from 'mongoose';

export interface CategoryDocument extends mongoose.Document {
    _id: string;
    name: string;
    ebay_au: string;
    ebay_uk: string;
    created: Date;
    [key: string]: any;
}