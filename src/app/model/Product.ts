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
    wnp: number;
    version?: number;
    last_update?: Date;
    created?: Date;
    price_list?: {
        supplier: ISupplier,
        price: string,
    }[];
    [key: string]: any;
}

export class Product {
    product: IProduct;

    constructor() {
        this.product = {
            _id: '',
            sku: '',
            name: '',
            description: '',
            suppliers: null,
            brand: null,
            category: null,
            price: 0,
            wnp: 0
        };
    }
}