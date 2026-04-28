import { ResultSetHeader, RowDataPacket } from 'mysql2';
import connection from '../config/database';

export enum LogisticsStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    PAID = 'PAID'
}

export interface IOrder extends RowDataPacket {
    Order_ID?: number;
    Order_Number: string;
    Client_ID: number;
    Technician_ID?: number | null;
    Brand_Model?: string | null;
    Reported_Fault?: string | null;
    Final_Diagnosis?: string | null;
    Applied_Solution?: string | null;
    Logistics_Status: LogisticsStatus;
    Order_Total?: number;
    Pending_Balance?: number;
    Creation_Date?: Date;
}

class OrderModel {
    async create(data: Omit<IOrder, 'Order_ID' | 'Creation_Date'>, txConnection?: any): Promise<number> {
        const db = txConnection || connection.promise();
        const query = `INSERT INTO SALES_ORDERS SET ?`;
        
        const [result] = await db.query(query, data) as [ResultSetHeader, any];
        return result.insertId;
    }
    async getAll(): Promise<IOrder[]> {
    const query = `SELECT * FROM SALES_ORDERS ORDER BY Creation_Date DESC`;
    const [rows] = await connection.promise().query<IOrder[]>(query);
    return rows;
    }

    async updateTotals(orderId: number, total: number, balance: number, txConnection?: any): Promise<boolean> {
        const db = txConnection || connection.promise();
        const query = `UPDATE SALES_ORDERS SET Order_Total = ?, Pending_Balance = ? WHERE Order_ID = ?`;
        
        const [result] = await db.query(query, [total, balance, orderId]) as [ResultSetHeader, any];
        return result.affectedRows > 0;
    }

    async updateStatus(orderId: number, status: LogisticsStatus): Promise<boolean> {
        const query = `UPDATE SALES_ORDERS SET Logistics_Status = ? WHERE Order_ID = ?`;
        const [result] = await connection.promise().query<ResultSetHeader>(query, [status, orderId]);
        return result.affectedRows > 0;
    }

    async getById(id: number): Promise<IOrder | null> {
        const query = `SELECT * FROM SALES_ORDERS WHERE Order_ID = ?`;
        const [rows] = await connection.promise().query<IOrder[]>(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async updateTechnicalInfo(id: number, data: { Final_Diagnosis: string, Applied_Solution: string, Technician_ID: number }): Promise<boolean> {
        const query = `UPDATE SALES_ORDERS SET Final_Diagnosis = ?, Applied_Solution = ?, Technician_ID = ? WHERE Order_ID = ?`;
        const [result] = await connection.promise().query<ResultSetHeader>(query, [data.Final_Diagnosis, data.Applied_Solution, data.Technician_ID, id]);
        return result.affectedRows > 0;
    }

}

export default new OrderModel();