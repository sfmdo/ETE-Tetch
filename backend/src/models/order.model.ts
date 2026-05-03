import { RowDataPacket } from 'mysql2';

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
