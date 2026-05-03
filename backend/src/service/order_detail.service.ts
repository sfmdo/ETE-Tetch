import { ResultSetHeader } from 'mysql2';
import connection from '../config/database';
import { IOrderDetail } from '../models/order_detail.model';


class OrderDetailServicel {
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
        const query = `SELECT 
                        od.*,
                        p.Name AS Product_Name, 
                        p.Item_Type AS Product_Type
                    FROM ORDER_DETAILS od
                    JOIN PRODUCTS_SERVICES p ON od.Product_ID = p.Product_ID
                    WHERE od.Order_ID = ?`;
        const [rows] = await connection.promise().query<IOrderDetail[]>(query, [orderId]);
        return rows;
    }

}

export default new OrderDetailServicel();