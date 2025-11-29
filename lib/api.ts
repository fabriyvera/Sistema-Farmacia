import { Producto, Reserva, Venta, Sucursal, Product, Reservation } from '@/types/reservas';

const API_BASE = {
  productos: 'https://690a052a1a446bb9cc2104c7.mockapi.io/Productos',
  reservas: 'https://690a052a1a446bb9cc2104c7.mockapi.io/Reservas',
  ventas: 'https://690a052a1a446bb9cc2104c7.mockapi.io/Ventas',
  sucursales: 'https://690a052a1a446bb9cc2104c7.mockapi.io/Sucursales',
};
export interface Cliente {
  id_ct: string;
  nm_ct: string; 
  tl_ct: string; 
  em_ct: string; 
  ds_ct: string; 
  nc_ct: string; 
}

export const apiService = {
  async getClientes(): Promise<Cliente[]> {
    try {
      const response = await fetch('/api/clientes');
      if (!response.ok) throw new Error('Error obteniendo clientes');
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },
  async getClienteById(id: string): Promise<Cliente | null> {
    try {
      const response = await fetch(`/api/clientes/${id}`);
      if (!response.ok) throw new Error('Error obteniendo cliente');
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  },

  // Productos
  async getProductos(): Promise<Producto[]> {
    const response = await fetch(API_BASE.productos);
    return response.json();
  },

  async getProducto(id: string): Promise<Producto> {
    const response = await fetch(`${API_BASE.productos}/${id}`);
    return response.json();
  },

  // Reservas
  async getReservas(): Promise<Reserva[]> {
    const response = await fetch(API_BASE.reservas);
    return response.json();
  },

  async createReserva(reserva: Omit<Reserva, 'id'>): Promise<Reserva> {
    const response = await fetch(API_BASE.reservas, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reserva),
    });
    return response.json();
  },

  async updateReserva(id: string, data: Partial<Reserva>): Promise<Reserva> {
    const response = await fetch(`${API_BASE.reservas}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteReserva(id: string): Promise<void> {
    await fetch(`${API_BASE.reservas}/${id}`, {
      method: 'DELETE',
    });
  },

  // Ventas
  async createVenta(venta: Omit<Venta, 'id'>): Promise<Venta> {
    const response = await fetch(API_BASE.ventas, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venta),
    });
    return response.json();
  },

  async getVentas(): Promise<Venta[]> {
    const response = await fetch(API_BASE.ventas);
    return response.json();
  },

  // Sucursales
  async getSucursales(): Promise<Sucursal[]> {
    const response = await fetch(API_BASE.sucursales);
    return response.json();
  },
};