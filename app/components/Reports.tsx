"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from "recharts";

import {
  FileText,
  Download,
  Package,
  Building2,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from "lucide-react";

const Reports = () => {

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportType, setReportType] = useState("ventas");
  const [downloading, setDownloading] = useState(false);

  // FALTABA ESTO
  const [activeTab, setActiveTab] = useState("inventory");

  // Control para mostrar contenido
  const [showData, setShowData] = useState(false);

  // Obtener rol del usuario
  const userRole =
    typeof window !== "undefined" ? sessionStorage.getItem("userType") : null;

  // ============================================================
  // 📦 CARGAR PRODUCTOS
  // ============================================================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Productos");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error cargando productos", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // ============================================================
  // 📦 INVENTORY DATA
  // ============================================================
  const [inventoryData, setInventoryData] = useState<any[]>([]);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const res = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Productos");
        const data = await res.json();
        setInventoryData(data);
      } catch (err) {
        console.error("Error cargando inventario", err);
      }
    };

    loadInventory();
  }, []);

  // Stock agrupado por categoría
  const stockByCategory = inventoryData.reduce((acc: any[], item: any) => {
    const found = acc.find((x) => x.category === item.categoria);

    if (found) {
      found.cantidad += Number(item.stock);
    } else {
      acc.push({
        category: item.categoria,
        cantidad: Number(item.stock),
      });
    }

    return acc;
  }, []);

  // ============================================================
  // 🏢 SUPPLIERS DATA
  // ============================================================
  const [suppliersData, setSuppliersData] = useState<any[]>([]);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const res = await fetch("TU_API_PROVEEDORES"); // ← Cambia por la real
        const data = await res.json();
        setSuppliersData(data);
      } catch (err) {
        console.error("Error cargando proveedores", err);
      }
    };

    loadSuppliers();
  }, []);

  const supplierPerformance = [
    { month: "Ene", central: 15000, medica: 12000, unidos: 10000 },
    { month: "Feb", central: 18000, medica: 14000, unidos: 11000 },
    { month: "Mar", central: 20000, medica: 15000, unidos: 12000 },
    { month: "Abr", central: 22000, medica: 16000, unidos: 13000 },
    { month: "May", central: 25000, medica: 18000, unidos: 15000 },
  ];

  // ============================================================
  // 💰 SALES DATA
  // ============================================================
  const salesData = [
    { month: "Enero", ventas: 95420, cantidad: 245 },
    { month: "Febrero", ventas: 102350, cantidad: 268 },
    { month: "Marzo", ventas: 118900, cantidad: 312 },
    { month: "Abril", ventas: 125670, cantidad: 334 },
    { month: "Mayo", ventas: 132450, cantidad: 356 },
  ];

  const salesByCategory = [
    { name: "Analgésicos", value: 35 },
    { name: "Vitaminas", value: 25 },
    { name: "Antibióticos", value: 20 },
    { name: "Antiinflamatorios", value: 12 },
    { name: "Otros", value: 8 },
  ];

  const topProducts = [
    { product: "Paracetamol 500mg", units: 1250, revenue: 31875 },
    { product: "Ibuprofeno 400mg", units: 980, revenue: 34300 },
    { product: "Vitamina C 1000mg", units: 850, revenue: 38250 },
    { product: "Omeprazol 20mg", units: 720, revenue: 39600 },
    { product: "Loratadina 10mg", units: 650, revenue: 18200 },
  ];

  const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"];

  // ============================================================
  // 🧾 GENERATE PDF
  // ============================================================
  const exportPDF = async () => {
    if (!dateFrom || !dateTo) {
      alert("Debe seleccionar un rango de fechas");
      return;
    }

    setDownloading(true);

    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateFrom,
          dateTo,
          reportType,
          role: userRole,
        }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Reporte-${reportType}.pdf`;
      a.click();
    } catch (err) {
      alert("Error generando reporte");
    } finally {
      setDownloading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">

      {/* FILTROS SUPERIORES */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Desde</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Hasta</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={() => setShowData(true)}
              disabled={!dateFrom || !dateTo}
            >
              Mostrar Datos
            </Button>
          </div>
        </div>
      </Card>

      {/* CONTENIDO MOSTRADO */}
      {showData && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="h-4 w-4" />
              Inventario
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="gap-2">
              <Building2 className="h-4 w-4" />
              Proveedores
            </TabsTrigger>
            <TabsTrigger value="sales" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Ventas
            </TabsTrigger>
          </TabsList>

          {/* ============================================================
              INVENTARIO
            ============================================================ */}
          <TabsContent value="inventory" className="space-y-4">

            <div className="mt-4 flex justify-end">
              <Button className="gap-2" disabled={downloading} onClick={exportPDF}>
                <Download className="w-4 h-4" />
                {downloading ? "Generando..." : "Generar Informe PDF"}
              </Button>
            </div>

            {/* TARJETAS DE ESTADÍSTICAS */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Total Productos</CardTitle>
                  <Package className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">8,432</div>
                  <p className="text-xs text-muted-foreground">En stock actual</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Valor Total</CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">Bs.284,560</div>
                  <p className="text-xs text-muted-foreground">Valoración inventario</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Stock Bajo</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-orange-600">5</div>
                  <p className="text-xs text-muted-foreground">Requiere atención</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Rotación</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">12.5x</div>
                  <p className="text-xs text-muted-foreground">Veces por año</p>
                </CardContent>
              </Card>
            </div>

            {/* GRÁFICA INVENTARIO */}
            <Card>
              <CardHeader>
                <CardTitle>Stock por Categoría</CardTitle>
                <CardDescription>Distribución actual</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cantidad" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* TABLA DE INVENTARIO */}
            <Card>
              <CardHeader>
                <CardTitle>Detalle de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Stock Min.</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.categoria}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.minStock || "-"}</TableCell>
                        <TableCell>
                          <Badge>{item.status || "—"}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============================================================
              PROVEEDORES
            ============================================================ */}
          <TabsContent value="suppliers" className="space-y-4">

            <div className="mt-4 flex justify-end">
              <Button className="gap-2" disabled={downloading} onClick={exportPDF}>
                <Download className="w-4 h-4" />
                {downloading ? "Generando..." : "Generar Informe PDF"}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row justify-between pb-2">
                  <CardTitle className="text-sm">Proveedores Activos</CardTitle>
                  <Building2 className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">45</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row justify-between pb-2">
                  <CardTitle className="text-sm">Pedidos</CardTitle>
                  <ShoppingCart className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">78</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row justify-between pb-2">
                  <CardTitle className="text-sm">Monto Total</CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">Bs. 254,790</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row justify-between pb-2">
                  <CardTitle className="text-sm">Tiempo Promedio</CardTitle>
                  <TrendingDown className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">3.2 días</div>
                </CardContent>
              </Card>
            </div>

            {/* GRÁFICA PROVEEDORES */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento</CardTitle>
                <CardDescription>Comparativa mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={supplierPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="central" stroke="#f97316" />
                    <Line type="monotone" dataKey="medica" stroke="#fb923c" />
                    <Line type="monotone" dataKey="unidos" stroke="#fdba74" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* TABLA PROVEEDORES */}
            <Card>
              <CardHeader>
                <CardTitle>Detalle de Proveedores</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Calificación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliersData.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.orders}</TableCell>
                        <TableCell>Bs.{s.total}</TableCell>
                        <TableCell>
                          <Badge>{s.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{s.rating}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============================================================
              VENTAS
            ============================================================ */}
          <TabsContent value="sales" className="space-y-4">

            <div className="mt-4 flex justify-end">
              <Button className="gap-2" disabled={downloading} onClick={exportPDF}>
                <Download className="w-4 h-4" />
                {downloading ? "Generando..." : "Generar Informe PDF"}
              </Button>
            </div>

            {/* TARJETAS */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row justify-between pb-2">
                  <CardTitle className="text-sm">Ventas Mes</CardTitle>
                  <ShoppingCart className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">Bs. 132,450</div>
                  <p className="text-xs text-green-600">+5.2%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row justify-between pb-2">
                  <CardTitle className="text-sm">Transacciones</CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">356</div>
                  <p className="text-xs text-green-600">+6.5%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row justify-between pb-2">
                  <CardTitle className="text-sm">Ticket Promedio</CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">Bs.372.05</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row justify-between pb-2">
                  <CardTitle className="text-sm">Crecimiento</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600">+18%</div>
                </CardContent>
              </Card>
            </div>

            {/* GRÁFICAS */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia</CardTitle>
                  <CardDescription>Evolución mensual</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="ventas" stroke="#f97316" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={salesByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {salesByCategory.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* TABLA TOP PRODUCTOS */}
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Unidades</TableHead>
                      <TableHead>Ingresos</TableHead>
                      <TableHead>Participación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((p, index) => (
                      <TableRow key={p.product}>
                        <TableCell>
                          <Badge variant="outline">#{index + 1}</Badge> {p.product}
                        </TableCell>
                        <TableCell>{p.units}</TableCell>
                        <TableCell>Bs.{p.revenue}</TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(p.revenue / 50000) * 100}%` }}
                            ></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      )}
    </div>
  );
};

export default Reports;
