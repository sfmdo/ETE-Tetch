export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAID' | 'CANCELLED';

export interface CreateOrderPayload {
  Client_ID: number;
  Service_ID: number;
  Brand_Model: string;
  Reported_Fault: string;
}

export interface CreateOrderResponse {
  message: string;
  summary: {
    orderId: number;
    orderNumber: string;
    brandModel: string;
    baseCost: number;
  };
}

export interface AddItemsPayload {
  Order_ID: number;
  items: OrderItem[];
}

export interface OrderItem {
  Product_ID: number;
  Quantity: number;
}

export interface AddItemsResponse {
  message: string;
  newTotal: number;
}

export interface DiagnosisPayload {
  Technician_ID: number;
  Final_Diagnosis: string;
  Applied_Solution: string;
}

export interface UpdateStatusPayload {
  status: OrderStatus;
}

export interface Order {
  Order_ID: number;
  Order_Number: string;
  Client_ID: number;
  Service_ID: number;
  Brand_Model: string;
  Reported_Fault: string;
  Final_Diagnosis?: string;
  Applied_Solution?: string;
  Technician_ID?: number;
  Logistics_Status: OrderStatus;
  Total_Cost: number;
  Created_At: Date;
  Items: OrderItem[];
}