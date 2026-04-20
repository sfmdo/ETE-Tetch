import OrderModel, { LogisticsStatus } from '../../src/models/order.model';
import connection from '../../src/config/database';

jest.mock('../../src/config/database', () => ({
    promise: jest.fn().mockReturnThis(),
    query: jest.fn()
}));

describe('OrderModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create an order and return insertId', async () => {
        const mockData = {
            Order_Number: 'ORD-123',
            Client_ID: 1,
            Logistics_Status: LogisticsStatus.PENDING,
            Brand_Model: 'Test Brand',
            Reported_Fault: 'Test Fault'
        };

        (connection.promise().query as jest.Mock).mockResolvedValue([{ insertId: 99 }]);

        const result = await OrderModel.create(mockData);
        
        expect(result).toBe(99);
        expect(connection.promise().query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO ORDERS'),
            mockData
        );
    });

    test('should return null if order is not found by ID', async () => {
        (connection.promise().query as jest.Mock).mockResolvedValue([[]]);

        const result = await OrderModel.getById(404);
        
        expect(result).toBeNull();
    });
});