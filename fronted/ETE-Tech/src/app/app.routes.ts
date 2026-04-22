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
  }
];
=======
import { InicioDeSesion } from './components/inicio-de-sesion/inicio-de-sesion';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: InicioDeSesion }
];
>>>>>>> 53454ce82c38d267377e713a77edd7535db14d08
