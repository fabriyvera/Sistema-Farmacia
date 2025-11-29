"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Users, Package, Building2, ShoppingCart, TrendingUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { Producto, Reserva, Venta, Cliente } from "@/types/reservas";

const Dashboard = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [reservasData, productosData, ventasData, clientesData] = await Promise.all([
        apiService.getReservas(),
        apiService.getProductos(),
        apiService.getVentas(),
        apiService.getClientes(),
      ]);
      
      setReservas(reservasData);
      setProductos(productosData);
      setVentas(ventasData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre del producto
  const getNombreProducto = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? producto.name : 'Producto no encontrado';
  };

  // Obtener información del cliente
  const getInfoCliente = (clienteId: string) => {
    const cliente = clientes.find(c => c.id_ct === clienteId);
    return cliente ? {
      nombre: cliente.nm_ct,
      telefono: cliente.tl_ct
    } : {
      nombre: 'Cliente no encontrado',
      telefono: 'N/A'
    };
  };

  // Confirmar recogida de reserva y crear venta
  const confirmarRecogida = async (reserva: Reserva) => {
    try {
      // 1. Buscar el producto para obtener el precio (necesitas agregar precio a tu tipo Producto)
      const producto = productos.find(p => p.id === reserva.productoId);
      if (!producto) {
        alert('Error: Producto no encontrado');
        return;
      }

      // 2. Calcular el total (asumiendo que producto tiene campo price)
      // Si no tienes precio en productos, necesitarás agregarlo
      const total = (parseFloat(producto.precio) * parseInt(reserva.cantidad)).toFixed(2);

      // 3. Actualizar estado de la reserva
      await apiService.updateReserva(reserva.id, {
        ...reserva,
        estado: 'completada'
      });

      // 4. Crear una venta
      if (reserva.clienteId) {
        await apiService.createVenta({
          productoId: reserva.productoId,
          clienteId: reserva.clienteId,
          usuarioId: "1", // Aquí debes usar el ID del usuario/admin logueado
          total: total,
          cantidad: parseInt(reserva.cantidad),
          fecha: new Date().toISOString(),
          pago: "efectivo" // Puedes hacer este campo dinámico si lo necesitas
        });
      }

      // 5. Recargar datos
      await cargarDatos();
      
      alert('Reserva confirmada como recogida y venta registrada');
    } catch (error) {
      console.error('Error confirmando recogida:', error);
      alert('Error al confirmar la recogida');
    }
  };

  // Cancelar reserva
  const cancelarReserva = async (reservaId: string) => {
    try {
      await apiService.updateReserva(reservaId, {
        estado: 'cancelado'
      });
      await cargarDatos();
      alert('Reserva cancelada');
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      alert('Error al cancelar la reserva');
    }
  };

  // Estadísticas
  const reservasPendientes = reservas.filter(r => r.estado === 'pendiente').length;
  const reservasCompletadas = reservas.filter(r => r.estado === 'completada').length;
  const totalVentasHoy = ventas.filter(v => 
    new Date(v.fecha).toDateString() === new Date().toDateString()
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        <p className="text-muted-foreground">
          Bienvenido al sistema CATEFARM - Gestión Integral de Farmacias
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservasPendientes}</div>
            <p className="text-xs text-muted-foreground">
              Esperando recogida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservasCompletadas}</div>
            <p className="text-xs text-muted-foreground">
              Recogidas hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVentasHoy}</div>
            <p className="text-xs text-muted-foreground">
              Transacciones completadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Reservas Pendientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Reservas Pendientes
            </CardTitle>
            <CardDescription>Reservas por confirmar recogida</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservas.filter(r => r.estado === 'pendiente').map((reserva) => {
                const infoCliente = reserva.clienteId ? getInfoCliente(reserva.clienteId) : null;
                
                return (
                  <div key={reserva.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {getNombreProducto(reserva.productoId)}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Cantidad: {reserva.cantidad}</p>
                        <p>Fecha: {new Date(reserva.fecha).toLocaleDateString()}</p>
                        <p>Hora: {new Date(reserva.fecha).toLocaleTimeString()}</p>
                        {infoCliente && (
                          <>
                            <p>Cliente: {infoCliente.nombre}</p>
                            <p>Teléfono: {infoCliente.telefono}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmarRecogida(reserva)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Confirmar
                      </button>
                      <button
                        onClick={() => cancelarReserva(reserva.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded flex items-center gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                );
              })}
              {reservas.filter(r => r.estado === 'pendiente').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay reservas pendientes
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reservas Recientes Completadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Reservas Recientes Completadas
            </CardTitle>
            <CardDescription>Últimas reservas recogidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reservas.filter(r => r.estado === 'completada')
                .slice(0, 5)
                .map((reserva) => {
                  const infoCliente = reserva.clienteId ? getInfoCliente(reserva.clienteId) : null;
                  
                  return (
                    <div key={reserva.id} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <p className="text-sm font-medium">
                          {getNombreProducto(reserva.productoId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cantidad: {reserva.cantidad} • {new Date(reserva.fecha).toLocaleDateString()}
                        </p>
                        {infoCliente && (
                          <p className="text-xs text-muted-foreground">
                            Cliente: {infoCliente.nombre}
                          </p>
                        )}
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        Completada
                      </span>
                    </div>
                  );
                })}
              {reservas.filter(r => r.estado === 'completada').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay reservas completadas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;