import { Routes } from '@angular/router';
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