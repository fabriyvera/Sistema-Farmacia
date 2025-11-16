"use client";
import { useState, useEffect } from "react";
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
  LogOut,
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
  const [user, setUser] = useState<any>(null);
  const [userInitials, setUserInitials] = useState("");

  // Obtener información del usuario al cargar el componente
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      
      // Generar iniciales del usuario
      if (userObj.nombres && userObj.apPaterno) {
        const firstInitial = userObj.nombres.charAt(0);
        const lastInitial = userObj.apPaterno.charAt(0);
        setUserInitials((firstInitial + lastInitial).toUpperCase());
      } else if (userObj.nombreCompleto) {
        // Para clientes que usen nombreCompleto
        const names = userObj.nombreCompleto.split(" ");
        const initials = names.map((name: string) => name.charAt(0)).join("").toUpperCase();
        setUserInitials(initials.substring(0, 2));
      } else {
        setUserInitials("AD");
      }
    }
  }, []);

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
  };

  const handleProductsSubmenuClick = (viewId: string) => {
    setActiveView(viewId);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar sessionStorage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userType");
    
    // Redirigir a la página principal
    window.location.href = "/";
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
      case "product-list":
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
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto bg-background">
          {/* Header con información del usuario */}
          <div className="border-b border-border bg-white">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeView === "sales" && "Ventas"}
                  {activeView === "dashboard" && "Panel de Control"}
                  {activeView === "employee-list" && "Lista de Empleados"}
                  {activeView === "register-employee" && "Registrar Empleado"}
                  {activeView === "modify-employee" && "Modificar Empleado"}
                  {activeView === "product-list" && "Lista de Productos"}
                  {activeView === "register-product" && "Registrar Producto"}
                  {activeView === "edit-product" && "Editar Producto"}
                  {activeView === "suppliers" && "Proveedores"}
                  {activeView === "customers" && "Clientes"}
                  {activeView === "reports" && "Reportes"}
                  {activeView === "branch-management" && "Gestión de Sucursales"}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Sistema de gestión CATEFARM
                </p>
              </div>
              
              {/* Información del usuario */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  {userInitials}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {user?.nombres ? `${user.nombres} ${user.apPaterno}` : user?.nombreCompleto || "Administrador"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.rol === 0 ? "Administrador" : user?.userType === "admin" ? "Administrador" : "Usuario"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="container mx-auto p-6 max-w-7xl">
            {renderView()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default App;