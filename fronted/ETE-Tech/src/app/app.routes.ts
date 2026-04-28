import { Routes } from '@angular/router';
<<<<<<< HEAD
import { ProductList } from './components/product-list/product-list';
import { CatalogComponent } from './components/catalog/catalog';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    component: ProductList
  },
  { 
    path: 'catalog', 
    component: CatalogComponent 
  },
  // La ruta comodín (**) SIEMPRE debe ir hasta el final
  {
    path: '**',
    redirectTo: 'products'
=======
import { LoginComponent } from './components/login/login';
import { ManageInventoryComponent } from './components/manage_inventory/manage_inventory';
import { CatalogComponent } from './components/catalog/catalog';
import { authGuard } from './guards/auth.guard'; // Importa el middleware que creamos
import { RegisterComponent } from './components/register/register';
import { InventoryComponent } from './components/inventory/inventory';
import { OrdersComponent } from './components/orders/orders';
import { OrderLogisticComponent } from './components/order-logistic/order-logistic';

export const routes: Routes = [
  // 1. Ruta inicial: Si no hay nada, intentamos ir a productos (el guard decidirá si nos manda al login)
  { 
    path: '', 
    redirectTo: 'products', 
    pathMatch: 'full' 
  },

  // 2. Ruta pública: Inicio de sesión y Registro
  { 
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // 3. Rutas protegidas: Solo entran si tienen Token
  { 
    path: 'inventory', 
    component: InventoryComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  { 
    path: 'inventory/manage-inventory', 
    component: ManageInventoryComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  { 
    path: 'catalog', 
    component: CatalogComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'orders', 
    component: OrdersComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  { 
    path: 'orders/logistic/:id', 
    component: OrderLogisticComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },

  // 4. Ruta comodín: Cualquier otra cosa redirige a catalogo
  { 
    path: '**', 
    redirectTo: 'catalog' 
>>>>>>> 8d6aa06e1cdc20e20fe04c2e5f7543ae73fa11d9
  }
];