import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ManageInventoryComponent } from './components/manage_inventory/manage_inventory';
import { CatalogComponent } from './components/catalog/catalog';
import { authGuard } from './guards/auth.guard'; // Importa el middleware que creamos
import { RegisterComponent } from './components/register/register';
import { InventoryComponent } from './components/inventory/inventory';
import { OrdersComponent } from './components/orders/orders';
import { OrderLogisticComponent } from './components/order-logistic/order-logistic';
import { UserConfigComponent } from './components/user-config/user-config';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';
import { ClientOrderComponent } from './components/client-order/client-order';
import { autoRedirectGuard } from './guards/redirect.guard';

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
    canActivate: [authGuard],
    data: { role: 'User' }
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
  { 
    path: 'user-settings', 
    component: UserConfigComponent,
    canActivate: [authGuard],
  },
  { 
    path: 'user-dashboard', 
    component: UserDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'User' }
  },
  { 
    path: 'user-order/:id', 
    component: ClientOrderComponent,
    canActivate: [authGuard],
    data: { role: 'User' }
  },

  { 
    path: 'redirect-handler', 
    component: LoginComponent, //Componente puente
    canActivate: [autoRedirectGuard] 
  },

  { 
    path: '**', 
    redirectTo: 'redirect-handler' 
  }
];