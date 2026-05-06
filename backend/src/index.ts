import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

//Routers
import productRoutes from "./routers/product_services.router";
import authRoutes from "./routers/auth.router"
import usersRoutes from "./routers/user.router"
import ordersRoutes from "./routers/order.router"
import emailRouter from "./routers/email.router"

const app: Application = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true }));

const baseApi = "/api/"

app.use( baseApi + 'products', productRoutes);
app.use( baseApi + 'auth', authRoutes);
app.use( baseApi + 'users', usersRoutes);
app.use( baseApi + 'orders', ordersRoutes);
app.use( baseApi + 'email', emailRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});