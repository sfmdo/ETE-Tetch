import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { SideNavbar } from './components/side-navbar/side-navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SideNavbar,
    ],
  templateUrl: './app.html'
})
export class App {
  showNavbar = true;

  constructor(private router: Router) {
    // Escuchamos los cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Verificamos si la ruta actual es login
      this.showNavbar = !event.urlAfterRedirects.includes('/login') && 
                  !event.urlAfterRedirects.includes('/register');
    });
  }
}