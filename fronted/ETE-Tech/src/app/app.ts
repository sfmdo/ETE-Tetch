import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import { TopNavbar } from './components/top-navbar/top-navbar';
import { SideNavbar } from './components/side-navbar/side-navbar';
import { CatalogComponent } from './components/catalog/catalog';
=======
>>>>>>> 53454ce82c38d267377e713a77edd7535db14d08

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [
    RouterOutlet,
    TopNavbar,
    SideNavbar,
    CatalogComponent,
  ],
=======
  imports: [RouterOutlet],
>>>>>>> 53454ce82c38d267377e713a77edd7535db14d08
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}