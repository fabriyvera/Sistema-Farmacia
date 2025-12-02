"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from "recharts";
import {
  FileText, Download, Package, CalendarClock, ShoppingCart, 
  TrendingUp, FileSpreadsheet, Printer
} from "lucide-react";

import { apiService } from "@/lib/api";
import { Venta, Reserva } from "@/types/reservas";

// Librerías para exportación (Asegúrate de instalarlas: npm install jspdf jspdf-autotable xlsx)
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("ventas");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Datos reales
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ventasData, reservasData] = await Promise.all([
          apiService.getVentas(),
          apiService.getReservas()
        ]);
        setVentas(Array.isArray(ventasData) ? ventasData : []);
        setReservas(Array.isArray(reservasData) ? reservasData : []);
      } catch (error) {
        console.error("Error cargando reportes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar datos por fecha
  const filterByDate = (data: any[]) => {
    if (!dateFrom || !dateTo) return data;
    const start = new Date(dateFrom).getTime();
    const end = new Date(dateTo).getTime() + 86400000; // Sumar 1 día para incluir la fecha final completa

    return data.filter(item => {
      const itemDate = new Date(item.fecha || item.createdAt).getTime();
      return itemDate >= start && itemDate <= end;
    });
  };

  const filteredVentas = filterByDate(ventas);
  const filteredReservas = filterByDate(reservas);

  // --- LÓGICA DE EXPORTACIÓN EXCEL ---
  const exportToExcel = (type: 'ventas' | 'reservas') => {
    const data = type === 'ventas' ? filteredVentas : filteredReservas;
    const fileName = `Reporte_${type}_${new Date().toLocaleDateString().replace(/\//g, '-')}`;

    // Formatear datos para Excel
    const formattedData = data.map(item => {
      if (type === 'ventas') {
        return {
          ID: (item as Venta).id,
          Fecha: new Date((item as Venta).fecha).toLocaleString(),
          Producto: (item as Venta).productoNombre || 'N/A',
          Cantidad: (item as Venta).cantidad,
          Total: (item as Venta).total,
          Pago: (item as Venta).pago
        };
      } else {
        return {
          ID: (item as Reserva).id,
          Fecha: new Date((item as Reserva).fecha).toLocaleString(),
          Producto: (item as Reserva).productoNombre || 'N/A',
          Cantidad: (item as Reserva).cantidad,
          Estado: (item as Reserva).estado,
          Cliente: (item as Reserva).clienteId || 'Mostrador'
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type === 'ventas' ? "Ventas" : "Reservas");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // --- LÓGICA DE EXPORTACIÓN PDF ---
  const exportToPDF = (type: 'ventas' | 'reservas') => {
    const doc = new jsPDF();
    const title = type === 'ventas' ? "REPORTE DE VENTAS" : "REPORTE DE RESERVAS";
    const data = type === 'ventas' ? filteredVentas : filteredReservas;

    doc.setFontSize(18);
    doc.text("CATEFARM - Sistema de Gestión", 14, 22);
    doc.setFontSize(14);
    doc.text(title, 14, 32);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 40);
    
    if (dateFrom && dateTo) {
      doc.text(`Rango: ${dateFrom} al ${dateTo}`, 14, 46);
    }

    const tableColumn = type === 'ventas' 
      ? ["ID", "Fecha", "Producto", "Cant.", "Total (Bs)", "Pago"]
      : ["ID", "Fecha Recogida", "Producto", "Cant.", "Estado", "Cliente"];

    // CORRECCIÓN: Aseguramos que no haya valores 'undefined'
    const tableRows = data.map(item => {
      if (type === 'ventas') {
        const v = item as Venta;
        return [
          (v.id || "").slice(0, 8), // Usamos || "" para evitar undefined
          new Date(v.fecha).toLocaleDateString(),
          v.productoNombre || "N/A",
          v.cantidad || 0,
          Number(v.total).toFixed(2),
          v.pago || "N/A"
        ];
      } else {
        const r = item as Reserva;
        return [
          (r.id || "").slice(0, 8), // Usamos || "" para evitar undefined
          new Date(r.fecha).toLocaleDateString(),
          r.productoNombre || "N/A",
          r.cantidad || 0,
          r.estado || "N/A",
          r.clienteId === '0' ? 'Mostrador' : (r.clienteId || 'N/A')
        ];
      }
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
    });

    // Total al final si son ventas
    if (type === 'ventas') {
      const totalSum = filteredVentas.reduce((acc, curr) => acc + Number(curr.total), 0);
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Total Ingresos: Bs. ${totalSum.toFixed(2)}`, 14, finalY);
    }

    doc.save(`${title.replace(/ /g, "_")}.pdf`);
  };

  // Datos para gráficas (Simplificado)
  const chartData = filteredVentas.slice(0, 10).map(v => ({
    name: new Date(v.fecha).toLocaleDateString().slice(0, 5),
    total: v.total
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Reportes</h2>
          <p className="text-muted-foreground">Genera y exporta informes detallados.</p>
        </div>
      </div>

      {/* FILTROS */}
      <Card className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm font-medium mb-1 block">Desde</label>
            <input
              type="date"
              className="w-full border rounded-md p-2 text-sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Hasta</label>
            <input
              type="date"
              className="w-full border rounded-md p-2 text-sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => {setDateFrom(""); setDateTo("")}}
              className="text-gray-600"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white p-1 border">
          <TabsTrigger value="ventas" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Reporte de Ventas
          </TabsTrigger>
          <TabsTrigger value="reservas" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
            <CalendarClock className="w-4 h-4 mr-2" />
            Reporte de Reservas
          </TabsTrigger>
        </TabsList>

        {/* --- PESTAÑA VENTAS --- */}
        <TabsContent value="ventas" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button onClick={() => exportToExcel('ventas')} className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <FileSpreadsheet className="w-4 h-4" /> Exportar Excel
            </Button>
            <Button onClick={() => exportToPDF('ventas')} className="bg-red-600 hover:bg-red-700 text-white gap-2">
              <FileText className="w-4 h-4" /> Exportar PDF
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos Totales</CardTitle>
                <CardDescription>En el periodo seleccionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  Bs. {filteredVentas.reduce((acc, curr) => acc + Number(curr.total), 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredVentas.length} transacciones registradas
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Ventas</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalle de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cliente ID</TableHead>
                      <TableHead>Pago</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVentas.length > 0 ? (
                      filteredVentas.map((venta) => (
                        <TableRow key={venta.id}>
                          <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{venta.productoNombre || "Desconocido"}</TableCell>
                          <TableCell>{venta.clienteId === '0' ? 'Mostrador' : venta.clienteId}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{venta.pago}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold">Bs. {Number(venta.total).toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No hay ventas en este rango de fechas
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PESTAÑA RESERVAS --- */}
        <TabsContent value="reservas" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button onClick={() => exportToExcel('reservas')} className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <FileSpreadsheet className="w-4 h-4" /> Exportar Excel
            </Button>
            <Button onClick={() => exportToPDF('reservas')} className="bg-red-600 hover:bg-red-700 text-white gap-2">
              <FileText className="w-4 h-4" /> Exportar PDF
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Total Reservas</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{filteredReservas.length}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Pendientes</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {filteredReservas.filter(r => r.estado === 'pendiente').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Completadas</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {filteredReservas.filter(r => r.estado === 'completada').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cliente ID</TableHead>
                      <TableHead>Cant.</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservas.length > 0 ? (
                      filteredReservas.map((reserva) => (
                        <TableRow key={reserva.id}>
                          <TableCell>{new Date(reserva.fecha).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{reserva.productoNombre}</TableCell>
                          <TableCell>{reserva.clienteId}</TableCell>
                          <TableCell>{reserva.cantidad}</TableCell>
                          <TableCell>
                            <Badge className={
                              reserva.estado === 'completada' ? 'bg-green-100 text-green-800' :
                              reserva.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }>
                              {reserva.estado}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No hay reservas en este rango de fechas
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;