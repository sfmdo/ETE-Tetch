import { Request, Response } from 'express';
import { createPaypalOrder as createServiceOrder, capturePaypalOrder as captureServiceOrder } from "../service/paypal.service";

export async function createPaypalOrder(req: Request, res: Response): Promise<any> {
    try {
        const { items, total } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'El carrito esta vacio'
            });
        }
        if (!total || Number(total) <= 0) {
            return res.status(400).json({
                error: 'El total es invalido'
            });
        }
        const order = await createServiceOrder({ items, total });

        return res.status(200).json({
            id: order.id,
            status: order.status
        });
    } catch (error: any) {
        console.error('Error en createPaypalOrder.', error.message);

        return res.status(500).json({
            error: 'No se pudo crear la orden',
            detalle: error.message
        });
    }
}

export async function capturePaypalOrder(req: Request, res: Response): Promise<any> {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                error: 'orderId es obligatorio'
            });
        }
        const captureData = await captureServiceOrder(orderId);

        return res.status(200).json(captureData);
    } catch (error: any) {
        console.error('Error en capturePaypalOrder.', error.message);

        return res.status(500).json({
            error: 'No se pudo capturar la orden.',
            detalle: error.message
        });
    }
}
