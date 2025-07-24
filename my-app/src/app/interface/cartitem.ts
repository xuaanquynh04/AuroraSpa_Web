import { IOptions } from "./customize";
import { IProduct } from "./product";

export interface ICartitem {
    product: IProduct;
    quantity: number;
    selectedOptions: IOptions[]
    itemPrice: number;

}