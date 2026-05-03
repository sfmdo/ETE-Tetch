import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { IOrder,LogisticsStatus } from '../models/order.model';
import OrderDetailService from './order_detail.service';
import ProductServicesService from '../service/product_services.service';
import connection from '../config/database';

class OrderService {
    async create(data: Omit<IOrder, 'Order_ID' | 'Creation_Date'>, txConnection?: any): Promise<number> {
        const db = txConnection || connection.promise();
        const query = `INSERT INTO SALES_ORDERS SET ?`;
        const [result] = await db.query(query, data) as [ResultSetHeader, any];
        return result.insertId;
    }
    async getAll(): Promise<IOrder[]> {
    const query = `SELECT 
            o.*, 
            uc.Full_Name AS Client_Name, 
            ut.Full_Name AS Technician_Name
        FROM \`SALES_ORDERS\` o
        LEFT JOIN \`USERS\` uc ON o.Client_ID = uc.User_ID
        LEFT JOIN \`USERS\` ut ON o.Technician_ID = ut.User_ID
        ORDER BY o.Creation_Date DESC`;
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
    const query = `
        UPDATE SALES_ORDERS 
        SET Logistics_Status = CASE 
            WHEN ? = 'COMPLETED' AND Pending_Balance <= 0 THEN 'PAID'
            ELSE ? 
        END
        WHERE Order_ID = ?
    `;
    
    const [result] = await connection.promise().query<ResultSetHeader>(query, [
        status, 
        status, 
        orderId
    ]);
    
    return result.affectedRows > 0;
}

    async getById(id: number): Promise<IOrder | null> {

        const query = `
            SELECT 
                o.*,
                uc.Full_Name AS Client_Name,
                ut.Full_Name AS Technician_Name
        FROM SALES_ORDERS o 
        LEFT JOIN USERS ut ON o.Technician_ID = ut.User_ID 
        LEFT JOIN USERS uc ON o.Client_ID = uc.User_ID 
        WHERE o.Order_ID = ?`; 

    const [rows] = await connection.promise().query<RowDataPacket[]>(query, [id]);
    return rows.length > 0 ? (rows[0] as IOrder) : null;
}

    async updateTechnicalInfo(id: number, data: { Final_Diagnosis: string, Applied_Solution: string, Technician_ID: number }): Promise<boolean> {
        const query = `UPDATE SALES_ORDERS SET Final_Diagnosis = ?, Applied_Solution = ?, Technician_ID = ? WHERE Order_ID = ?`;
        const [result] = await connection.promise().query<ResultSetHeader>(query, [data.Final_Diagnosis, data.Applied_Solution, data.Technician_ID, id]);
        return result.affectedRows > 0;
    }

    async createInitialOrder(payload: any) {
        const conn = await connection.promise().getConnection();
        try {
        await conn.beginTransaction();


            const orderId = await this.create({
                Order_Number: `ORD-${Date.now()}`,
                Client_ID: payload.Client_ID,
                Brand_Model: payload.Brand_Model,
                Reported_Fault: payload.Reported_Fault,
                Logistics_Status: 'PENDING',
                Order_Total: 0,
                Pending_Balance: 0
            }, conn);


            const service = await ProductServicesService.getById(payload.Service_ID);
            if (!service) throw new Error("Servicio no válido");

            await OrderDetailService.create({
                Order_ID: orderId,
                Product_ID: payload.Service_ID,
                Quantity: 1,
                Unit_Price: service.Final_Price,
                Line_Subtotal: service.Final_Price
            }, conn);

            // 4. Lógica: Actualizar totales finales
            await this.updateTotals(orderId, service.Final_Price, service.Final_Price, conn);

            await conn.commit();
            return { orderId, total: service.Final_Price };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    async registerPayment(orderId: number, paymentAmount: number): Promise<boolean> {
        const query = `
            UPDATE SALES_ORDERS 
            SET 
                Pending_Balance = GREATEST(Pending_Balance - ?, 0)
            WHERE Order_ID = ?
        `;
        const [result] = await connection.promise().query<ResultSetHeader>(query, [
            paymentAmount, 
            paymentAmount, 
            orderId
        ]);
        
        return result.affectedRows > 0;
    }

    async getAllByClient(clientId: number): Promise<IOrder[]> {
        const query = `
            SELECT 
                o.*, 
                uc.Full_Name AS Client_Name, 
                ut.Full_Name AS Technician_Name
            FROM SALES_ORDERS o
            LEFT JOIN USERS uc ON o.Client_ID = uc.User_ID
            LEFT JOIN USERS ut ON o.Technician_ID = ut.User_ID
            WHERE o.Client_ID = ?
            ORDER BY o.Creation_Date DESC
        `;
        const [rows] = await connection.promise().query<IOrder[]>(query, [clientId]);
        return rows;
    }

    async getByIdAndClient(orderId: number, clientId: number): Promise<IOrder | null> {
        const query = `
            SELECT 
                o.*,
                uc.Full_Name AS Client_Name,
                ut.Full_Name AS Technician_Name
            FROM SALES_ORDERS o 
            LEFT JOIN USERS ut ON o.Technician_ID = ut.User_ID 
            LEFT JOIN USERS uc ON o.Client_ID = uc.User_ID 
            WHERE o.Order_ID = ? AND o.Client_ID = ?
        `; 
        
        const [rows] = await connection.promise().query<RowDataPacket[]>(query, [orderId, clientId]);
        return rows.length > 0 ? (rows[0] as IOrder) : null;
    }

}

export default new OrderService();