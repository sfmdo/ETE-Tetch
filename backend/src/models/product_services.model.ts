import { RowDataPacket } from 'mysql2';


export enum ItemType {
    PRODUCT = 'PRODUCT',
    SERVICE = 'SERVICE'
}

export interface IProductServices extends RowDataPacket {
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
