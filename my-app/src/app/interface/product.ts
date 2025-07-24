export interface IProduct {
    _id: string;
    productType: string;
    creatorID: number;
    productName: string;
    price: number;
    description: string;
    duration: number;
    image: string;
    new: boolean;
    rating: number
}