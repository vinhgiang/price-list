import { Category } from "./Category";
import { Brand } from "./Brand";

export interface Product {
    _id?: string;
    sku: string;
    name: string;
    description: string;
    category: Category;
    brand: Brand;
    price: number;
    created: Date;
    last_update: Date;
}