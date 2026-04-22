import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbar } from './components/top-navbar/top-navbar';
import { SideNavbar } from './components/side-navbar/side-navbar';
import { CatalogComponent } from './components/catalog/catalog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TopNavbar,
    SideNavbar,
    CatalogComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}