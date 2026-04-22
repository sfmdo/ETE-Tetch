import connection from '../../src/config/database';
import ProductModel from '../../src/models/product_services.model';

// Mockeamos el pool de la base de datos
jest.mock('../../src/config/database', () => ({
    promise: jest.fn().mockReturnValue({
        query: jest.fn()
    })
}));

describe('Product Model - Business Logic & Inventory', () => {
    let mockQuery: jest.Mock;

    beforeEach(() => {
        // Extraemos la función query mockeada para manipularla en cada test
        mockQuery = connection.promise().query as jest.Mock;
        jest.clearAllMocks();
    });

    // ==========================================
    // TESTS DE MATEMÁTICA (FINAL PRICE)
    // ==========================================
    
    it('Debe calcular el Final_Price correctamente al crear (POST)', async () => {
        // Simulamos que MySQL insertó el registro y nos devuelve el ID 10
        mockQuery.mockResolvedValue([{ insertId: 10 }]);

        const newProduct = {
            SKU_Code: 'TEST-01',
            Name: 'Test Product',
            Item_Type: 'PRODUCT' as any,
            Cost_Price: 50,
            Sale_Price: 100, // Precio base
            Tax_Rate: 0.16,  // 16% IVA
            Current_Stock: 10,
            Minimum_Stock: 5,
            Status: 1
        };

        const resultId = await ProductModel.create(newProduct);

        expect(resultId).toBe(10);
        
        // Verificamos que el SQL reciba el objeto con el Final_Price ya sumado (116)
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO PRODUCTS_SERVICES SET ?'),
            expect.objectContaining({
                Sale_Price: 100,
                Tax_Rate: 0.16,
                Final_Price: 116
            })
        );
    });

    it('Debe recalcular el Final_Price al actualizar (PUT) combinando datos', async () => {
        // Simulamos la respuesta del UPDATE en MySQL
        mockQuery.mockResolvedValue([{ affectedRows: 1 }]);

        // Espiamos el método getById para simular el registro actual en la BD.
        // Esto pasa si el usuario solo envía el precio nuevo, el modelo debe buscar el impuesto viejo.
        jest.spyOn(ProductModel, 'getById').mockResolvedValue({
            Product_ID: 1,
            SKU_Code: 'TEST-01',
            Name: 'Test Product',
            Item_Type: 'PRODUCT' as any,
            Cost_Price: 50,
            Sale_Price: 100, // Precio viejo
            Tax_Rate: 0.16,  // Impuesto viejo (El modelo tomará este)
            Final_Price: 116,
            Current_Stock: 10,
            Minimum_Stock: 5,
            Status: 1
        });

        // El usuario solo actualiza el precio
        const updateData = {
            Sale_Price: 200
        };

        const result = await ProductModel.update(1, updateData);

        expect(result).toBe(true);
        
        // Verificamos que el UPDATE reciba el nuevo Final_Price (200 + 16% = 232)
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE PRODUCTS_SERVICES SET ? WHERE Product_ID = ?'),
            [
                expect.objectContaining({
                    Sale_Price: 200, 
                    Final_Price: 232 
                }),
                1 // El ID del producto
            ]
        );
    });

    // ==========================================
    // TESTS DE INVENTARIO (DEDUCT STOCK)
    // ==========================================

    it('Debe retornar true si se descontó el inventario correctamente', async () => {
        // Simulamos que MySQL nos responde que 1 fila fue afectada (éxito)
        mockQuery.mockResolvedValue([{ affectedRows: 1 }]);

        const result = await ProductModel.deductStock(1, 5);

        expect(result).toBe(true);
        // Verificamos que se pasaron los parámetros correctos al SQL [cantidad, id, cantidad]
        expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [5, 1, 5]);
    });

    it('Debe retornar false si no hay stock suficiente o es un servicio', async () => {
        // Simulamos que MySQL nos responde que 0 filas fueron afectadas (fallo)
        mockQuery.mockResolvedValue([{ affectedRows: 0 }]);

        const result = await ProductModel.deductStock(2, 50);

        expect(result).toBe(false);
    });
});