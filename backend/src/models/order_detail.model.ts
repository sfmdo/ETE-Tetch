import { RowDataPacket } from 'mysql2';

export interface IOrderDetail extends RowDataPacket {
    Detail_ID?: number;
    Order_ID: number;
    Product_ID: number;
    Quantity: number;
    Unit_Price: number;
    Line_Subtotal: number;
}
