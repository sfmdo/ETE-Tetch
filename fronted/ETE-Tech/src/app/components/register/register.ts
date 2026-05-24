import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRegisterPayload } from '../../models/user.model';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions';
import { PrivacyNoticeComponent } from '../privacy-notice/privacy-notice';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TermsAndConditionsComponent, PrivacyNoticeComponent],
  templateUrl: './register.html',
})
export class RegisterComponent {
  formData = {
    Full_Name: '',
    Email: '',
    Phone: '',
    Password: ''
  };

  acceptedTerms = false;
  acceptedPrivacy = false;

  showTerms = false;
  showPrivacy = false;

  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router,  private cdr: ChangeDetectorRef) {}

  isPasswordSecure(password: string): boolean {
    const securePasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/;
    return securePasswordRegex.test(password);
  }

  

  onRegister() {
    this.errorMessage = '';


    if (!this.isPasswordSecure(this.formData.Password)) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
      this.cdr.detectChanges()
      return; 
    }

    if (!this.acceptedTerms || !this.acceptedPrivacy) {
      this.errorMessage = 'Debes aceptar los términos y el aviso de privacidad para continuar.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;

    const payload: UserRegisterPayload = {
      ...this.formData,
      Role: 'User',
      Status: 1     
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res.message);
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