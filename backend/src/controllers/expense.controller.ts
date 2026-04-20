import { Request, Response } from 'express';
import ExpenseModel from '../../src/models/expense.model';

class ExpenseController {
    
    async create(req: Request, res: Response) {
        try {
            const { Description, Amount, Admin_Registry_ID } = req.body;

            if (!Description || !Amount) {
                return res.status(400).json({ message: "Description and Amount are required." });
            }

            const expenseId = await ExpenseModel.create({
                Description,
                Amount,
                Admin_Registry_ID: Admin_Registry_ID || null
            });

            return res.status(201).json({
                message: "Expense recorded successfully",
                expenseId
            });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async listAll(req: Request, res: Response) {
        try {
            const expenses = await ExpenseModel.getAll();
            return res.json(expenses);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getDetail(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const expense = await ExpenseModel.getById(Number(id));
            
            if (!expense) {
                return res.status(404).json({ message: "Expense not found." });
            }

            return res.json(expense);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const success = await ExpenseModel.delete(Number(id));

            return success 
                ? res.json({ message: "Expense record deleted." })
                : res.status(404).json({ message: "Expense not found." });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new ExpenseController();