"use client";
import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "../components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  UserCircle,
  Settings,
  Pill,
  FileText,
  ShoppingCart,
} from "lucide-react";
import Dashboard from "../components/Dashboard";
import Suppliers from "../components/Suppliers";
import Staff from "../components/Staff";
import Inventory from "../components/Inventory";
import Customers from "../components/Customers";
import Reports from "../components/Reports";
import Sales from "../components/Sales";
import BranchManagement from "../components/BranchManagement";

const App = () => {
  const [activeView, setActiveView] = useState("sales");

  const menuItems = [
    {
      id: "sales",      
      title: "Ventas",
      icon: ShoppingCart,
    },
    {
      id: "dashboard",
      title: "Panel de Control",
      icon: LayoutDashboard,
    },
    {
      id: "inventory",
      title: "Inventario",
      icon: Package,
    },
    {
      id: "suppliers",
      title: "Proveedores",
      icon: Building2,
    },
    {
      id: "staff",
      title: "Personal",
      icon: Users,
    },
    {
      id: "customers",
      title: "Clientes",
      icon: UserCircle,
    },
    {
      id: "reports",
      title: "Reportes",
      icon: FileText,
    },
    {
      id: "branch-management",
      title: "Gestión de Sucursales",
      icon: Building2,
    }
    
  ];

  const renderView = () => {
    switch (activeView) {
      case "sales":
        return <Sales/>;
      case "dashboard":
        return <Dashboard />;
      case "suppliers":
        return <Suppliers />;
      case "staff":
        return <Staff />;
      case "inventory":
        return <Inventory />;
      case "customers":
        return <Customers />;
      case "reports":
        return <Reports/>;
      case "branch-management":
        return <BranchManagement/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-lg p-2">
                <Pill className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg">CATEFARM</h2>
                <p className="text-xs text-sidebar-foreground/70">
                  Sistema de Gestión
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveView(item.id)}
                          isActive={activeView === item.id}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Configuración</span>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto p-6 max-w-7xl">
            {renderView()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default App;
