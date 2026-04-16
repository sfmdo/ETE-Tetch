import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connection from '../config/database'; // Ajusta la ruta según tu estructura
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
    // Buscar por Email (Crucial para el Login)
    async findByEmail(email: string): Promise<IUser | null> {
        const query = 'SELECT * FROM USERS WHERE Email = ?';
        const [rows] = await connection.promise().query<IUser[]>(query, [email]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Crear Usuario (con Hash de contraseña)
    async create(user: Omit<IUser, 'User_ID'>): Promise<number> {
        // Encriptar la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(user.Password, salt);

        const query = 'INSERT INTO USERS SET ?';
        const [result] = await connection.promise().query<ResultSetHeader>(query, user);
        return result.insertId;
    }

    // Obtener por ID
    async findById(id: number): Promise<IUser | null> {
        const query = 'SELECT User_ID, Full_Name, Email, Role, Status FROM USERS WHERE User_ID = ?';
        const [rows] = await connection.promise().query<IUser[]>(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }
}

export default new UserModel();