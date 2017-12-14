import * as mongoose from 'mongoose';

export interface BrandDocument extends mongoose.Document {
    _id: String;
    name: String;
    created: Date;
    [key: string]: any;
}