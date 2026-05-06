import { ChangeDetectorRef, Component, NgZone } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions';
import { PrivacyNoticeComponent } from '../privacy-notice/privacy-notice';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TermsAndConditionsComponent, PrivacyNoticeComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  showResetModal = false;
  resetEmail = '';
  modalErrorMessage = '';
  isLoadingReset = false;

  acceptedTerms = false;
  acceptedPrivacy = false;

  showTerms = false;
  showPrivacy = false;

  constructor(
    private authService: AuthService, 
    private emailService: EmailService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  login() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      this.cdr.detectChanges()
      return;
    }

    if (!this.acceptedTerms || !this.acceptedPrivacy) {
      this.errorMessage = 'Debes aceptar los términos y el aviso de privacidad para continuar.';
      this.cdr.detectChanges();
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.zone.run(() => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('Login exitoso');
          this.router.navigate(['/dashboard']); 
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.error('Login error capturado:', err);

          const backendMessage = err.error?.message || err.error?.msg;

          if (err.status === 401 || err.status === 400) {
            this.errorMessage = backendMessage || 'Credenciales inválidas. Por favor intenta de nuevo.';
          } else {
            this.errorMessage = 'Ocurrió un error en el servidor. Intenta más tarde.';
          }
          this.cdr.detectChanges();
        });
      }
    });
    
  }

  openResetModal() {
    this.showResetModal = true;
    this.resetEmail = '';
    this.modalErrorMessage = '';
  }

  closeResetModal() {
    this.showResetModal = false;
    this.resetEmail = '';
    this.modalErrorMessage = '';
  }

  enviarPasswordTemporal() {
    this.modalErrorMessage = '';
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.resetEmail) {
      this.modalErrorMessage = 'Por favor, introduce una dirección de correo válida.';
      return;
    }

    this.isLoadingReset = true;

    this.emailService.enviarClaveTemporal(this.resetEmail).subscribe({
      next: (response) => {
        this.zone.run(() => {
          this.isLoadingReset = false;
          this.closeResetModal();
          this.successMessage = '¡Clave generada! Revisa tu bandeja de entrada para obtener tus nuevas credenciales.';
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.isLoadingReset = false;
          console.error('Reset password error capturado:', err);
          const backendMessage = err.error?.message || err.error?.msg;

          if (err.status === 404) {
            this.modalErrorMessage = backendMessage || 'Este correo electrónico no está registrado en el sistema.';
          } else {
            this.modalErrorMessage = backendMessage || 'Error al enviar el correo. Inténtalo más tarde.';
          }
        });
      }
    });
    this.cdr.detectChanges();
  }
}