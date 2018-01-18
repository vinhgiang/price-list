import { IProduct } from "./Product";
import { ISupplier } from "./Supplier";

export interface IProductSupplier {
    _id?: string,
    product_id: IProduct,
    supplier_id: ISupplier,
    price: number,
    version: number,
    created: Date,
}