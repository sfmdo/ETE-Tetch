import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ManageInventoryComponent } from './components/manage_inventory/manage_inventory';
import { CatalogComponent } from './components/catalog/catalog';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register';
import { InventoryComponent } from './components/inventory/inventory';
import { OrdersComponent } from './components/orders/orders';
import { OrderLogisticComponent } from './components/order-logistic/order-logistic';

// Componentes Locales
import { Dashbord } from './components/dashbord/dashbord';
import { Carrito } from './components/carrito/carrito';
import { Config } from './components/config/config';

export const routes: Routes = [
  // 1. Ruta inicial → catalog (el guard redirige a login si no hay sesión)
  { 
    path: '', 
    redirectTo: 'catalog', 
    pathMatch: 'full' 
  },

  // 2. Rutas públicas: Login y Registro
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 3. Rutas protegidas (requieren token)
  { 
    path: 'catalog', 
    component: CatalogComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'dashboard', 
    component: Dashbord,
    canActivate: [authGuard]
  },
  { 
    path: 'carrito', 
    component: Carrito,
    canActivate: [authGuard]
  },
  { 
    path: 'settings', 
    component: Config,
    canActivate: [authGuard]
  },

  // 4. Rutas protegidas sólo para Admin
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

  // 5. Ruta comodín → login si no coincide nada
  { path: '**', redirectTo: 'login' }
];
