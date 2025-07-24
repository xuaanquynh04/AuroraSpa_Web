import { ICartitem } from "./cartitem";

export interface IBookingitem {
    product: ICartitem;
    selectedTime: Date

}