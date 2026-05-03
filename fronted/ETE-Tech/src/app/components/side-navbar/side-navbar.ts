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
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userData = JSON.parse(savedUser);
    }
  }

  isAdmin() { return this.authService.isAdmin(); }
  isUser() { return this.authService.isUser(); }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}