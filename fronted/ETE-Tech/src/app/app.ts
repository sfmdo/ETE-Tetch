import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { Carrito } from './components/carrito/carrito';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductList, Carrito],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {

  protected readonly title = signal('ETE-Tech');

}