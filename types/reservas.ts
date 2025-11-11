export interface Producto {
  id: string;
  name: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria: string;
  imagen: string;
  estado: string;
  proveedor: string;
  caducidad: string;
  recetaRequerida: string;
  createdAt: string;
}

export interface Reserva {
  id: string;
  productoId: string;
  fecha: string;
  cantidad: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  createdAt: string;
  clienteId?: string;
  clienteNombre?: string;
  sucursalId?: string;
  sucursalNombre?: string;
}

export interface Venta {
  id: string;
  productoId: string;
  clienteId: string;
  usuarioId: string;
  total: string;
  cantidad: string;
  fecha: string;
  pago: string;
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

export interface Reservation {
  id: string;
  product: Product;
  quantity: number;
  pickupLocation: string;
  reservationDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'collected';
}