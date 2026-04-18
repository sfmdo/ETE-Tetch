import request from 'supertest';
import express, { Application } from 'express';
import jwt from 'jsonwebtoken';
import connection from '../../src/config/database';
import userRoutes from '../../src/routers/user.router'; 
import UserModel from '../../src/models/user.model';

// 1. Mockear el modelo para no tocar la base de datos real
jest.mock('../../src/models/user.model');

describe('User Controller - Profile Tests', () => {
    let app: Application;
    let token: string;

    beforeAll(() => {
        // 2. Crear una mini-aplicación Express para montar las rutas
        app = express();
        app.use(express.json());
        app.use('/api/users', userRoutes);

        // 3. Generar un token falso válido para pasar el middleware de autenticación
        const secretKey = process.env.JWT_SECRET || 'fallback_development_secret_key';
        token = jwt.sign({ userId: 5, role: 'User' }, secretKey, { expiresIn: '1h' });
    });

    afterEach(() => {
        jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
    });

    afterAll(async () => {
        // Cerramos la conexión a la base de datos para que Jest pueda salir en paz
        await connection.promise().end(); 
    });

    it('Debe actualizar el perfil correctamente (PATCH /api/users/profile)', async () => {
        // Preparamos el mock para que responda como si la DB hubiera actualizado el dato
        (UserModel.update as jest.Mock).mockResolvedValue(true);
        (UserModel.findById as jest.Mock).mockResolvedValue({
            User_ID: 5,
            Full_Name: 'Nombre Actualizado',
            Phone: '1234567890'
        });

        const response = await request(app)
            .patch('/api/users/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ Full_Name: 'Nombre Actualizado', Phone: '1234567890' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Profile updated successfully');
        expect(response.body.user.Full_Name).toBe('Nombre Actualizado');
        expect(UserModel.update).toHaveBeenCalledWith(5, { Full_Name: 'Nombre Actualizado', Phone: '1234567890' });
    });

    it('Debe devolver 400 si no se envían campos válidos', async () => {
        const response = await request(app)
            .patch('/api/users/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ UnCampoInvalido: 'Hacker' }); // Enviamos basura

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No valid fields provided for update');
        expect(UserModel.update).not.toHaveBeenCalled(); // Aseguramos que la DB no se tocó
    });
});