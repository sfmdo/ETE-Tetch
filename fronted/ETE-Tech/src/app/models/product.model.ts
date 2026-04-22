export interface Product {

  Product_ID: number;
  SKU_Code: string;

  Name: string;
  Description: string;
  Category: string;

  Item_Type: string;

  Cost_Price: number;
  Sale_Price: number;
  Tax_Rate: number;
  
  Final_Price?: number; 

  Image: string;
  Status: number; 

}