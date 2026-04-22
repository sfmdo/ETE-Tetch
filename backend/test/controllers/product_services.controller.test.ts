import request from 'supertest';
import express, { Application } from 'express';
import jwt from 'jsonwebtoken';
import connection from '../../src/config/database';
import productRoutes from '../../src/routers/product_services.router'; 
import ProductModel from '../../src/models/product_services.model'; 

jest.mock('../../src/models/product_services.model');

describe('Products Controller Tests', () => {
    let app: Application;
    let token: string;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api/products', productRoutes);

        const secretKey = process.env.JWT_SECRET || 'fallback_development_secret_key';
        token = jwt.sign({ userId: 1, role: 'Admin' }, secretKey, { expiresIn: '1h' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await connection.promise().end(); 
    });

    // ==========================================
    // TEST: GET ALL PRODUCTS
    // ==========================================
    it('Debe obtener todos los productos (GET /api/products/all)', async () => {
        const mockProducts = [{ Product_ID: 1, Name: 'Mouse', Sale_Price: 20 }];
        (ProductModel.get as jest.Mock).mockResolvedValue(mockProducts);

        const response = await request(app)
            .get('/api/products/all')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProducts);
        expect(ProductModel.get).toHaveBeenCalled();
    });

    // ==========================================
    // TEST: CREATE PRODUCT
    // ==========================================
    it('Debe crear un producto correctamente (POST /api/products/)', async () => {
        (ProductModel.create as jest.Mock).mockResolvedValue(10); // Simulamos que se insertó con ID 10

        const newProduct = {
            SKU_Code: "TEST-01",
            Name: "Test Product",
            Item_Type: "PRODUCT",
            Sale_Price: 100,
            Tax_Rate: 0.16
        };

        const response = await request(app)
            .post('/api/products/')
            .set('Authorization', `Bearer ${token}`)
            .send(newProduct);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Record created'); // Ajusta según tu mensaje exacto
    });

    // ==========================================
    // TEST: UPDATE PRODUCT
    // ==========================================
    it('Debe actualizar un producto (PUT /api/products/:id)', async () => {
        (ProductModel.update as jest.Mock).mockResolvedValue(true);

        const response = await request(app)
            .put('/api/products/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ Sale_Price: 150 });

        expect(response.status).toBe(200);
        expect(ProductModel.update).toHaveBeenCalledWith(1, { Sale_Price: 150 });
    });

    // ==========================================
    // TEST: DELETE PRODUCT
    // ==========================================
    it('Debe eliminar un producto (DELETE /api/products/:id)', async () => {
        (ProductModel.delete as jest.Mock).mockResolvedValue(true);

        const response = await request(app)
            .delete('/api/products/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(ProductModel.delete).toHaveBeenCalledWith(1);
    });

    
});