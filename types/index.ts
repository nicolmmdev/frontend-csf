export interface Producto {
  id_producto: number;
  nombre_producto: string;
  nroLote: string;
  fec_registro: string;
  costo: number;
  precioVenta: number;
}

export interface Item {
  idProducto: number;
  cantidad: number;
  precio: number;
}

export interface CompraRequest {
  items: Item[];
}

export interface VentaRequest {
  items: Item[];
}

export interface Movimiento {
  id: number;
  idProducto: number;
  tipo: number;
  cantidad: number;
  fecha: string;
}
export interface Producto {
  id_producto: number;
  nombre_producto: string;
  nroLote: string;
  fec_registro: string;
  costo: number;
  precioVenta: number;
}