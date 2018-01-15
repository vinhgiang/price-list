import { Document, Schema, model } from 'mongoose';
import { MongoError } from 'mongodb';

export interface IProductSupplier extends Document {
    supplier_id: string,
    product_id: string,
    price: number,
    version: number,
    created: Date
}

const ProductSupplierSchema = new Schema({
    product_id: { type: String, required: true, trim: true },
    supplier_id: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    version: { type: Number, default: 0 },
    created: { type: Date, default: Date.now }
});

ProductSupplierSchema.index({product_id: 1, supplier_id: 1, version: 1}, { unique: true });

const ProductSupplierModel = model<IProductSupplier>('Product-Supplier', ProductSupplierSchema);

export class ProductSupplier extends ProductSupplierModel {

    static getProductSupplier(version: number = null): Promise<IProductSupplier[] | MongoError> {
        return ProductSupplier.find({})
                .select('-__v')
                .sort({'created': -1})
                .then((result: IProductSupplier[]) => result)
                .catch((error: MongoError) => error);
    }

    // static createProductSupplier(newProductSupplier: ProductSupplier | ProductSupplier[]): Promise<IProductSupplier | MongoError> {
    //     return ProductSupplierModel.create(newProductSupplier)
    //         .then((results: IProductSupplier) => results)
    //         .catch((error: MongoError) => error);
    // }

}