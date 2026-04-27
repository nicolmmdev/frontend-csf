

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


export interface Item {
  idProducto: number;
  cantidad: number;
  precio: number;
}



export interface Producto {
  id_producto: number;
  nombre_producto: string;
  nroLote: string;
  fec_registro: string;
  costo: string;
  precioVenta: string;
}

export interface Compra {
  id: number;
  fecRegistro: string;
  subTotal: string;
  igv: string;
  total: string;
}

export interface CompraDetalle {
  idProducto: number;
  nombre_producto: string;
  cantidad: number;
  precio: number;
  total: number;
}