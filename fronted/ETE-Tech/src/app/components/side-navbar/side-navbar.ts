import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  // Aquí importamos los módulos necesarios para que el HTML funcione
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './side-navbar.html',
})
export class SideNavbar {

  logout() {
    console.log('Cerrando sesión...');
    // Aquí irá tu lógica de AuthService para desloguear y redirigir al login
  }

}