import { Schema, model, Document } from 'mongoose';
import { MongoError } from 'mongodb';
import { ICategory } from './Category';
import { IBrand } from './Brand';
import { ISupplier } from './Supplier';

export interface IProduct extends Document {
    sku: string;
    name: string;
    description: string;
    category: ICategory;
    brand: IBrand;
    suppliers: ISupplier[];
    price: number;
    previous_price: number;
    version: number;
    created: Date;
    last_update: Date;
    [key: string] : any;
}

const ProductSchema = new Schema({
    sku: { type: String, required: true, trim: true, index: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    suppliers: [{ type: Schema.Types.ObjectId, ref: 'Supplier' }],
    previous_price: { type: Number, default: 0 },
    price: { type: Number },
    version: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
    last_update: { type: Date, default: Date.now },
});

const ProductModel = model<IProduct>('Product', ProductSchema);

export class Product extends ProductModel {

    static getProduct(): Promise<IProduct[] | MongoError> {
        return Product.find({})
                .populate('suppliers', 'name')
                .populate('brand', 'name')
                .populate('category', { name: 'name', ebay_au: 'ebay_au', ebay_uk: 'ebay_uk' } )
                .select('-__v')
                .sort({'last_update': -1})
                .then((result: IProduct[]) => result)
                .catch((error: MongoError) => error);
    }

    static createProduct(newProduct: IProduct): Promise<IProduct | MongoError> {
        return Product.create(newProduct)
                .then((result: IProduct) => result)
                .catch((error: MongoError) => error);
    }

    static updateProduct(id: string, data: object): Promise<IProduct | MongoError> {
        return Product.findByIdAndUpdate(id, data, { new: true })
                .then((result: IProduct) => result)
                .catch((error: MongoError) => error);
    }
}