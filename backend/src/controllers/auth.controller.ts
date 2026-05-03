import { Request, Response } from 'express';
import UserService from '../service/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthController {

    async register(req: Request, res: Response): Promise<Response | void> {
        try {
            const { Full_Name, Email, Password, Phone, Role, Status } = req.body;

            if (!Full_Name || !Email || !Password || !Role) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const existingUser = await UserService.findByEmail(Email);
            if (existingUser) {
                return res.status(409).json({ message: 'Email is already registered' });
            }

            const newUserId = await UserService.create({
                Full_Name,
                Email,
                Password,
                Phone: Phone || null,
                Role,
                Status: Status !== undefined ? Status : 1 
            });

            return res.status(201).json({ 
                message: 'User registered successfully', 
                userId: newUserId 
            });

        } catch (error) {
            console.error('Error in register:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response): Promise<Response | void> {
        try {
            const { Email, Password } = req.body;

            if (!Email || !Password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const user = await UserService.findByEmail(Email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(Password, user.Password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const payload = {
                userId: user.User_ID,
                role: user.Role,
                email: user.Email
            };

            const secretKey = process.env.JWT_SECRET || 'fallback_development_secret_key';
            const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });

            const { Password: _, ...userWithoutPassword } = user;

            return res.status(200).json({
                message: 'Login successful',
                user: userWithoutPassword,
                token: token
            });

        } catch (error) {
            console.error('Error in login:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new AuthController();