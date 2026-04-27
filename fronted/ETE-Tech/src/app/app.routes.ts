import { Routes } from '@angular/router';
import { InicioDeSesion } from './components/inicio-de-sesion/inicio-de-sesion';
import { Registro } from './components/registro/registro';
import { Checkout } from './components/checkout/checkout';
import { ProductList } from './components/product-list/product-list';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'login', component: InicioDeSesion },
  { path: 'registro', component: Registro },
  { path: 'checkout', component: Checkout },
  { path: 'productos', component: ProductList }
];
