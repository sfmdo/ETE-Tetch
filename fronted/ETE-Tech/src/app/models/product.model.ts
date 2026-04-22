export type ItemType = 'PRODUCT' | 'SERVICE';

export interface Product {
  Product_ID?: number;
  SKU_Code: string;
  Name: string;
  Description: string;
  Category: string;
  Item_Type: ItemType;

  Cost_Price: number;
  Sale_Price: number;
  Tax_Rate: number;
  Final_Price?: number;

  Current_Stock: number;
  Minimum_Stock: number;

  Status: number;
  Image?: string;
}