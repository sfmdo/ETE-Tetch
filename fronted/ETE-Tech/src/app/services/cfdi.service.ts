import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CfdiXmlService {

  constructor() { }

  public generateInvoiceXml(order: any, fiscalData: any): void {
    const IVA_RATE = 0.16;
    let totalImpuestosTrasladados = 0;
    let subtotal = 0;


    const conceptosXml = order.Items.map((item: any) => {
      const base = parseFloat(item.Line_Subtotal) || 0;
      const precioUnitario = parseFloat(item.Unit_Price) || 0;
      const cantidad = parseFloat(item.Quantity) || 0;
      const lineSubtotal = parseFloat(item.Line_Subtotal);
      const importeImpuesto = parseFloat((base * IVA_RATE).toFixed(2));
      totalImpuestosTrasladados += importeImpuesto;
      subtotal += base;

      return `
      <cfdi:Concepto 
        ClaveProdServ="81112306" 
        NoIdentificacion="${item.Product_ID}" 
        Cantidad="${cantidad.toFixed(2)}" 
        ClaveUnidad="E48" 
        Unidad="Unidad de servicio" 
        Descripcion="${item.Product_Name.toUpperCase()}" 
        ValorUnitario="${precioUnitario.toFixed(2)}" 
        Importe="${lineSubtotal.toFixed(2)}" 
        ObjetoImp="02">
        <cfdi:Impuestos>
          <cfdi:Traslados>
            <cfdi:Traslado 
              Base="${base.toFixed(2)}" 
              Impuesto="002" 
              TipoFactor="Tasa" 
              TasaOCuota="0.160000" 
              Importe="${importeImpuesto.toFixed(2)}"/>
          </cfdi:Traslados>
        </cfdi:Impuestos>
      </cfdi:Concepto>`;
    }).join('');


    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante 
    xmlns:cfdi="http://www.sat.gob.mx/cfd/4" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd" 
    Version="4.0" 
    Serie="A" 
    Folio="${order.Order_ID}" 
    Fecha="${new Date().toISOString().split('.')[0]}" 
    SubTotal="${subtotal.toFixed(2)}" 
    Moneda="MXN" 
    Total="${(subtotal + totalImpuestosTrasladados).toFixed(2)}" 
    TipoDeComprobante="I" 
    Exportacion="01" 
    LugarExpedicion="${fiscalData.codigoPostal}">
    <cfdi:Emisor 
        Rfc="EKU9003173C9" 
        Nombre="ETE TECH SERVICIOS DE COMPUTO" 
        RegimenFiscal="601"/>
    <cfdi:Receptor 
        Rfc="${fiscalData.rfc.toUpperCase()}" 
        Nombre="${fiscalData.nombre.toUpperCase()}" 
        DomicilioFiscalReceptor="${fiscalData.codigoPostal}" 
        RegimenFiscalReceptor="${fiscalData.regimenFiscal}" 
        UsoCFDI="${fiscalData.usoCFDI}"/>
    <cfdi:Conceptos>
        ${conceptosXml}
    </cfdi:Conceptos>
    <cfdi:Impuestos TotalImpuestosTrasladados="${totalImpuestosTrasladados.toFixed(2)}">
        <cfdi:Traslados>
            <cfdi:Traslado 
                Base="${subtotal.toFixed(2)}" 
                Impuesto="002" 
                TipoFactor="Tasa" 
                TasaOCuota="0.160000" 
                Importe="${totalImpuestosTrasladados.toFixed(2)}"/>
        </cfdi:Traslados>
    </cfdi:Impuestos>
</cfdi:Comprobante>`;

    this.downloadFile(xmlContent, `Factura_${order.Order_Number}.xml`);
  }

  private downloadFile(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}