import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRegisterPayload } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  // Datos del formulario
  formData = {
    Full_Name: '',
    Email: '',
    Phone: '',
    Password: ''
  };

  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.loading = true;

    // Construimos el payload final según tu API
    const payload: UserRegisterPayload = {
      ...this.formData,
      Role: 'User', // Hardcoded por seguridad
      Status: 1     // Usuario activo por defecto
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res.message);
        // Redirigir al login después de registrarse
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.errorMessage = 'El correo ya está registrado en el sistema.';
        } else {
          this.errorMessage = 'Error al conectar con el servidor. Intenta más tarde.';
        }
      }
    });
  }
}