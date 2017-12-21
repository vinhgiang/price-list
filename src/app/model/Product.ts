import { Category } from "./Category";
import { Brand } from "./Brand";
import { Supplier } from "./Supplier";

export interface Product {
    _id?: string;
    sku: string;
    name: string;
    description: string;
    supplier: Supplier;
    category: Category;
    brand: Brand;
    price: number;
    created: Date;
    last_update: Date;
}