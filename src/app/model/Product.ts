import { ICategory } from "./Category";
import { IBrand } from "./Brand";
import { ISupplier } from "./Supplier";
import { IProductSupplier } from "./Product-Supplier";

export interface IProduct {
    _id?: string;
    sku: string;
    name: string;
    description: string;
    suppliers: ISupplier[];
    category: ICategory;
    brand: IBrand;
    price: number;
    version: number;
    last_update: Date;
    created: Date;
    price_list?: {
        supplier: ISupplier,
        price: string,
    }[];
    [key: string]: any;
}