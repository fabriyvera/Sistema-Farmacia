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
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Dashboard from "../components/Dashboard";
import Suppliers from "../components/Suppliers";
import ProductList from "../components/ProductList";
import RegisterProduct from "../components/RegisterProduct";
import EditProduct from "../components/EditProduct";
import Customers from "../components/Customers";
import Reports from "../components/Reports";
import Sales from "../components/Sales";
import BranchManagement from "../components/BranchManagement";
import EmployeeList from "../components/EmployeeList";
import RegisterEmployee from "../components/RegisterEmployee";
import ModifyEmployee from "../components/ModifyEmployee";

const App = () => {
  const [activeView, setActiveView] = useState("sales");
  const [staffSubmenuOpen, setStaffSubmenuOpen] = useState(false);
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(false);

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
      id: "products", 
      title: "Productos",
      icon: Package,
      hasSubmenu: true,
    },
    {
      id: "suppliers",
      title: "Proveedores",
      icon: Building2,
    },
    {
      id: "staff",
      title: "Empleados",
      icon: Users,
      hasSubmenu: true,
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

  const staffSubmenuItems = [
    {
      id: "employee-list",
      title: "Lista de Empleados",
      icon: Users,
    },
    {
      id: "register-employee",
      title: "Registrar Empleado",
      icon: Users,
    },
    {
      id: "modify-employee",
      title: "Modificar Empleado",
      icon: Users,
    }
  ];

  const productsSubmenuItems = [
    {
      id: "product-list",
      title: "Lista de Productos",
      icon: Package,
    },
    {
      id: "register-product",
      title: "Registrar Producto",
      icon: Package,
    },
    {
      id: "edit-product",
      title: "Editar Producto",
      icon: Package,
    }
  ];


  const handleStaffClick = () => {
    setStaffSubmenuOpen(!staffSubmenuOpen);
  };

  const handleStaffSubmenuClick = (viewId: string) => {
    setActiveView(viewId);
  };

  const handleProductsClick = () => {
    setProductsSubmenuOpen(!productsSubmenuOpen);
  }
  const handleProductsSubmenuClick = (viewId: string) => {
    setActiveView(viewId);
  };


  const renderView = () => {
    switch (activeView) {
      case "sales":
        return <Sales/>;
      case "dashboard":
        return <Dashboard />;
      case "suppliers":
        return <Suppliers />;
      case "employee-list":
        return <EmployeeList />;
      case "register-employee":
        return <RegisterEmployee />;
      case "modify-employee":
        return <ModifyEmployee />;
      case "product-list": // Cambiado de "inventory" a "products"
        return <ProductList />;
      case "register-product":
        return <RegisterProduct onBack={function (): void {
          throw new Error("Function not implemented.");
        } } />;
      case "edit-product":
        return <EditProduct />;
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
                    if (item.id === "staff") {
                      return (
                        <SidebarMenuItem key={item.id}>
                          <div className="space-y-1">
                            <SidebarMenuButton
                              onClick={handleStaffClick}
                              isActive={activeView.startsWith("employee")}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.title}</span>
                              {staffSubmenuOpen ? (
                                <ChevronDown className="h-4 w-4 ml-auto" />
                              ) : (
                                <ChevronRight className="h-4 w-4 ml-auto" />
                              )}
                            </SidebarMenuButton>
                            
                            {staffSubmenuOpen && (
                              <div className="ml-4 space-y-1 border-l border-sidebar-border pl-2">
                                {staffSubmenuItems.map((subItem) => {
                                  const SubIcon = subItem.icon;
                                  return (
                                    <SidebarMenuButton
                                      key={subItem.id}
                                      onClick={() => handleStaffSubmenuClick(subItem.id)}
                                      isActive={activeView === subItem.id}
                                      className="text-sm"
                                    >
                                      <SubIcon className="h-3 w-3" />
                                      <span>{subItem.title}</span>
                                    </SidebarMenuButton>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </SidebarMenuItem>
                      );
                    }

                    if (item.id === "products") {
                      return (
                        <SidebarMenuItem key={item.id}>
                          <div className="space-y-1">
                            <SidebarMenuButton
                              onClick={handleProductsClick}
                              isActive={activeView.startsWith("product")}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.title}</span>
                              {productsSubmenuOpen ? (
                                <ChevronDown className="h-4 w-4 ml-auto" />
                              ) : (
                                <ChevronRight className="h-4 w-4 ml-auto" />
                              )}
                            </SidebarMenuButton>

                            {productsSubmenuOpen && (
                              <div className="ml-4 space-y-1 border-l border-sidebar-border pl-2">
                                {productsSubmenuItems.map((subItem) => {
                                  const SubIcon = subItem.icon;
                                  return (
                                    <SidebarMenuButton
                                      key={subItem.id}
                                      onClick={() => handleProductsSubmenuClick(subItem.id)}
                                      isActive={activeView === subItem.id}
                                      className="text-sm"
                                    >
                                      <SubIcon className="h-3 w-3" />
                                      <span>{subItem.title}</span>
                                    </SidebarMenuButton>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </SidebarMenuItem>
                      );
                    }





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