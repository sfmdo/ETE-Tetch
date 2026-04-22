import { Routes } from '@angular/router';
import { InicioDeSesion } from './components/inicio-de-sesion/inicio-de-sesion';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: InicioDeSesion }
];
