import {Component,computed} from '@angular/core';
import {CurrencyPipe}from '@angular/common'
import { CarritoService } from '../../service/carrito.service';
import { Producto } from '../../models/producto.model';
import { Signal } from '@angular/core';

@Component({
    selector: 'app-carrito',
    standalone: true,
    imports: [CurrencyPipe], // No es CommonModule
    templateUrl: './carrito.html',
    styleUrl: './carrito.css'
})

export class Carrito {
    carrito: Signal<Producto[]> = signal<Producto[]>([]);
    total: Signal<number> = computed(() => this.carrito().reduce((total, producto) => total + producto.precio, 0));

    constructor(){
        this.carrito = this.carritoService.Lista;
    }

    eliminar(producto: Producto) {
        this.carritoService.eliminarProducto(producto);
    }

    vaciar() {
        this.carritoService.vaciarCarrito();
    }

    exportarXML() {
        this.carritoService.exportarXML();
    }
}
