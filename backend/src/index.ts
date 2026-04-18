import express, { Application } from 'express';
import cors from 'cors';
import productRoutes from "./routers/product_services.router";
import authRoutes from "./routers/auth.router"

const app: Application = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true }));

const baseApi = "/api/"

app.use( baseApi + 'products', productRoutes);
app.use( baseApi + 'auth', authRoutes);
app.use( baseApi + 'users')

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});