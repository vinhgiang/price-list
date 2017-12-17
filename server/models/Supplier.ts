import { Schema, model } from 'mongoose';
import { SupplierDocument } from '../documents/SupplierDocument';
import * as moment from 'moment';

const supplierSchema = new Schema({
    name: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now }
});

const supplierModel = model<SupplierDocument>('Supliers', supplierSchema);

export class Supplier extends supplierModel {

    static async getSupplier(): Promise<SupplierDocument[] | object> {
        try {
            const suppliers = await Supplier.find({});
            const newResult = suppliers.map(e => {
                var newObj = e._doc;
                newObj.created_string = moment(e.created).format('DD-MM-YYYY HH:mm:ss');
                return newObj;
            });
            return newResult;
        } catch(ex) {
            return ex;
        }
    }

    static async createSupplier(name: string): Promise<object> {
        try {
            const supplier = new Supplier({ name });
            await supplier.save();
            return { status: 1 };
        } catch(ex) {
            return { status: 0, error: ex.message };
        }
    }

}