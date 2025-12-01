"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ShoppingCart, AlertCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { Producto, Reserva, Venta } from "@/types/reservas";

const Dashboard = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [reservasData, productosData, ventasData] = await Promise.all([
        apiService.getReservas(),
        apiService.getProductos(),
        apiService.getVentas(),
      ]);
      
      setReservas(reservasData);
      setProductos(productosData);
      setVentas(ventasData);
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

  // CONFIRMAR RECOGIDA - SIN RECARGA AUTOMÁTICA
  const confirmarRecogida = async (reserva: Reserva) => {
    try {
      setUpdating(reserva.id);
      
      // Actualización optimista INMEDIATA
      setReservas(prevReservas => 
        prevReservas.map(r => 
          r.id === reserva.id ? { ...r, estado: 'completada' } : r
        )
      );

      // Actualizar en el servidor (pero no recargar datos)
      await apiService.updateReserva(reserva.id, {
        ...reserva,
        estado: 'completada'
      });

      // Mensaje de éxito SIN recargar datos
      alert('Reserva confirmada como recogida - Los datos se actualizarán en la próxima recarga');
      
    } catch (error) {
      console.error('Error confirmando recogida:', error);
      
      // Revertir en caso de error
      setReservas(prevReservas => 
        prevReservas.map(r => 
          r.id === reserva.id ? { ...r, estado: reserva.estado } : r
        )
      );
      
      alert('Error al confirmar la recogida');
    } finally {
      setUpdating(null);
    }
  };

  // CANCELAR RESERVA - SIN RECARGA AUTOMÁTICA
  const cancelarReserva = async (reservaId: string) => {
    try {
      setUpdating(reservaId);
      
      // Actualización optimista INMEDIATA
      setReservas(prevReservas => 
        prevReservas.map(r => 
          r.id === reservaId ? { ...r, estado: 'cancelado' } : r
        )
      );

      // Actualizar en servidor (pero no recargar datos)
      await apiService.updateReserva(reservaId, {
        estado: 'cancelado'
      });

      // Mensaje de éxito SIN recargar datos
      alert('Reserva cancelada - Los datos se actualizarán en la próxima recarga');
      
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      
      // Revertir en caso de error
      setReservas(prevReservas => 
        prevReservas.map(r => 
          r.id === reservaId ? { ...r, estado: 'pendiente' } : r
        )
      );
      
      alert('Error al cancelar la reserva');
    } finally {
      setUpdating(null);
    }
  };

  // Función para generar claves únicas
  const generarKeyUnica = (reserva: Reserva, index: number) => {
    // Usar una combinación de id + índice para garantizar unicidad
    return `${reserva.id}-${index}-${reserva.fecha}`;
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
      {/* Encabezado con botón de recarga manual */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel de Control</h1>
          <p className="text-muted-foreground">
            Bienvenido al sistema CATEFARM - Gestión Integral de Farmacias
          </p>
        </div>
        <button
          onClick={cargarDatos}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Recargar Datos
        </button>
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
              {reservas
                .filter(r => r.estado === 'pendiente')
                .map((reserva, index) => (
                <div key={generarKeyUnica(reserva, index)} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {reserva.productoNombre || getNombreProducto(reserva.productoId)}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Cantidad: {reserva.cantidad}</p>
                      <p>Fecha: {new Date(reserva.fecha).toLocaleDateString()}</p>
                      <p>Hora: {new Date(reserva.fecha).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmarRecogida(reserva)}
                      disabled={updating === reserva.id}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs px-3 py-2 rounded flex items-center gap-1"
                    >
                      {updating === reserva.id ? (
                        'Procesando...'
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Confirmar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => cancelarReserva(reserva.id)}
                      disabled={updating === reserva.id}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs px-3 py-2 rounded flex items-center gap-1"
                    >
                      <XCircle className="h-3 w-3" />
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
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
              {reservas
                .filter(r => r.estado === 'completada')
                .slice(0, 5)
                .map((reserva, index) => (
                <div key={generarKeyUnica(reserva, index)} className="flex items-center justify-between p-2 border-b">
                  <div>
                    <p className="text-sm font-medium">
                      {reserva.productoNombre || getNombreProducto(reserva.productoId)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cantidad: {reserva.cantidad} • {new Date(reserva.fecha).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    Completada
                  </span>
                </div>
              ))}
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