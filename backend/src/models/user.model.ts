import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connection from '../config/database'; 
import bcrypt from 'bcrypt';

export interface IUser extends RowDataPacket {
    User_ID?: number;
    Full_Name: string;
    Email: string;
    Password: string;
    Phone?: string;
    Role: string;
    Status: number;
}

class UserModel {
    async findByEmail(email: string): Promise<IUser | null> {
        const query = 'SELECT * FROM USERS WHERE Email = ?';
        const [rows] = await connection.promise().query<IUser[]>(query, [email]);
        return rows.length > 0 ? rows[0] : null;
    }

    async create(user: Omit<IUser, 'User_ID'>): Promise<number> {
        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(user.Password, salt);

        const query = 'INSERT INTO USERS SET ?';
        const [result] = await connection.promise().query<ResultSetHeader>(query, user);
        return result.insertId;
    }

    async findById(id: number): Promise<IUser | null> {
        const query = 'SELECT User_ID, Full_Name, Email, Role, Status FROM USERS WHERE User_ID = ?';
        const [rows] = await connection.promise().query<IUser[]>(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async update(id: number, userData: Partial<IUser>): Promise<boolean> {
        if (userData.Password) {
            const salt = await bcrypt.genSalt(10);
            userData.Password = await bcrypt.hash(userData.Password, salt);
        }

        const query = 'UPDATE USERS SET ? WHERE User_ID = ?';
        const [result] = await connection.promise().query<ResultSetHeader>(query, [userData, id]);
        
        return result.affectedRows > 0;
    }
}

export default new UserModel();