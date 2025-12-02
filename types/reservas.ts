export interface Producto {
  id: string;
  name: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria?: string;
  imagen: string;
  estado: string;
  proveedor: string;
  caducidad: string;
  recetaRequerida: string;
  createdAt: string;
}

export interface Cliente {
  id_ct: string;
  nm_ct: string;
  tl_ct: string;
  em_ct: string;
  ds_ct: string;
  nc_ct: string;
}


export interface Reserva {
  id: string;
  productoId: string;
  fecha: string;
  cantidad: number; 
  estado: 'pendiente' | 'completada' | 'cancelado';
  productoNombre?: string;
  sucursalId?: string;
  sucursalNombre?: string;
  clienteId?: string;
  createdAt?: string;
}


export interface Venta {
  id?: string;
  productoId: string;
  clienteId: string;
  usuarioId: string;
  total: number; 
  cantidad: number; 
  fecha: string;
  pago: string;
  productoNombre?: string;
}



declare global {
  interface Window {
    google: typeof google;
  }
}
export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  encargado: string;
  ciudad: string;
  telefono: string;
  nroDeTrabajadores: number;
  estado: string;
}

// Para el cliente
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  requiresPrescription: boolean;
  description: string;
  activeIngredient: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number; // ahora es número
  descripcion: string;
  categoria: string;
  estado: string;
}