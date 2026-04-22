import { Injectable, signal, computed } from "@angular/core";
import { Product } from "../models/product.model";

@Injectable({providedIn: 'root'})
export class CarritoService {
    // Lista del carrito usando signals para reactividad
    private _listaCarrito = signal<Product[]>([]);

    // Exponer la lista como un signal de solo lectura
    Lista = this._listaCarrito.asReadonly();

    // Signal computado para el total
    total = computed(() => {
        // Le decimos: Si Final_Price no existe, usa 0 (o puedes usar Sale_Price como respaldo)
        return this._listaCarrito().reduce((acc, producto) => acc + (producto.Final_Price ?? producto.Sale_Price ?? 0), 0);
    });

    // Agregar producto al carrito
    agregarProducto(producto: Product) {
        this._listaCarrito.update(lista => [...lista, producto]);
    }

    // Eliminar producto del carrito
    eliminarProducto(producto: Product) {
        // Actualizado a Product_ID
        this._listaCarrito.update(lista => lista.filter(p => p.Product_ID !== producto.Product_ID));
    }

    // Vaciar carrito
    vaciarCarrito() {
        this._listaCarrito.set([]);
    }

    // Obtener lista del carrito (para compatibilidad si es necesario)
    getListaCarrito(): Product[] {
        return this._listaCarrito();
    }

    // Obtener total del carrito (para compatibilidad si es necesario)
    getTotal(): number {
        return this.total();
    }

    exportarXML() {
        // Estructura XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<tiquet>\n`;

        for (const producto of this._listaCarrito()) {
            xml += `  <producto>\n`;
            xml += `    <id>${producto.Product_ID}</id>\n`; 
            xml += `    <nombre>${this.escapeXML(producto.Name)}</nombre>\n`; 
            xml += `    <categoria>${this.escapeXML(producto.Category)}</categoria>\n`; 
            
            if (producto.Description) { 
                xml += `    <descripcion>${this.escapeXML(producto.Description)}</descripcion>\n`; 
            }
            xml += `    <precio_base>${producto.Sale_Price}</precio_base>\n`; 
            xml += `    <tasa_impuesto>${producto.Tax_Rate}</tasa_impuesto>\n`; 
            
            xml += `    <precio_final>${producto.Final_Price ?? producto.Sale_Price}</precio_final>\n`; 
            
            xml += `  </producto>\n`;
        }

        const totalVal = this.total();
        const subTotalVal = totalVal / 1.16;
        const ivaVal = totalVal - subTotalVal;

        const subTotalStr = subTotalVal.toFixed(2);
        const ivaStr = ivaVal.toFixed(2);
        const totalStr = totalVal.toFixed(2);

        xml += `    </cfdi:Conceptos>

    <cfdi:Impuestos TotalImpuestosTrasladados="${ivaStr}">
        <cfdi:Traslados>
            <cfdi:Traslado Base="${subTotalStr}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${ivaStr}"/>
        </cfdi:Traslados>
    </cfdi:Impuestos>

    <cfdi:Addenda>
        <TotalesFactura>
            <Subtotal>${subTotalStr}</Subtotal>
            <IVA_16>${ivaStr}</IVA_16>
            <TotalPago>${totalStr}</TotalPago>
        </TotalesFactura>
    </cfdi:Addenda>
</cfdi:Comprobante>`;

        const blob = new Blob([xml], {type: 'text/xml'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'factura_cfdi_4_0.xml';
        a.click();
        URL.revokeObjectURL(url);
    }

    private escapeXML(value: string): string {
        if (!value) return ''; // Por si viene un valor nulo o indefinido
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}