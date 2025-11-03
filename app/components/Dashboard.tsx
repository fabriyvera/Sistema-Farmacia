"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Users, Package, Building2, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Clientes",
      value: "2,345",
      icon: Users,
      description: "+12% del mes anterior",
      trend: "up"
    },
    {
      title: "Productos en Stock",
      value: "8,432",
      icon: Package,
      description: "De 10,000 productos",
      trend: "neutral"
    },
    {
      title: "Proveedores Activos",
      value: "45",
      icon: Building2,
      description: "3 nuevos este mes",
      trend: "up"
    },
    {
      title: "Ventas del Mes",
      value: "$125,430",
      icon: ShoppingCart,
      description: "+8% del mes anterior",
      trend: "up"
    }
  ];

  const lowStockProducts = [
    { name: "Paracetamol 500mg", stock: 45, min: 100 },
    { name: "Ibuprofeno 400mg", stock: 32, min: 80 },
    { name: "Amoxicilina 500mg", stock: 28, min: 60 },
    { name: "Losartan 50mg", stock: 15, min: 50 },
    { name: "Metformina 850mg", stock: 38, min: 70 }
  ];

  const recentOrders = [
    { id: "ORD-001", supplier: "Farmacéutica Central", date: "2025-10-28", status: "Entregado" },
    { id: "ORD-002", supplier: "Distribuidora Medica", date: "2025-10-29", status: "En tránsito" },
    { id: "ORD-003", supplier: "Laboratorios Unidos", date: "2025-10-30", status: "Pendiente" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Panel de Control</h1>
        <p className="text-muted-foreground">
          Bienvenido al sistema CATEFARM - Gestión Integral de Farmacias
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Alertas de Inventario
            </CardTitle>
            <CardDescription>Productos con stock bajo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock mínimo: {product.min} unidades
                    </p>
                  </div>
                  <div className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                    {product.stock} unidades
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Pedidos Recientes
            </CardTitle>
            <CardDescription>Últimos pedidos a proveedores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      order.status === 'Entregado' ? 'bg-green-100 text-green-700' :
                      order.status === 'En tránsito' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
