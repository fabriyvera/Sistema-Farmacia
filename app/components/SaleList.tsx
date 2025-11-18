"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Search, User, Package, ShoppingCart, Wallet, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";

interface Sale {
  productoId: string;
  clienteId: string;
  usuarioId: string;
  total: string;
  cantidad: string;
  fecha: string;
  pago: string;
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar ventas desde la API
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Ventas"); // tu endpoint real
        if (!res.ok) throw new Error("Error al cargar las ventas");
        const data: Sale[] = await res.json();
        setSales(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSales();
  }, []);

  const filteredSales = sales.filter(sale =>
    sale.clienteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.productoId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.pago.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayTotal = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
  const todaySalesCount = sales.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestión de Ventas</h1>
          <p className="text-muted-foreground">Lista de ventas registradas en la API</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ventas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ventas de Hoy</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{todaySalesCount}</div>
            <p className="text-xs text-muted-foreground">Transacciones completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total de Hoy</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">Bs.{todayTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ingresos del día</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ticket Promedio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              Bs.{todaySalesCount > 0 ? (todayTotal / todaySalesCount).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Promedio por venta</p>
          </CardContent>
        </Card>
      </div>

      {/* Listado de Ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Ventas</CardTitle>
          <CardDescription>Lista de todas las ventas realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto ID</TableHead>
                <TableHead>Cliente ID</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale, index) => (
                <TableRow key={index}>
                  <TableCell>{sale.productoId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {sale.clienteId}
                    </div>
                  </TableCell>
                  <TableCell>{sale.pago}</TableCell>
                  <TableCell className="text-primary">Bs. {sale.total}</TableCell>
                  <TableCell>{sale.cantidad}</TableCell>
                  <TableCell>{new Date(sale.fecha).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-500">Completada</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
