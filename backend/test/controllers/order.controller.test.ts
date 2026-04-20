import request from 'supertest';
import express from 'express';
import orderRouter from '../../src/routers/order.router';
import ProductModel from '../../src/models/product_services.model';
import OrderModel from '../../src/models/order.model';
import connection from '../../src/config/database';

const app = express();
app.use(express.json());
app.use('/api/orders', orderRouter);

// Mocks de los modelos y DB
jest.mock('../../src/models/product_services.model');
jest.mock('../../src/models/order.model');
jest.mock('../../src/models/order_detail.model');
jest.mock('../../src/config/database', () => ({
    promise: jest.fn().mockReturnThis(),
    getConnection: jest.fn().mockResolvedValue({
        beginTransaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
        query: jest.fn(),
        promise: jest.fn().mockReturnThis()
    })
}));
jest.mock('../../src/middleware/auth.middleware', () => ({
    verifyToken: (req: any, res: any, next: any) => next() 
}));

describe('OrderController Integration Tests', () => {

    describe('POST /api/orders (createInitialOrder)', () => {
        test('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/orders')
                .send({ Brand_Model: 'Only one field' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Brand, Model, Description, and Service are required.");
        });

        test('should create order successfully (Status 201)', async () => {
            // Simulamos que el servicio existe
            (ProductModel.getById as jest.Mock).mockResolvedValue({
                Final_Price: 100.00,
                Item_Type: 'SERVICE'
            });
            (OrderModel.create as jest.Mock).mockResolvedValue(1);

            const response = await request(app)
                .post('/api/orders')
                .send({
                    Client_ID: 1,
                    Brand_Model: 'iPhone 15',
                    Reported_Fault: 'Dead battery',
                    Service_ID: 10
                });

            expect(response.status).toBe(201);
            expect(response.body.summary.baseCost).toBe(100.00);
        });
    });

    describe('POST /api/orders/add-items (Transaction Check)', () => {
        test('should rollback and return 400 if stock is insufficient', async () => {
            // 1. La orden existe
            (OrderModel.getById as jest.Mock).mockResolvedValue({ 
                Order_ID: 1, 
                Logistics_Status: 'PENDING',
                Order_Total: 100
            });
            // 2. El producto existe
            (ProductModel.getById as jest.Mock).mockResolvedValue({
                Name: 'Screen Replacement',
                Final_Price: 50,
                Item_Type: 'PRODUCT'
            });
            // 3. ¡FALLA EL STOCK!
            (ProductModel.deductStock as jest.Mock).mockResolvedValue(false);

            const response = await request(app)
                .post('/api/orders/add-items')
                .send({
                    Order_ID: 1,
                    items: [{ Product_ID: 5, Quantity: 1 }]
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Insufficient stock");
        });
    });
});