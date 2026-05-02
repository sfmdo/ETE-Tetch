import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ManageInventoryComponent } from './components/manage_inventory/manage_inventory';
import { CatalogComponent } from './components/catalog/catalog';
import { authGuard } from './guards/auth.guard'; // Importa el middleware que creamos
import { RegisterComponent } from './components/register/register';
import { InventoryComponent } from './components/inventory/inventory';
import { OrdersComponent } from './components/orders/orders';
import { OrderLogisticComponent } from './components/order-logistic/order-logistic';

// Componentes Locales
import { Dashbord } from './components/dashbord/dashbord';
import { Carrito } from './components/carrito/carrito';

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
  
  // Rutas Locales
  { path: 'dashboard', component: Dashbord },
  { path: 'carrito', component: Carrito },

  // 4. Ruta comodín: Cualquier otra cosa redirige a catalogo
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];
