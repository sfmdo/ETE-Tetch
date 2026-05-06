import { ChangeDetectorRef, Component, OnInit, NgZone  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserConfigService } from '../../services/user-config.service';
import { UserProfile, UpdateProfilePayload, ChangePasswordPayload } from '../../models/user-config.model';


@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-config.html',
  styleUrl: './user-config.css',
})
export class UserConfigComponent implements OnInit {
  constructor(
    private configService: UserConfigService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  configuracion: UserProfile = {
    User_ID: 0,
    Full_Name: '',
    Email: '',
    Phone: '',
    Role: '',
    Status: 0
  };

  originalConfiguracion: UserProfile = { ...this.configuracion };

  contrasenaData: ChangePasswordPayload = {
    currentPassword: '',
    newPassword: ''
  };

  confirmarPassword: string = '';

  mensaje: string = '';
  error: boolean = false;
  isLoading: boolean = true;
  isSavingPassword: boolean = false;

  ngOnInit(): void {
    this.loadUserConfig();
  }

  loadUserConfig(): void {
    this.isLoading = true;
    this.configService.getProfile().subscribe({
      next: (user) => {
        this.configuracion = user;
        this.originalConfiguracion = { ...user }; 
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar configuración:', err);
        this.showStatus('Error al cargar los datos del perfil.', true);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelar(): void {
    this.configuracion = { ...this.originalConfiguracion };
    this.mensaje = '';
    this.cdr.detectChanges();
  }

  guardarCambios(): void {
    const updateData: UpdateProfilePayload = {
      Full_Name: this.configuracion.Full_Name,
      Phone: this.configuracion.Phone
    };

    this.configService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.configuracion = response.user;
        this.originalConfiguracion = { ...response.user };
        
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          user.Full_Name = response.user.Full_Name;
          user.Phone = response.user.Phone;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        this.showStatus('Configuración actualizada correctamente', false);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.showStatus('Error al actualizar la configuración', true);
      }
    });
  }

  actualizarContrasena(passwordForm: any): void {
  if (this.contrasenaData.newPassword !== this.confirmarPassword) {
    this.showStatus('La nueva contraseña y su confirmación no coinciden.', true);
    return;
  }

  this.isSavingPassword = true;
  this.cdr.detectChanges();

  this.configService.changePassword(this.contrasenaData).subscribe({
    next: (res) => {
      // Éxito: Envolvemos en la zona activa de Angular
      this.zone.run(() => {
        this.isSavingPassword = false;
        this.showStatus(res.message || 'Contraseña actualizada con éxito.', false);
        
        this.contrasenaData = { currentPassword: '', newPassword: '' };
        this.confirmarPassword = '';
        passwordForm.resetForm();
        this.cdr.detectChanges();
      });
    },
    error: (err) => {
      console.error('Error capturado en Angular:', err);
      this.zone.run(() => {
        this.isSavingPassword = false;

        let errMsg = 'Error al intentar actualizar la contraseña.';
        if (err && err.error) {
          if (typeof err.error === 'object' && err.error.message) {
            errMsg = err.error.message;
          } else if (typeof err.error === 'string') {
            errMsg = err.error;
          }
        } else if (err && err.message) {
          errMsg = err.message;
        }

        // Ejecutamos la alerta roja
        this.showStatus(errMsg, true);
        this.cdr.detectChanges();
      });
    }
  });
}

  private showStatus(msg: string, isError: boolean): void {
    this.mensaje = msg;
    this.error = isError;
    this.cdr.detectChanges(); 

    setTimeout(() => {
      this.mensaje = '';
      this.cdr.detectChanges(); 
    }, 4000); 
  }
}