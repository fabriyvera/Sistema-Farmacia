"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ShoppingCart, AlertCircle, CheckCircle, XCircle, LogOut, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { Producto, Reserva, Venta, Cliente } from "@/types/reservas";
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (user && !authLoading) {
      cargarDatos();
    }
  }, [user, authLoading]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [reservasData, productosData, ventasData, clientesData] = await Promise.all([
        apiService.getReservas(),
        apiService.getProductos(),
        apiService.getVentas(),
        apiService.getClientes()
      ]);
      
      // Asegurar que siempre sean arrays
      setReservas(Array.isArray(reservasData) ? reservasData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);
      setVentas(Array.isArray(ventasData) ? ventasData : []);
      setClientes(Array.isArray(clientesData) ? clientesData : []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setReservas([]);
      setProductos([]);
      setVentas([]);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre del producto
  const getNombreProducto = (productoId: string) => {
    if (!Array.isArray(productos) || productos.length === 0) {
      return 'Producto no encontrado';
    }
    const producto = productos.find(p => p.id === productoId);
    return producto ? producto.name : 'Producto no encontrado';
  };

  // Obtener información del cliente - VERSIÓN SEGURA
  const getInfoCliente = (clienteId: string | undefined) => {
    if (!clienteId || !Array.isArray(clientes) || clientes.length === 0) {
      return {
        nombre: 'Cliente no encontrado',
        telefono: 'N/A'
      };
    }
    
    const cliente = clientes.find(c => c.id_ct === clienteId);
    return cliente ? {
      nombre: cliente.nm_ct,
      telefono: cliente.tl_ct
    } : {
      nombre: 'Cliente no encontrado',
      telefono: 'N/A'
    };
  };

  // Confirmar recogida de reserva y crear venta - VERSIÓN CORREGIDA
  const confirmarRecogida = async (reserva: Reserva) => {
    try {
      setUpdating(reserva.id);

      // 1. Validaciones iniciales
      if (!Array.isArray(productos) || productos.length === 0) {
        alert('Error: No se han cargado los productos');
        return;
      }

      // 2. Buscar el producto
      const producto = productos.find(p => p.id === reserva.productoId);
      if (!producto) {
        alert('Error: Producto no encontrado');
        return;
      }

      // 3. CALCULAR EL TOTAL - Versión mejorada
      let precioUnitario: number;
      
      // Intentar obtener precio del producto
      if (producto.precio) {
        precioUnitario = Number(producto.precio);
      } else if (producto.precio) {
        precioUnitario = Number(producto.precio);
      } else {
        // Si no tiene precio, pedirlo al usuario
        const precioInput = prompt(
          `El producto "${producto.name}" no tiene precio registrado.\n` +
          `Ingrese el precio unitario:`
        );
        
        if (!precioInput || isNaN(parseFloat(precioInput))) {
          alert('Precio no válido. Operación cancelada.');
          return;
        }
        
        precioUnitario = parseFloat(precioInput);
      }

      const total = precioUnitario * Number(reserva.cantidad);

      // 4. Preparar datos de la venta
      const ventaData: Omit<Venta, 'id'> = {
        productoId: reserva.productoId,
        clienteId: reserva.clienteId || 'cliente-desconocido',
        usuarioId: user?.id || 'admin-1',
        total: total.toFixed(2), // Convertir a string con 2 decimales
        cantidad: reserva.cantidad, // Convertir a string
        fecha: new Date().toISOString(),
        pago: "efectivo",
        productoNombre: producto.name,
        precioUnitario: precioUnitario.toFixed(2)
      };

      console.log('Datos de venta a enviar:', ventaData);

      // 5. CREAR LA VENTA primero
      const ventaCreada = await apiService.createVenta(ventaData);
      
      if (!ventaCreada) {
        throw new Error('No se pudo crear la venta en el sistema');
      }

      // 6. Actualizar estado de la reserva
      await apiService.updateReserva(reserva.id, {
        ...reserva,
        estado: 'completada'
      });

      // 7. Actualización optimista de la UI
      setReservas(prev => 
        prev.map(r => 
          r.id === reserva.id ? { ...r, estado: 'completada' } : r
        )
      );

      setVentas(prev => [...prev, {
        ...ventaData,
        id: ventaCreada.id || Date.now().toString()
      }]);

      alert(`✅ Reserva confirmada y venta registrada\nTotal: Bs. ${total.toFixed(2)}`);
      
    } catch (error) {
      console.error('Error confirmando recogida:', error);
      alert('Error al confirmar la recogida: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setUpdating(null);
    }
  };

  // Cancelar reserva
  const cancelarReserva = async (reservaId: string) => {
    try {
      setUpdating(reservaId);
      
      // Actualización optimista
     setReservas(prev => 
        prev.map(r => 
          r.id === reservaId ? { ...r, estado: 'cancelado' } : r
        )
      );

      await apiService.updateReserva(reservaId, {
        estado: 'cancelado'
      });

      alert('Reserva cancelada exitosamente');
      
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      
      // Revertir en caso de error
      setReservas(prev => 
        prev.map(r => 
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
    return `${reserva.id}-${index}-${reserva.fecha}`;
  };

  // Estadísticas
  const reservasPendientes = reservas.filter(r => r.estado === 'pendiente').length;
  const reservasCompletadas = reservas.filter(r => r.estado === 'completada').length;
  const totalVentasHoy = ventas.filter(v => 
    new Date(v.fecha).toDateString() === new Date().toDateString()
  ).length;

  if (authLoading || (user && loading)) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Encabezado con información de usuario */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel de Control - CATEFARM</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user.nombres} {user.apPaterno}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={cargarDatos}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Cargando...' : 'Recargar Datos'}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
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
                .map((reserva, index) => {
                  const infoCliente = getInfoCliente(reserva.clienteId);
                  
                  return (
                    <div key={generarKeyUnica(reserva, index)} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {reserva.productoNombre || getNombreProducto(reserva.productoId)}
                        </p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Cantidad: {reserva.cantidad}</p>
                          <p>Fecha: {new Date(reserva.fecha).toLocaleDateString()}</p>
                          <p>Hora: {new Date(reserva.fecha).toLocaleTimeString()}</p>
                          <p>Cliente: {infoCliente.nombre}</p>
                          <p>Teléfono: {infoCliente.telefono}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
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
                  const infoCliente = getInfoCliente(reserva.clienteId);
                  
                  return (
                    <div key={reserva.id} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <p className="text-sm font-medium">
                          {reserva.productoNombre || getNombreProducto(reserva.productoId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cantidad: {reserva.cantidad} • {new Date(reserva.fecha).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cliente: {infoCliente.nombre}
                        </p>
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