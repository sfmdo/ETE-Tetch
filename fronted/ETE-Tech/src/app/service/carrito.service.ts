import { Injectable, signal, computed } from "@angular/core";
import { Product } from "../models/product.model";

@Injectable({providedIn: 'root'})
export class CarritoService {
    //Lista del carrito usando signals para reactividad
    private _listaCarrito = signal<Product[]>([]);

    // Exponer la lista como un signal de solo lectura
    Lista = this._listaCarrito.asReadonly();

    // Signal computado para el total
    total = computed(() => {
        return this._listaCarrito().reduce((acc, producto) => acc + producto.precio_venta, 0);
    });

    //Agregar producto al carrito
    agregarProducto(producto: Product) {
        this._listaCarrito.update(lista => [...lista, producto]);
    }

    //Eliminar producto del carrito
    eliminarProducto(producto: Product) {
        this._listaCarrito.update(lista => lista.filter(p => p.id_producto !== producto.id_producto));
    }

    //Vaciar carrito
    vaciarCarrito() {
        this._listaCarrito.set([]);
    }

    //Obtener lista del carrito (para compatibilidad si es necesario)
    getListaCarrito(): Product[] {
        return this._listaCarrito();
    }

    //Obtener total del carrito (para compatibilidad si es necesario)
    getTotal(): number {
        return this.total();
    }

    exportarXML() {
        //Estructura XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<tiquet>\n`;

        for (const producto of this._listaCarrito()) {
            xml += `  <producto>\n`;
            xml += `    <id>${producto.id_producto}</id>\n`;
            xml += `    <nombre>${this.escapeXML(producto.nombre)}</nombre>\n`;
            xml += `    <categoria>${this.escapeXML(producto.categoria)}</categoria>\n`;
            if (producto.descripcion) {
                xml += `    <descripcion>${this.escapeXML(producto.descripcion)}</descripcion>\n`;
            }
            xml += `    <precio>${producto.precio_venta}</precio>\n`;
            xml += `  </producto>\n`;
        }
        xml += `  <total>${this.getTotal()}</total>\n`;
        xml += `</tiquet>`;

        const blob = new Blob([xml], {type: 'text/xml'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tiquet.xml';
        a.click();
        URL.revokeObjectURL(url);
    }

    private escapeXML(value: string): string {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}