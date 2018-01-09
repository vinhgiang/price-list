import { Category } from "./Category";
import { IBrand } from "./Brand";
import { Supplier } from "./Supplier";

export interface Product {
    _id?: string;
    sku: string;
    name: string;
    description: string;
    supplier: Supplier;
    category: Category;
    brand: IBrand;
    price: number;
    created: Date;
    last_update: Date;
}