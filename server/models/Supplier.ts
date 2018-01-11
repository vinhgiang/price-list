import { Schema, model, Document } from 'mongoose';
import * as moment from 'moment';
import * as mongoose from 'mongoose'
import { MongoError } from 'mongodb';

export interface ISupplier extends Document {
    name: string;
    created: Date;
    [key: string] : any;
}

const supplierSchema = new Schema({
    name: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now }
});

const SupplierModel = model<ISupplier>('Supplier', supplierSchema);

export class Supplier extends SupplierModel {

    static getSupplier(): Promise<ISupplier[] | MongoError> {

        return Supplier.find()
                .select('-__v')
                .sort({'created': -1})
                .then((result: ISupplier[]) => result)
                .catch((error: MongoError) => error);
    }

    static createSupplier(newSupplier: Supplier): Promise<ISupplier | MongoError> {
        return Supplier.create(newSupplier)
                .then((result: ISupplier) => result)
                .catch((error: MongoError) => error);
    }

    static updateSupplier(id: string | number, data: object): Promise<ISupplier | MongoError> {
        return Supplier.findByIdAndUpdate(id, data, { new: true } )
                .then((result: ISupplier) => result)
                .catch((error: MongoError) => error);
    }

}