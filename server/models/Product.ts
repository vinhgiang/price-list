import { Schema, model } from 'mongoose';
import * as moment from 'moment'
import { ProductDocument } from '../documents/ProductDocument';

const ProductSchema = new Schema({
    sku: { type: String, required: true, trim: true, index: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    previous_price: { type: Number, default: 0 },
    price: { type: Number, required: true },
    created: { type: Date, default: Date.now },
    last_update: { type: Date, default: Date.now },
});

const ProductModel = model<ProductDocument>('Product', ProductSchema);

export class Product extends ProductModel {

    static async getProduct(): Promise<ProductDocument[] | object> {
        try {
            const products = await Product.find({})
                .populate('supplier', 'name')
                .populate('brand', 'name')
                .populate('category', { name: 'name', ebay_au: 'ebay_au', ebay_uk: 'ebay_uk' } );
            const newResult = products.map(e => {
                var newObj = e._doc;
                newObj.created_string = moment(e.created).format('DD-MM-YYYY HH:mm:ss');
                newObj.last_updated_string = moment(e.last_update).format('DD-MM-YYYY HH:mm:ss');
                return newObj;
            });
            return newResult;
        } catch(ex) {
            return ex;
        }
    }

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

    static async updateProduct(id: string, data: object): Promise<object> {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true } );
            return { status: 1 };
        } catch(ex) {
            return { status: 0, error: ex.message };
        }
    }
}