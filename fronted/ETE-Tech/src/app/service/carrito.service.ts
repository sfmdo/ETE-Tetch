import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class CarritoService {
    //Lista del carrito

    private listaCarrito: Producto[] = [];

    Lista = this.listaCarrito.asReadonly();

    //Agregar producto al carrito
    agregarProducto(producto: Producto) {
        this.listaCarrito.push(producto);
    }

    //Eliminar producto del carrito
    eliminarProducto(producto: Producto) {
        this.listaCarrito = this.listaCarrito.filter(p => p.id !== producto.id);
    }

    //Vaciar carrito
    vaciarCarrito() {
        this.listaCarrito = [];
    }


    //Obtener lista del carrito
    getListaCarrito(): Producto[] {
        return this.listaCarrito;
    }

    //Obtener total del carrito
    getTotal(): number {
        return this.listaCarrito.reduce((total, producto) => total + producto.precio, 0);
    }


    exportarXML() {
    //Estructura XML
    let xml = `<xml version="1.0" encoding="UTF-8"?> <tiquet> /n `;

    for (const producto of Lista) {
        xml += `<producto>/n`;
        xml += `<id>${producto.id}</id>/n`;
        xml += `<nombre>${producto.nombrep}</nombre>/n`;
        xml += `<servicio>${producto.servicio}</servicio>/n`;
        xml += `<equipo>${producto.equipo}</equipo>/n`;
        if(producto.descripcion){
            xml += `<descripcion>${producto.descripcion}</descripcion>/n`;
        }
        xml += `<precio>${producto.precio}</precio>/n`;
        xml += `</producto>/n`;
    }
    xml += `<total>${this.getTotal()}</total>/n`;

    xml += `</producto>`;

    const blob = new Blob([xml], {type: 'text/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tiquet.xml';
    a.click();
    URL.revokeObjectURL(url);
    }
    private escapeXML(value: string):string {
        return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }

}