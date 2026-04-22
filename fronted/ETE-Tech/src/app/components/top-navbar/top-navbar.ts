import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf, *ngFor, etc.
import { RouterModule } from '@angular/router'; // Necesario para routerLink y routerLinkActive

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  // ¡Aquí ocurre la magia! Importamos los módulos que este componente necesita para funcionar
  imports: [
    CommonModule, 
    RouterModule
  ],
  templateUrl: './top-navbar.html',
})
export class TopNavbar {
  // Variable para controlar qué botones se muestran en el HTML
  isAdmin: boolean = true; 

  // Si tuvieras un servicio de autenticación, lo inyectarías en el constructor así:
  // constructor(private authService: AuthService) {
  //   this.isAdmin = this.authService.getUserRole() === 'ADMIN';
  // }
}