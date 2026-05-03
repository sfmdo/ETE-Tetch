import { RowDataPacket } from 'mysql2';


export interface IUser extends RowDataPacket {
    User_ID?: number;
    Full_Name: string;
    Email: string;
    Password: string;
    Phone?: string;
    Role: string;
    Status: number;
}

