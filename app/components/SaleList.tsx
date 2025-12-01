"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Search, User, Package, ShoppingCart, Wallet, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import { Venta } from "@/types/reservas"; // Importamos la interfaz Venta

const Sales = () => {
  const [sales, setSales] = useState<Venta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar ventas desde la API
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Ventas");
        if (!res.ok) throw new Error("Error al cargar las ventas");
        const data: Venta[] = await res.json();
        
        // Asegurar que cada venta tenga un ID único
        const salesWithId = data.map((sale, index) => ({
          ...sale,
          id: sale.id || `venta-${index}-${Date.now()}`
        }));
        
        setSales(salesWithId);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
    
    // Recargar cada 30 segundos para ver nuevas ventas
    const interval = setInterval(fetchSales, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generar ID único para cada venta si no lo tiene
  const getSaleKey = (sale: Venta, index: number) => {
    return sale.id || `sale-${sale.productoId}-${sale.clienteId}-${sale.fecha}-${index}`;
  };

  // Función segura para convertir a string y buscar
  const safeSearch = (value: any, searchTerm: string): boolean => {
    if (!value) return false;
    const strValue = String(value).toLowerCase();
    const strSearch = searchTerm.toLowerCase();
    return strValue.includes(strSearch);
  };

  const filteredSales = sales.filter(sale =>
    safeSearch(sale.clienteId, searchTerm) ||
    safeSearch(sale.productoId, searchTerm) ||
    safeSearch(sale.pago, searchTerm) ||
    safeSearch(sale.productoNombre, searchTerm) ||
    safeSearch(sale.total, searchTerm) ||
    safeSearch(sale.usuarioId, searchTerm)
  );

  // Calcular estadísticas solo de hoy
  const todaySales = sales.filter(sale => {
    try {
      return new Date(sale.fecha).toDateString() === new Date().toDateString();
    } catch {
      return false;
    }
  });
  
  const todayTotal = todaySales.reduce((sum, sale) => {
    try {
      return sum + parseFloat(sale.total || "0");
    } catch {
      return sum;
    }
  }, 0);
  
  const todaySalesCount = todaySales.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <p>Cargando ventas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Ventas</h1>
          <p className="text-muted-foreground">Lista de ventas registradas en la API</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ventas..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas de Hoy</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySalesCount}</div>
            <p className="text-xs text-muted-foreground">Transacciones completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Hoy</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {todayTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ingresos del día</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Bs. {todaySalesCount > 0 ? (todayTotal / todaySalesCount).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Promedio por venta</p>
          </CardContent>
        </Card>
      </div>

      {/* Listado de Ventas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Registro de Ventas
          </CardTitle>
          <CardDescription>
            {filteredSales.length} venta{filteredSales.length !== 1 ? 's' : ''} encontrada{filteredSales.length !== 1 ? 's' : ''}
            {searchTerm && ` para "${searchTerm}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSales.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale, index) => (
                    <TableRow key={getSaleKey(sale, index)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{sale.productoNombre || `Producto ${sale.productoId}`}</div>
                            {sale.precioUnitario && (
                              <div className="text-xs text-muted-foreground">
                                Precio unitario: Bs. {parseFloat(sale.precioUnitario).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{String(sale.clienteId || 'N/A')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            sale.pago === 'efectivo' ? 'border-green-200 bg-green-50 text-green-700' :
                            sale.pago === 'tarjeta' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                            'border-purple-200 bg-purple-50 text-purple-700'
                          }
                        >
                          {sale.pago}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-700">
                        Bs. {parseFloat(sale.total || "0").toFixed(2)}
                      </TableCell>
                      <TableCell className="font-medium">{sale.cantidad}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(sale.fecha).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(sale.fecha).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          Completada
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ventas registradas</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `No se encontraron ventas para "${searchTerm}"`
                  : "Cuando confirmes reservas en el panel de control, aparecerán aquí"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;