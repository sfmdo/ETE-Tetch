export interface Product {

  id_producto: number;
  codigo_sku: string;

  nombre: string;
  descripcion: string;
  categoria: string;

  tipo_de_item: string;

  precio_costo: number;
  precio_venta: number;
  tasa_impuesto: number;


  imagen: string;

  estado: boolean;

}