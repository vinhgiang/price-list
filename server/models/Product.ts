import { Schema, model } from 'mongoose';
import { ProductDocument } from '../documents/ProductDocument';

const ProductSchema = new Schema({
    sku: { type: String, required: true, trim: true, index: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    price: { type: Number, required: true },
    created: { type: Date, default: Date.now },
    last_update: { type: Date },
});

const ProductModel = model<ProductDocument>('Product', ProductSchema);

export class Product extends ProductModel {

    static async createProduct(sku: string, name: string, supplierId: string, brandId: string, categoryId: string, description: string, price: number): Promise<object> {
        const product = new Product({
            sku,
            name,
            description,
            category: categoryId,
            brand: brandId,
            price: price,
            supplier: supplierId
        })
        try {
            await product.save();
            return { status: 1 };
        } catch(ex) {
            return { status: 0, error: ex.message };
        }
    }
}