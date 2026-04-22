import { ResultSetHeader, RowDataPacket } from 'mysql2';
import connection from '../config/database';

export interface IOrderDetail extends RowDataPacket {
    Detail_ID?: number;
    Order_ID: number;
    Product_ID: number;
    Quantity: number;
    Unit_Price: number;
    Line_Subtotal: number;
}

class OrderDetailModel {
    async create(data: Omit<IOrderDetail, 'Detail_ID'>, txConnection?: any): Promise<number> {
        const db = txConnection || connection.promise();
        const query = `INSERT INTO ORDER_DETAILS SET ?`;
        
        const [result] = await db.query(query, data) as [ResultSetHeader, any];
        return result.insertId;
    }

    async createMany(details: Omit<IOrderDetail, 'Detail_ID'>[], dbConnection = connection): Promise<boolean> {
        if (details.length === 0) return false;

        const query = `INSERT INTO ORDER_DETAILS (Order_ID, Product_ID, Quantity, Unit_Price, Line_Subtotal) VALUES ?`;
        
        const values = details.map(d => [d.Order_ID, d.Product_ID, d.Quantity, d.Unit_Price, d.Line_Subtotal]);
        
        const [result] = await dbConnection.promise().query<ResultSetHeader>(query, [values]);
        return result.affectedRows > 0;
    }

    async getByOrderId(orderId: number): Promise<IOrderDetail[]> {
        const query = `SELECT * FROM ORDER_DETAILS WHERE Order_ID = ?`;
        const [rows] = await connection.promise().query<IOrderDetail[]>(query, [orderId]);
        return rows;
    }
}

export default new OrderDetailModel();