import { Schema, model } from 'mongoose';
import { ProductDocument } from '../documents/ProductDocument';

const ProductSchema = new Schema({
    sku: { type: String, required: true, trim: true, index: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    price: { type: Number, required: true },
    created: { type: String, default: Date.now },
    last_update: { type: Date },
});

const ProductModel = model<ProductDocument>('Product', ProductSchema);

export class Product extends ProductModel {
    
}