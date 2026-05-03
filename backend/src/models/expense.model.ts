import { RowDataPacket } from 'mysql2';


export interface IExpense extends RowDataPacket {
    Expense_ID?: number;
    Admin_Registry_ID?: number | null;
    Description: string;
    Amount: number;
    Expense_Date?: Date;
}
