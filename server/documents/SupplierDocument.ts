import * as mongoose from 'mongoose'

export interface SupplierDocument extends mongoose.Document {
    _id: string;
    name: string;
    created: Date;
    [key: string] : any;
}