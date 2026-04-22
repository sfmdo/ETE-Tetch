import { ResultSetHeader, RowDataPacket } from 'mysql2';
import connection from '../config/database';

export interface IExpense extends RowDataPacket {
    Expense_ID?: number;
    Admin_Registry_ID?: number | null;
    Description: string;
    Amount: number;
    Expense_Date?: Date;
}

class ExpenseModel {
    async create(data: Omit<IExpense, 'Expense_ID' | 'Expense_Date'>): Promise<number> {
        const query = `INSERT INTO EXPENSES SET ?`;
        const [result] = await connection.promise().query<ResultSetHeader>(query, data);
        return result.insertId;
    }

    async getAll(): Promise<IExpense[]> {
        const query = `SELECT * FROM EXPENSES ORDER BY Expense_Date DESC`;
        const [rows] = await connection.promise().query<IExpense[]>(query);
        return rows;
    }

    async getById(id: number): Promise<IExpense | null> {
        const query = `SELECT * FROM EXPENSES WHERE Expense_ID = ?`;
        const [rows] = await connection.promise().query<IExpense[]>(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async delete(id: number): Promise<boolean> {
        const query = `DELETE FROM EXPENSES WHERE Expense_ID = ?`;
        const [result] = await connection.promise().query<ResultSetHeader>(query, [id]);
        return result.affectedRows > 0;
    }
}

export default new ExpenseModel();