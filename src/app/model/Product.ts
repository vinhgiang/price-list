import { ICategory } from "./Category";
import { IBrand } from "./Brand";
import { ISupplier } from "./Supplier";

export interface IProduct {
    _id?: string;
    sku: string;
    name: string;
    description: string;
    suppliers: ISupplier[];
    category: ICategory;
    brand: IBrand;
    price: number;
    created: Date;
    last_update: Date;
}