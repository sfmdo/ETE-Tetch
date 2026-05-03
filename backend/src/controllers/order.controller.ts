import { Request, Response } from 'express';
import connection from '../config/database';
import { LogisticsStatus } from '../models/order.model'
import OrderService from '../service/order.service';
import OrderDetailService from '../service/order_detail.service';
import ProductServicesService from '../service/product_services.service';

class OrderController {

    async createInitialOrder(req: Request, res: Response) {
        const conn = await connection.promise().getConnection();
        try {
            const { Client_ID, Brand_Model, Reported_Fault, Service_ID } = req.body;

            if (!Brand_Model || !Reported_Fault || !Client_ID || !Service_ID) {
                return res.status(400).json({ message: "Brand, Model, Description, and Service are required." });
            }

            await conn.beginTransaction();

            const orderNumber = `ORD-${Date.now()}`;

            const service = await ProductServicesService.getById(Service_ID);
            if (!service) throw new Error("The selected service does not exist.");

            const orderId = await OrderService.create({
                Order_Number: orderNumber,
                Client_ID,
                Brand_Model,
                Reported_Fault,
                Logistics_Status: LogisticsStatus.PENDING,
                Order_Total: service.Final_Price,
                Pending_Balance: service.Final_Price
            }, conn as any);

            await OrderDetailService.create({
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

    async addItemsToOrder(req: Request, res: Response) {
        const conn = await connection.promise().getConnection();
        try {
            const { Order_ID, items } = req.body; 
            
            await conn.beginTransaction();

            const currentOrder = await OrderService.getById(Order_ID);
            if (!currentOrder) throw new Error("Order not found");
            
            if (currentOrder.Logistics_Status === LogisticsStatus.PAID) {
                throw new Error("Cannot add products to an already paid order.");
            }

            let extraTotal = 0;

            for (const item of items) {
                const product = await ProductServicesService.getById(item.Product_ID);
                if (!product) throw new Error(`Product ${item.Product_ID} does not exist`);

                const subtotal = product.Final_Price * item.Quantity;
                extraTotal += subtotal;

                await OrderDetailService.create({
                    Order_ID,
                    Product_ID: item.Product_ID,
                    Quantity: item.Quantity,
                    Unit_Price: product.Final_Price,
                    Line_Subtotal: subtotal
                }, conn as any);

                if (product.Item_Type === 'PRODUCT') {
                    const success = await ProductServicesService.deductStock(item.Product_ID, item.Quantity, conn as any);
                    if (!success) throw new Error(`Insufficient stock for: ${product.Name}`);
                }
            }

            const newTotal = Number(currentOrder.Order_Total) + extraTotal;
            const newBalance = Number(currentOrder.Pending_Balance) + extraTotal;
            
            await OrderService.updateTotals(Order_ID, newTotal, newBalance, conn as any);

            await conn.commit();
            return res.status(200).json({ message: "Items added and total updated", newTotal });

        } catch (error: any) {
            await conn.rollback();
            return res.status(400).json({ error: error.message });
        } finally {
            conn.release();
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!Object.values(LogisticsStatus).includes(status)) {
                return res.status(400).json({ message: "Invalid logistics status" });
            }

            const success = await OrderService.updateStatus(Number(id), status);
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

            const success = await OrderService.updateTechnicalInfo(Number(id), {
                Final_Diagnosis,
                Applied_Solution,
                Technician_ID
            });

            if (success) {
                await OrderService.updateStatus(Number(id), LogisticsStatus.COMPLETED);
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
        const order = await OrderService.getAll();
        
        if (!order) return res.status(404).json({ message: "No Orders found" });
        
        return res.json(order);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
        }
    }

    async getAllOrders(req: Request, res: Response) {
        try {
            const order = await OrderService.getAll();
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
            const order = await OrderService.getById(Number(id));
            if (!order) return res.status(404).json({ message: "Orden no encontrada" });

            // Obtenemos los productos/servicios asociados desde OrderDetailService
            const details = await OrderDetailService.getByOrderId(Number(id));

            return res.json({
                ...order,
                Items: details
            });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async payOrder(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { amount } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ message: "ID de orden inválido." });
            }

            if (!amount || typeof amount !== 'number' || amount <= 0) {
                return res.status(400).json({ message: "El monto del pago debe ser un número mayor a 0." });
            }

            const success = await OrderService.registerPayment(id, amount);

            if (success) {
                return res.json({ message: "Pago registrado correctamente. Balances y estatus actualizados." });
            } else {
                return res.status(404).json({ message: "Orden no encontrada." });
            }
        } catch (error: any) {
            console.error("Error al registrar el pago:", error);
            return res.status(500).json({ 
                message: "Error interno al procesar el pago.", 
                error: error.message || error 
            });
        }
    }

    // 1. Obtener TODAS las órdenes de un cliente (Historial)
    async getClientOrders(req: Request, res: Response) {
        try {
            const clientId = Number(req.params.clientId);
            
            if (isNaN(clientId)) {
                return res.status(400).json({ message: "ID de cliente inválido." });
            }

            const orders = await OrderService.getAllByClient(clientId);
            return res.json(orders);
        } catch (error: any) {
            console.error("Error al obtener órdenes del cliente:", error);
            return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
        }
    }


}

export default new OrderController();