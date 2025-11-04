"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
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
  const [activeTab, setActiveTab] = useState("inventory");

  // Inventory Report Data
  const inventoryData = [
    { name: "Paracetamol 500mg", category: "Analgésicos", stock: 450, minStock: 100, status: "Óptimo" },
    { name: "Ibuprofeno 400mg", category: "Antiinflamatorios", stock: 320, minStock: 80, status: "Óptimo" },
    { name: "Vitamina C 1000mg", category: "Vitaminas", stock: 500, minStock: 150, status: "Óptimo" },
    { name: "Omeprazol 20mg", category: "Antiulcerosos", stock: 45, minStock: 100, status: "Bajo" },
    { name: "Loratadina 10mg", category: "Antihistamínicos", stock: 32, minStock: 80, status: "Bajo" },
    { name: "Metformina 850mg", category: "Antidiabéticos", stock: 28, minStock: 60, status: "Crítico" },
    { name: "Aspirina 100mg", category: "Analgésicos", stock: 350, minStock: 100, status: "Óptimo" },
    { name: "Amoxicilina 500mg", category: "Antibióticos", stock: 15, minStock: 50, status: "Crítico" }
  ];

  const stockByCategory = [
    { category: "Analgésicos", cantidad: 800 },
    { category: "Vitaminas", cantidad: 500 },
    { category: "Antibióticos", cantidad: 180 },
    { category: "Antiinflamatorios", cantidad: 320 },
    { category: "Antiulcerosos", cantidad: 280 }
  ];

  // Suppliers Report Data
  const suppliersData = [
    { name: "Farmacéutica Central", orders: 25, total: 85420, status: "Activo", rating: "Excelente" },
    { name: "Distribuidora Medica", orders: 18, total: 62350, status: "Activo", rating: "Bueno" },
    { name: "Laboratorios Unidos", orders: 15, total: 48900, status: "Activo", rating: "Excelente" },
    { name: "Suministros Farmacéuticos", orders: 12, total: 35670, status: "Activo", rating: "Bueno" },
    { name: "MedPharm Distribución", orders: 8, total: 22450, status: "Activo", rating: "Regular" }
  ];

  const supplierPerformance = [
    { month: "Ene", central: 15000, medica: 12000, unidos: 10000 },
    { month: "Feb", central: 18000, medica: 14000, unidos: 11000 },
    { month: "Mar", central: 20000, medica: 15000, unidos: 12000 },
    { month: "Abr", central: 22000, medica: 16000, unidos: 13000 },
    { month: "May", central: 25000, medica: 18000, unidos: 15000 }
  ];

  // Sales Report Data
  const salesData = [
    { month: "Enero", ventas: 95420, cantidad: 245 },
    { month: "Febrero", ventas: 102350, cantidad: 268 },
    { month: "Marzo", ventas: 118900, cantidad: 312 },
    { month: "Abril", ventas: 125670, cantidad: 334 },
    { month: "Mayo", ventas: 132450, cantidad: 356 }
  ];

  const salesByCategory = [
    { name: "Analgésicos", value: 35 },
    { name: "Vitaminas", value: 25 },
    { name: "Antibióticos", value: 20 },
    { name: "Antiinflamatorios", value: 12 },
    { name: "Otros", value: 8 }
  ];

  const topProducts = [
    { product: "Paracetamol 500mg", units: 1250, revenue: 31875 },
    { product: "Ibuprofeno 400mg", units: 980, revenue: 34300 },
    { product: "Vitamina C 1000mg", units: 850, revenue: 38250 },
    { product: "Omeprazol 20mg", units: 720, revenue: 39600 },
    { product: "Loratadina 10mg", units: 650, revenue: 18200 }
  ];

  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

  const handleDownloadReport = (reportType: string) => {
    alert(`Descargando informe de ${reportType}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Informes y Reportes</h1>
        <p className="text-muted-foreground">
          Visualiza y analiza datos importantes del negocio
        </p>
      </div>

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

        {/* Inventory Report Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" className="gap-2" onClick={() => handleDownloadReport("Inventario")}>
              <Download className="h-4 w-4" />
              Descargar Informe
            </Button>
          </div>

          {/* Inventory Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">8,432</div>
                <p className="text-xs text-muted-foreground">En stock actual</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Valor Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">Bs.284,560</div>
                <p className="text-xs text-muted-foreground">Valoración del inventario</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Stock Bajo</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-orange-600">5</div>
                <p className="text-xs text-muted-foreground">Productos requieren atención</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Rotación</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">12.5x</div>
                <p className="text-xs text-muted-foreground">Veces por año</p>
              </CardContent>
            </Card>
          </div>

          {/* Stock by Category Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Stock por Categoría</CardTitle>
              <CardDescription>Distribución de productos en inventario</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#f97316" name="Unidades" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Inventory Detail Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Inventario</CardTitle>
              <CardDescription>Estado actual de productos en stock</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock Actual</TableHead>
                    <TableHead>Stock Mínimo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.minStock}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "Crítico" ? "destructive" :
                            item.status === "Bajo" ? "secondary" : "default"
                          }
                          className={item.status === "Óptimo" ? "bg-green-500" : ""}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Report Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" className="gap-2" onClick={() => handleDownloadReport("Proveedores")}>
              <Download className="h-4 w-4" />
              Descargar Informe
            </Button>
          </div>

          {/* Supplier Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Proveedores Activos</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">45</div>
                <p className="text-xs text-muted-foreground">Total registrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Pedidos Totales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">78</div>
                <p className="text-xs text-muted-foreground">En el último mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Monto Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">Bs. 254,790</div>
                <p className="text-xs text-muted-foreground">En compras este mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Tiempo Promedio</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">3.2 días</div>
                <p className="text-xs text-muted-foreground">Entrega promedio</p>
              </CardContent>
            </Card>
          </div>

          {/* Supplier Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Proveedores</CardTitle>
              <CardDescription>Comparativa de compras mensuales</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={supplierPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="central" stroke="#f97316" name="F. Central" />
                  <Line type="monotone" dataKey="medica" stroke="#fb923c" name="D. Medica" />
                  <Line type="monotone" dataKey="unidos" stroke="#fdba74" name="L. Unidos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Suppliers Detail Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Proveedores</CardTitle>
              <CardDescription>Resumen de actividad y rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Total Comprado</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Calificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliersData.map((supplier) => (
                    <TableRow key={supplier.name}>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.orders}</TableCell>
                      <TableCell className="text-primary">Bs.{supplier.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-500">
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            supplier.rating === "Excelente" ? "default" :
                            supplier.rating === "Bueno" ? "secondary" : "outline"
                          }
                          className={supplier.rating === "Excelente" ? "bg-green-500" : ""}
                        >
                          {supplier.rating}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Report Tab */}
        <TabsContent value="sales" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" className="gap-2" onClick={() => handleDownloadReport("Ventas")}>
              <Download className="h-4 w-4" />
              Descargar Informe
            </Button>
          </div>

          {/* Sales Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Ventas del Mes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">Bs. 132,450</div>
                <p className="text-xs text-green-600">+5.2% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Transacciones</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">356</div>
                <p className="text-xs text-green-600">+6.5% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Ticket Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">Bs.372.05</div>
                <p className="text-xs text-muted-foreground">Por transacción</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Crecimiento</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-green-600">+18%</div>
                <p className="text-xs text-muted-foreground">Últimos 5 meses</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Sales Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Ventas</CardTitle>
                <CardDescription>Evolución mensual de ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ventas" stroke="#f97316" name="Ventas (Bs.)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales by Category Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
                <CardDescription>Distribución porcentual de ventas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
              <CardDescription>Top 5 productos por unidades vendidas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Unidades Vendidas</TableHead>
                    <TableHead>Ingresos Generados</TableHead>
                    <TableHead>Participación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={product.product}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          {product.product}
                        </div>
                      </TableCell>
                      <TableCell>{product.units.toLocaleString()}</TableCell>
                      <TableCell className="text-primary">
                        Bs.{product.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(product.revenue / 50000) * 100}%` }}
                          />
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
    </div>
  );
};

export default Reports;
