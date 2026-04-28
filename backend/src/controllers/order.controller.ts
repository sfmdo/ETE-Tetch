import { Request, Response } from 'express';
import connection from '../config/database';
import OrderModel, { LogisticsStatus } from '../models/order.model';
import OrderDetailModel from '../models/order_detail.model';
import ProductModel from '../models/product_services.model';

class OrderController {

    //1.- CREATE INITIAL ORDER (WITH BASE SERVICE)
    async createInitialOrder(req: Request, res: Response) {
        const conn = await connection.promise().getConnection();
        try {
            const { Client_ID, Brand_Model, Reported_Fault, Service_ID } = req.body;

            if (!Brand_Model || !Reported_Fault || !Client_ID || !Service_ID) {
                return res.status(400).json({ message: "Brand, Model, Description, and Service are required." });
            }

            await conn.beginTransaction();

            const orderNumber = `ORD-${Date.now()}`;

            const service = await ProductModel.getById(Service_ID);
            if (!service) throw new Error("The selected service does not exist.");

            const orderId = await OrderModel.create({
                Order_Number: orderNumber,
                Client_ID,
                Brand_Model,
                Reported_Fault,
                Logistics_Status: LogisticsStatus.PENDING,
                Order_Total: service.Final_Price,
                Pending_Balance: service.Final_Price
            }, conn as any);

            await OrderDetailModel.create({
                Order_ID: orderId,
                Product_ID: Service_ID,
                Quantity: 1,
                Unit_Price: service.Final_Price,
                Line_Subtotal: service.Final_Price
            }, conn as any);

            await conn.commit();

            return res.status(201).json({
                message: "Order initiated successfully",
                summary: {
                    orderId,
                    orderNumber,
                    brandModel: Brand_Model,
                    baseCost: service.Final_Price
                }
            });

        } catch (error: any) {
            await conn.rollback();
            return res.status(500).json({ error: error.message });
        } finally {
            conn.release();
        }
    }

    // 2. ADD ITEMS/PARTS AND UPDATE TOTAL
    async addItemsToOrder(req: Request, res: Response) {
        const conn = await connection.promise().getConnection();
        try {
            const { Order_ID, items } = req.body; 
            
            await conn.beginTransaction();

            const currentOrder = await OrderModel.getById(Order_ID);
            if (!currentOrder) throw new Error("Order not found");
            
            if (currentOrder.Logistics_Status === LogisticsStatus.PAID) {
                throw new Error("Cannot add products to an already paid order.");
            }

            let extraTotal = 0;

            for (const item of items) {
                const product = await ProductModel.getById(item.Product_ID);
                if (!product) throw new Error(`Product ${item.Product_ID} does not exist`);

                const subtotal = product.Final_Price * item.Quantity;
                extraTotal += subtotal;

                await OrderDetailModel.create({
                    Order_ID,
                    Product_ID: item.Product_ID,
                    Quantity: item.Quantity,
                    Unit_Price: product.Final_Price,
                    Line_Subtotal: subtotal
                }, conn as any);

                if (product.Item_Type === 'PRODUCT') {
                    const success = await ProductModel.deductStock(item.Product_ID, item.Quantity, conn as any);
                    if (!success) throw new Error(`Insufficient stock for: ${product.Name}`);
                }
            }

            const newTotal = Number(currentOrder.Order_Total) + extraTotal;
            const newBalance = Number(currentOrder.Pending_Balance) + extraTotal;
            
            await OrderModel.updateTotals(Order_ID, newTotal, newBalance, conn as any);

            await conn.commit();
            return res.status(200).json({ message: "Items added and total updated", newTotal });

        } catch (error: any) {
            await conn.rollback();
            return res.status(400).json({ error: error.message });
        } finally {
            conn.release();
        }
    }

    // 3. UPDATE LOGISTICS STATUS
    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!Object.values(LogisticsStatus).includes(status)) {
                return res.status(400).json({ message: "Invalid logistics status" });
            }

            const success = await OrderModel.updateStatus(Number(id), status);
            return success 
                ? res.json({ message: `Status updated to ${status}` })
                : res.status(404).json({ message: "Order not found" });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 4. FINISH DIAGNOSIS (TECHNICAL REPORT)
    async finishDiagnosis(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { Final_Diagnosis, Applied_Solution, Technician_ID } = req.body;

            if (!Final_Diagnosis || !Applied_Solution) {
                return res.status(400).json({ message: "Diagnosis and solution are required." });
            }

            const success = await OrderModel.updateTechnicalInfo(Number(id), {
                Final_Diagnosis,
                Applied_Solution,
                Technician_ID
            });

            if (success) {
                await OrderModel.updateStatus(Number(id), LogisticsStatus.COMPLETED);
                return res.json({ message: "Technical information updated and order marked as completed." });
            }

            return res.status(404).json({ message: "Order not found." });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getOrderById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const order = await OrderModel.getAll();
        
        if (!order) return res.status(404).json({ message: "No Orders found" });
        
        return res.json(order);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
        }
    }

    async getAllOrders(req: Request, res: Response) {
        try {
            const order = await OrderModel.getAll();
            if (!order) return res.status(404).json({ message: "No order found" });
            return res.json(order);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getFullOrderDetails(req: Request, res: Response) {
        try {
            const { id } = req.params;
        
            // Obtenemos la cabecera
            const order = await OrderModel.getById(Number(id));
            if (!order) return res.status(404).json({ message: "Orden no encontrada" });

            // Obtenemos los productos/servicios asociados desde OrderDetailModel
            const details = await OrderDetailModel.getByOrderId(Number(id));

            return res.json({
                ...order,
                Items: details
            });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new OrderController();