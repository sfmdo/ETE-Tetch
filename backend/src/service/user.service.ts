    import { ResultSetHeader } from 'mysql2';
    import connection from '../config/database'; 
    import { IUser } from '../models/user.model';
    import bcrypt from 'bcrypt';


    class UserService {
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
            const query = 'SELECT User_ID, Full_Name, Email, Role, Phone, Status FROM USERS WHERE User_ID = ?';
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

        async changePassword(id: number, contrasenaActual: string, nuevaContrasena: string): Promise<{ success: boolean; message: string }> {
        const querySelect = 'SELECT Password FROM USERS WHERE User_ID = ?';
        const [rows] = await connection.promise().query<IUser[]>(querySelect, [id]);

        if (rows.length === 0) {
            return { success: false, message: 'Usuario no encontrado.' };
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(contrasenaActual, user.Password);
        if (!isMatch) {
            return { success: false, message: 'La contraseña actual es incorrecta.' };
        }

        const salt = await bcrypt.genSalt(10);
        const nuevaContrasenaHash = await bcrypt.hash(nuevaContrasena, salt);

        const queryUpdate = 'UPDATE USERS SET Password = ? WHERE User_ID = ?';
        const [result] = await connection.promise().query<ResultSetHeader>(queryUpdate, [nuevaContrasenaHash, id]);

        if (result.affectedRows > 0) {
            return { success: true, message: 'Contraseña actualizada con éxito.' };
        }

        return { success: false, message: 'No se pudo actualizar la contraseña.' };
        }
        
        async updatePasswordByEmail(email: string, nuevaContrasena: string): Promise<boolean> {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(nuevaContrasena, salt);

            const query = 'UPDATE USERS SET Password = ? WHERE Email = ?';
            const [result] = await connection.promise().query<ResultSetHeader>(query, [hashPassword, email]);

            return result.affectedRows > 0;
        }
    }

    export default new UserService();