"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ShoppingCart, AlertCircle, CheckCircle, XCircle, LogOut, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { Producto, Reserva, Venta, Cliente } from "@/types/reservas";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // Estado local para usuario
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Cargar usuario desde SessionStorage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [reservasData, productosData, ventasData, clientesData] = await Promise.all([
        apiService.getReservas(),
        apiService.getProductos(),
        apiService.getVentas(),
        apiService.getClientes()
      ]);
      
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

  const getNombreProducto = (productoId: string) => {
    if (!Array.isArray(productos) || productos.length === 0) return 'Producto no encontrado';
    const producto = productos.find(p => p.id === productoId);
    return producto ? producto.name : 'Producto no encontrado';
  };

  const getInfoCliente = (clienteId: string | undefined) => {
    if (!clienteId || !Array.isArray(clientes) || clientes.length === 0) {
      return { nombre: 'Cliente no encontrado', telefono: 'N/A' };
    }
    // Buscamos coincidencia flexible
    const cliente = clientes.find(c => String(c.id_ct) === String(clienteId));
    return cliente ? {
      nombre: cliente.nm_ct,
      telefono: cliente.tl_ct
    } : {
      nombre: 'Cliente no encontrado',
      telefono: 'N/A'
    };
  };

  const confirmarRecogida = async (reserva: Reserva) => {
    try {
        setUpdating(reserva.id);
        const producto = productos.find(p => p.id === reserva.productoId);
        if (!producto) return;

        const precioReal = Number(producto.precio);
        const cantidadReal = Number(reserva.cantidad);
        const totalCalculado = precioReal * cantidadReal;

        const ventaData: Omit<Venta, 'id'> = {
            productoId: reserva.productoId,
            clienteId: reserva.clienteId || 'cliente-desconocido',
            usuarioId: user?.id || 'admin-1',
            total: totalCalculado,
            cantidad: cantidadReal,
            fecha: new Date().toISOString(),
            pago: "efectivo",
            productoNombre: producto.name
        };

      const ventaCreada = await apiService.createVenta(ventaData);
      
      await apiService.updateReserva(reserva.id, { ...reserva, estado: 'completada' });

      setReservas(prev => prev.map(r => r.id === reserva.id ? { ...r, estado: 'completada' } : r));
      setVentas(prev => [...prev, { ...ventaData, id: ventaCreada.id || Date.now().toString() }]);

      alert(`Reserva confirmada y venta registrada\nTotal: Bs. ${totalCalculado.toFixed(2)}`);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al confirmar');
    } finally {
      setUpdating(null);
    }
  };

  const cancelarReserva = async (reservaId: string) => {
    try {
      setUpdating(reservaId);
      setReservas(prev => prev.map(r => r.id === reservaId ? { ...r, estado: 'cancelado' } : r));
      await apiService.updateReserva(reservaId, { estado: 'cancelado' });
      alert('Reserva cancelada');
    } catch (error) {
      setReservas(prev => prev.map(r => r.id === reservaId ? { ...r, estado: 'pendiente' } : r));
      alert('Error al cancelar');
    } finally {
      setUpdating(null);
    }
  };

  const generarKeyUnica = (reserva: Reserva, index: number) => `${reserva.id}-${index}-${reserva.fecha}`;

  const reservasPendientes = reservas.filter(r => r.estado === 'pendiente').length;
  const reservasCompletadas = reservas.filter(r => r.estado === 'completada').length;
  const totalVentasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString()).length;

  if (loading && !user) {
    return <div className="flex justify-center h-64 items-center"><p>Cargando...</p></div>;
  }

  if (!user) return null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel de Control - CATEFARM</h1>
          <p className="text-muted-foreground">Bienvenido, {user.nombres || user.username}</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={cargarDatos} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Recargar
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{reservasPendientes}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reservas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{reservasCompletadas}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalVentasHoy}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-yellow-500" /> Reservas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservas.filter(r => r.estado === 'pendiente').map((reserva, index) => {
                  const infoCliente = getInfoCliente(reserva.clienteId);
                  return (
                    <div key={generarKeyUnica(reserva, index)} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{reserva.productoNombre || getNombreProducto(reserva.productoId)}</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Cantidad: {reserva.cantidad}</p>
                          <p>Cliente: {infoCliente.nombre}</p>
                          <p>Teléfono: {infoCliente.telefono}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => confirmarRecogida(reserva)} disabled={updating === reserva.id} className="bg-green-500 text-white text-xs px-3 py-2 rounded flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Confirmar
                        </button>
                        <button onClick={() => cancelarReserva(reserva.id)} disabled={updating === reserva.id} className="bg-red-500 text-white text-xs px-3 py-2 rounded flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Cancelar
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reservas.filter(r => r.estado === 'completada').slice(0, 5).map((reserva) => {
                  const infoCliente = getInfoCliente(reserva.clienteId);
                  return (
                    <div key={reserva.id} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <p className="text-sm font-medium">{reserva.productoNombre || getNombreProducto(reserva.productoId)}</p>
                        <p className="text-xs text-muted-foreground">Cant: {reserva.cantidad} • {new Date(reserva.fecha).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">Cliente: {infoCliente.nombre}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Completada</span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;