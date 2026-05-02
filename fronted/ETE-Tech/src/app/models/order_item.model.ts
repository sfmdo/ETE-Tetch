export interface OrderItem {
  Product_ID: number;
  Product_Name: string;
  Product_Type: string;
  Quantity: number;
  Unit_Price: number;
  Item_Type: 'PRODUCT' | 'SERVICE';
}