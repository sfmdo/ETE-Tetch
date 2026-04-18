import { Response } from 'express';
import UserModel from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware'; 

class UserController {
    
    async getProfile(req: AuthRequest, res: Response): Promise<Response | void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in token' });
            }

            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);

        } catch (error) {
            console.error('Error in getProfile:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateProfile(req: AuthRequest, res: Response): Promise<Response | void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in token' });
            }

            //Se extrae solo la informacion de contacto
            const { Full_Name, Phone } = req.body;

            const updateData: any = {};
            if (Full_Name) updateData.Full_Name = Full_Name;
            if (Phone !== undefined) updateData.Phone = Phone;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: 'No valid fields provided for update' });
            }

            const isUpdated = await UserModel.update(userId, updateData);

            if (!isUpdated) {
                return res.status(404).json({ message: 'User not found or no changes made' });
            }

            // Opcional: Traer los datos frescos para devolverlos al frontend
            const updatedUser = await UserModel.findById(userId);

            return res.status(200).json({
                message: 'Profile updated successfully',
                user: updatedUser
            });

        } catch (error) {
            console.error('Error in updateProfile:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new UserController();