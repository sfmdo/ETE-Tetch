import { ResultSetHeader, RowDataPacket } from 'mysql2';
import connection from '../config/database';

export enum ItemType {
    PRODUCT = 'PRODUCT',
    SERVICE = 'SERVICE'
}

export interface IProductService extends RowDataPacket {
    Product_ID?: number;
    SKU_Code: string;
    Name: string;
    Description?: string;
    Category?: string;
    Item_Type: ItemType;
    Cost_Price: number;
    Sale_Price: number;
    Tax_Rate: TaxRate;
    Final_Price: number; 
    Current_Stock: number;
    Minimum_Stock: number;
    Status: number;
    Image?: string;
}

export enum TaxRate {
    IVA_16 = 0.16
}

class ProductServiceModel {
    
    private calculateFinalPrice(salePrice: number, taxRate: number): number {
        return Number((salePrice * (1 + taxRate)).toFixed(2));
    }

    async create(data: Omit<IProductService, 'Product_ID' | 'Final_Price'>): Promise<number> {
        const finalPrice = this.calculateFinalPrice(data.Sale_Price, data.Tax_Rate);
        
        const productData = {
            ...data,
            Final_Price: finalPrice
        };

        const query = `INSERT INTO PRODUCTS_SERVICES SET ?`;
        const [result] = await connection.promise().query<ResultSetHeader>(query, productData);
        return result.insertId;
    }

    async update(id: number, data: Partial<IProductService>): Promise<boolean> {
        let updateData = { ...data };

        // Si se intenta cambiar el precio o el impuesto, debemos recalcular el Final_Price
        if (data.Sale_Price !== undefined || data.Tax_Rate !== undefined) {
            // Buscamos los valores actuales en la DB para los campos que NO vienen en el update
            const current = await this.getById(id);
            if (current) {
                const price = data.Sale_Price ?? current.Sale_Price;
                const tax = data.Tax_Rate ?? current.Tax_Rate;
                updateData.Final_Price = this.calculateFinalPrice(price, tax);
            }
        }

        const query = `UPDATE PRODUCTS_SERVICES SET ? WHERE Product_ID = ?`;
        const [result] = await connection.promise().query<ResultSetHeader>(query, [updateData, id]);
        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const query = `DELETE FROM PRODUCTS_SERVICES WHERE Product_ID = ?`;
        const [result] = await connection.promise().query<ResultSetHeader>(query, [id]);
        return result.affectedRows > 0;
    }

    async get(filters?: Partial<IProductService>): Promise<IProductService[]> {
        let query = `SELECT * FROM PRODUCTS_SERVICES`;
        const params: any[] = [];

        if (filters && Object.keys(filters).length > 0) {
            const conditions = Object.keys(filters).map(key => {
                params.push((filters as any)[key]);
                return `${key} = ?`;
            });
            query += ` WHERE ` + conditions.join(' AND ');
        }

        const [rows] = await connection.promise().query<IProductService[]>(query, params);
        const productosFormateados = (rows as any[]).map(row => {
            return {
                ...row, 
                Cost_Price: parseFloat(row.Cost_Price),
                Sale_Price: parseFloat(row.Sale_Price),
                Tax_Rate: parseFloat(row.Tax_Rate),
                Final_Price: row.Final_Price != null ? parseFloat(row.Final_Price) : undefined
            };
        });
        return productosFormateados as IProductService[];
    }

    async getById(id: number): Promise<IProductService | null> {
    const [rows] = await connection.promise().query(
        'SELECT * FROM PRODUCTS_SERVICES WHERE Product_ID = ?', 
        [id]
    );

    const filas = rows as any[];

    if (filas.length === 0) {
        return null;
    }

    const row = filas[0];

    const productoFormateado = {
        ...row,
        Cost_Price: parseFloat(row.Cost_Price), 
        Sale_Price: parseFloat(row.Sale_Price),
        Tax_Rate: parseFloat(row.Tax_Rate),
        Final_Price: row.Final_Price != null ? parseFloat(row.Final_Price) : undefined
    };

    return productoFormateado as IProductService;
    }

    async deductStock(productId: number, quantity: number, txConnection?: any): Promise<boolean> {
        const db = txConnection || connection.promise(); 

        const query = `
            UPDATE PRODUCTS_SERVICES 
            SET Current_Stock = Current_Stock - ? 
            WHERE Product_ID = ? 
                AND Item_Type = 'PRODUCT' 
                AND Current_Stock >= ?
        `;
        
        const [result] = await db.query(query, [quantity, productId, quantity]) as [ResultSetHeader, any];
        
        return result.affectedRows > 0;
    }
}

export default new ProductServiceModel();