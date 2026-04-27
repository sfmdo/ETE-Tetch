import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importamos RouterModule para el routerLink
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] // Opcional, si tienes estilos específicos
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Guardamos los datos de sesión de forma segura
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Login exitoso');
        this.router.navigate(['/dashboard']); // Ajusta la ruta a donde quieras redirigir
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Por favor intenta de nuevo.';
        } else {
          this.errorMessage = 'Ocurrió un error en el servidor. Intenta más tarde.';
        }
        console.error('Login error', err);
      }
    });
  }
}