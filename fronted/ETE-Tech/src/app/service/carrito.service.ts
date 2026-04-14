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
        const totalNum = this.getTotal();
        // Simulando que el precio de venta ya incluye el 16% de IVA
        const subtotalNum = totalNum / 1.16;
        const ivaNum = totalNum - subtotalNum;

        const totalStr = totalNum.toFixed(2);
        const subTotalStr = subtotalNum.toFixed(2);
        const ivaStr = ivaNum.toFixed(2);

        const fecha = new Date().toISOString().split('.')[0]; // YYYY-MM-DDTHH:mm:ss
        
        // Estructura XML CFDI 4.0 (Simulada para demostración)
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante 
    xmlns:cfdi="http://www.sat.gob.mx/cfd/4" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd" 
    Version="4.0" 
    Serie="A" 
    Folio="12345" 
    Fecha="${fecha}" 
    Sello="MockSelloDePruebaCfdi40ParaDemostracion==" 
    FormaPago="01" 
    NoCertificado="00001000000500000000" 
    Certificado="MockCertificadoDePrueba=" 
    CondicionesDePago="Contado" 
    SubTotal="${subTotalStr}" 
    Moneda="MXN" 
    TipoCambio="1" 
    Total="${totalStr}" 
    TipoDeComprobante="I" 
    Exportacion="01" 
    MetodoPago="PUE" 
    LugarExpedicion="12345">
    
    <cfdi:Emisor 
        Rfc="EKU9003173C9" 
        Nombre="TU EMPRESA S.A DE C.V" 
        RegimenFiscal="601"/>
        
    <cfdi:Receptor 
        Rfc="XAXX010101000" 
        Nombre="PUBLICO EN GENERAL" 
        DomicilioFiscalReceptor="12345" 
        RegimenFiscalReceptor="616" 
        UsoCFDI="S01"/>
        
    <cfdi:Conceptos>
`;

        for (const producto of this._listaCarrito()) {
            const precioVenta = producto.precio_venta;
            const subtotalProd = precioVenta / 1.16;
            const ivaProd = precioVenta - subtotalProd;

            const precioVentaStr = precioVenta.toFixed(2);
            const subtotalProdStr = subtotalProd.toFixed(2);
            const ivaProdStr = ivaProd.toFixed(2);

            const descripcion = producto.descripcion 
                ? `${this.escapeXML(producto.nombre)} - ${this.escapeXML(producto.descripcion)}`
                : this.escapeXML(producto.nombre);
                
            xml += `        <cfdi:Concepto 
            ClaveProdServ="01010101" 
            NoIdentificacion="${producto.id_producto}" 
            Cantidad="1" 
            ClaveUnidad="H87" 
            Unidad="Pieza" 
            Descripcion="${descripcion}" 
            ValorUnitario="${subtotalProdStr}" 
            Importe="${subtotalProdStr}" 
            ObjetoImp="02">
            
            <cfdi:Impuestos>
                <cfdi:Traslados>
                    <cfdi:Traslado Base="${subtotalProdStr}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${ivaProdStr}"/>
                </cfdi:Traslados>
            </cfdi:Impuestos>

            <producto>
                <id>${producto.id_producto}</id>
                <nombre>${this.escapeXML(producto.nombre)}</nombre>
                <categoria>${this.escapeXML(producto.categoria)}</categoria>\n`;
            if (producto.descripcion) {
                xml += `                <descripcion>${this.escapeXML(producto.descripcion)}</descripcion>\n`;
            }
            xml += `                <precio>${precioVentaStr}</precio>
            </producto>
        </cfdi:Concepto>\n`;
        }

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
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}