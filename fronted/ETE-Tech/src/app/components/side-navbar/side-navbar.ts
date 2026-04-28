<<<<<<< HEAD
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

=======
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-navbar.html',
})
export class SideNavbar implements OnInit {
  userData: any = null;
  hasNotifications = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar datos desde localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userData = JSON.parse(savedUser);
    }
  }

  // --- VALIDACIONES DE ROL ---

  isAdmin(): boolean {
    return this.userData?.Role === 'Admin';
  }

  isUser(): boolean {
    return this.userData?.Role === 'User';
  }

  // --- ACCIONES ---

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('user'); // Limpieza extra
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
>>>>>>> 8d6aa06e1cdc20e20fe04c2e5f7543ae73fa11d9
}