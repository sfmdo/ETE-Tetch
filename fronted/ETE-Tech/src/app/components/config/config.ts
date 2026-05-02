import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService, UserConfig } from '../../services/config.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.html',
  styleUrl: './config.css',
})
export class Config implements OnInit {
  private configService = inject(ConfigService);
  
  configuracion: UserConfig = {
    Full_Name: '',
    Phone: '',
    Email: '',
    Role: '',
  };

  userId: number = 0;
  mensaje: string = '';
  error: boolean = false;

  ngOnInit(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.userId = user.User_ID || user.id;
        this.loadUserConfig();
      } catch (e) {
        console.error('Error al parsear usuario de localStorage', e);
      }
    }
  }

  loadUserConfig(): void {
    if (this.userId) {
      this.configService.getUserConfig(this.userId).subscribe({
        next: (user) => {
          this.configuracion = user;
        },
        error: (err) => console.error('Error al cargar configuración:', err)
      });
    }
  }

  guardarCambios(): void {
    if (this.userId) {
      const updateData = {
        Full_Name: this.configuracion.Full_Name,
        Phone: this.configuracion.Phone
      };

      this.configService.updateConfiguracion(this.userId, updateData).subscribe({
        next: (updatedUser) => {
          this.configuracion = updatedUser;
          // Actualizar localStorage para que el Dashboard/Navbar se sincronicen
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            user.Full_Name = updatedUser.Full_Name;
            user.Phone = updatedUser.Phone;
            localStorage.setItem('user', JSON.stringify(user));
          }
          this.showStatus('Configuración actualizada correctamente', false);
        },
        error: (err) => this.showStatus('Error al actualizar la configuración', true)
      });
    }
  }

  cambiarPassword(): void {
    const currentPass = prompt('Ingresa tu contraseña actual:');
    const newPass = prompt('Ingresa tu nueva contraseña:');
    
    if (currentPass && newPass) {
      this.configService.updatePassword(this.userId, { 
        currentPassword: currentPass, 
        newPassword: newPass 
      }).subscribe({
        next: () => this.showStatus('Contraseña actualizada correctamente', false),
        error: (err) => this.showStatus('Error al actualizar la contraseña', true)
      });
    }
  }

  private showStatus(msg: string, isError: boolean): void {
    this.mensaje = msg;
    this.error = isError;
    setTimeout(() => this.mensaje = '', 3000);
  }
}
