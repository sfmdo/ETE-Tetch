import { Request, Response } from 'express';
import { ItemType, } from '../../src/models/product_services.model';
import { IProductServices } from '../../src/models/product_services.model';
import  ProductServicesService from '../service/product_services.service';

class ProductController {

    // GET: /api/products/all
    async getAll(_req: Request, res: Response) {
        try {
            const results = await ProductServicesService.get();
            res.json(results);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET: /api/products/only-products
    async getProducts(_req: Request, res: Response) {
        try {
            const results = await ProductServicesService.get({ Item_Type: ItemType.PRODUCT } as Partial<IProductServices>);
            res.json(results);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET: /api/products/only-services
    async getServices(_req: Request, res: Response) {
        try {
            const results = await ProductServicesService.get({ Item_Type: ItemType.SERVICE } as Partial<IProductServices>);
            res.json(results);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // POST: /api/products/
    async create(req: Request, res: Response) {
        try {
            const id = await ProductServicesService.create(req.body);
            res.status(201).json({ 
                message: 'Record created', 
                id 
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // PUT: /api/products/:id
    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const success = await ProductServicesService.update(id, req.body);
            
            if (!success) {
                return res.status(404).json({ message: 'Product not found for update' });
            }
            
            res.json({ message: 'Product updated and prices recalculated' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // DELETE: /api/products/:id
    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const success = await ProductServicesService.delete(id);
            
            if (!success) {
                return res.status(404).json({ message: 'Record does not exist' });
            }
            
            res.json({ message: 'Record deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ProductController();