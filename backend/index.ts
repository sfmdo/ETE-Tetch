import express, { Application } from 'express';
import cors from 'cors';
import productRoutes from "./routers/products_services.router";

const app: Application = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true }));

// Conexión de Rutas
app.use('/api/products', productRoutes);

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✅ Rutas de productos listas en /api/products`);
});