import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-de-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Left Panel: Brand & Imagery -->
    <div class="flex h-screen w-screen overflow-hidden bg-[#f8fafb] text-[#191c1d]">
      <div class="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-[#f2f4f5]">
        <div class="absolute inset-0 z-0">
          <img alt="Abstract tech background"
            class="w-full h-full object-cover opacity-90"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbddToqdsvVPQNYFxm_TdUM-E6HGsS-HBcgBWTJJkcrvqcC1dSNwaTsa21WStVy_Logwx16AbvfELWUDyzLwb3WScE7_zwuiu0Y0j4XDE2QmgDs0iqsXIdoQH9tyGmzDzUbB1Bfx9E3AwuIwMdGkkTffp0J6Xn8c0SIY3EFFT8BiTrSgQzUnWfHX7gf4R5-Pk-ncAv3xIfcsd1x5dMtrfYBFz2Eh4SZVvPnd4PMd3nBSAmi3GXSQW1RYV1A58ro70PBIfc0yldtfAe"/>
          <div class="absolute inset-0 bg-gradient-to-br from-[#002542]/90 to-[#1b3b5a]/80 backdrop-blur-[2px]"></div>
        </div>
        <div class="relative z-10 p-16 max-w-xl text-white">
          <div class="flex items-center gap-3 mb-12">
            <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;"></span>
            <span class="font-bold text-3xl tracking-tighter" style="font-family: Manrope, sans-serif;">ETE-Tech</span>
          </div>
          <h1 class="text-5xl font-bold leading-tight mb-6 tracking-tight" style="font-family: Manrope, sans-serif;">Servicios de software confiable y accesible.</h1>
          <p class="text-[#abc9ef] text-lg leading-relaxed mb-12">Reparacion, mantenimiento e instalacion de software para diferentes dispositivos electronicos como: consolas, telefonos y computadoras.</p>
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
              <span class="material-symbols-outlined text-[#ffba38] block mb-3">Tiempo</span>
              <div class="text-2xl font-bold mb-1">5-10</div>
              <div class="text-sm uppercase tracking-wider text-[#abc9ef]">Dias para entregar el servicio.</div>
            </div>
            <div class="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
              <span class="material-symbols-outlined text-[#ffba38] block mb-3">Clientes Satisfechos</span>
              <div class="text-2xl font-bold mb-1">10k+</div>
              <div class="text-sm uppercase tracking-wider text-[#abc9ef]">En toda la republica.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Authentication Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#f8fafb] relative overflow-y-auto">
        <div class="w-full max-w-md">
          <div class="mb-10">
            <h2 class="text-3xl font-bold tracking-tight text-[#191c1d] mb-2" style="font-family: Manrope, sans-serif;">Bienvenido</h2>
            <p class="text-[#43474d]">Inicia sesion para ingresar a tu cuenta.</p>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage"
            class="p-4 mb-4 text-sm text-white bg-[#ba1a1a] rounded-lg"
            role="alert">
            {{ errorMessage }}
          </div>

          <!-- Form -->
          <form class="space-y-6" (ngSubmit)="login()" #loginForm="ngForm">
            <!-- Email Input -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#191c1d]" for="email">Correo Electrónico</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#73777e]">mail</span>
                <input
                  class="w-full pl-11 pr-4 py-3 bg-[#f2f4f5] text-[#191c1d] border-0 border-b-2 border-transparent focus:bg-white focus:border-[#002542] focus:ring-0 transition-all outline-none rounded-t"
                  id="email" name="email" [(ngModel)]="email"
                  placeholder="admin@ete-tech.com" required type="email"/>
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#191c1d]" for="password">Contraseña</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#73777e]">lock</span>
                <input
                  class="w-full pl-11 pr-11 py-3 bg-[#f2f4f5] text-[#191c1d] border-0 border-b-2 border-transparent focus:bg-white focus:border-[#002542] focus:ring-0 transition-all outline-none rounded-t"
                  id="password" name="password" [(ngModel)]="password"
                  placeholder="••••••••" required type="password"/>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              class="w-full py-3 px-4 bg-gradient-to-br from-[#002542] to-[#1b3b5a] text-white font-medium rounded shadow-md hover:shadow-lg hover:-translate-y-px transition-all active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#002542] focus:ring-offset-2"
              type="submit">
              Iniciar Sesión
            </button>
          </form>

          <!-- Registration Link -->
          <p class="mt-10 text-center text-sm text-[#43474d]">
            ¿Quieres comenzar?
            <a class="font-medium text-[#002542] hover:text-[#1b3b5a] transition-colors ml-1" href="#">Registrarse</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class InicioDeSesion {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Login exitoso', response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Por favor intenta de nuevo.';
        } else {
          this.errorMessage = 'Ocurrió un error al iniciar sesión. Intenta más tarde.';
        }
        console.error('Login error', err);
      }
    });
  }
}
