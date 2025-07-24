import { IBookingitem } from "./bookingitem";

export interface IBookingform {
    customerID: string;
    customerName: string;
    phone: string;
    orderTime: Date;
    bookingDate: Date;
    paymentMethod: string;
    total: number;
    status: string;
    bookingItems: IBookingitem[]
}
