export interface DetalleVenta {

  id_detalle: number;

  id_venta: number;

  id_producto: number;

  concepto_tipo_item: string; // Producto o Servicio

  cantidad: number;

  precio_unitario: number;

  importe_linea: number;

}