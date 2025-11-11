"use client";
import { useState, useEffect } from "react";
import { Home, Grid3x3, Search, Settings, BookmarkCheck } from "lucide-react";
import HomeView from "../components/HomeView";
import CategoriesView from "../components/CategoriesView";
import SearchView from "../components/SearchView";
import SettingsView from "../components/SettingsView";
import ProductDetail from "../components/ProductDetail";
import MyReservations from "../components/MyReservations";
import { Badge } from "../components/ui/badge";
import { apiService } from "@/lib/api";
import { Producto, Sucursal, Product, Reservation } from "@/types/reservas";

const ClientPage = () => {
  const [activeView, setActiveView] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservations, setShowReservations] = useState(false);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Convertir Producto API a Product para el cliente
  const convertProductoToProduct = (producto: Producto): Product => ({
    id: producto.id.toString(),
    name: producto.name,
    category: producto.categoria,
    price: parseFloat(producto.precio),
    image: producto.imagen,
    stock: parseInt(producto.stock),
    requiresPrescription: producto.recetaRequerida === "Si",
    description: producto.descripcion,
    activeIngredient: producto.descripcion.split('.')[0]
  });

  // Convertir Reserva API a Reservation para el cliente
  const convertReservaToReservation = (reserva: any, producto: Producto): Reservation => {
    const reservationDate = new Date(reserva.createdAt);
    const expiryDate = new Date(reservationDate.getTime() + 24 * 60 * 60 * 1000);

    return {
      id: reserva.id,
      product: convertProductoToProduct(producto),
      quantity: parseInt(reserva.cantidad),
      reservationDate: reserva.createdAt,
      expiryDate: expiryDate.toISOString(),
      status: reserva.estado === 'pendiente' ? 'active' : 
              reserva.estado === 'completada' ? 'collected' : 'expired',
      pickupLocation: reserva.sucursalNombre || "Sucursal no especificada"
    };
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Cargar información del usuario desde sessionStorage
        const userData = sessionStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }

        // Cargar sucursales
        const sucursalesData = await apiService.getSucursales();
        const sucursalesActivas = sucursalesData.filter(s => s.estado === "Activo");
        setSucursales(sucursalesActivas);

        // Cargar reservas del cliente
        const [reservasData, productosData] = await Promise.all([
          apiService.getReservas(),
          apiService.getProductos()
        ]);

        // Convertir reservas al formato del cliente
        const clienteReservations = reservasData.map(reserva => {
          const producto = productosData.find(p => p.id === reserva.productoId);
          return producto ? convertReservaToReservation(reserva, producto) : null;
        }).filter(Boolean) as Reservation[];

        setReservations(clienteReservations);
      } catch (error) {
        console.error("Error loading initial data", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleReserve = async (product: Product, quantity: number, pickupLocation: string, sucursalId: string) => {
    try {
      const sucursal = sucursales.find(s => s.id === sucursalId);
      if (!sucursal) {
        alert("Error: No se encontró la sucursal seleccionada");
        return;
      }

      // Crear reserva en la API
      const reservaData = {
        productoId: product.id.toString(),
        fecha: new Date().toISOString(),
        cantidad: quantity.toString(),
        estado: 'pendiente' as const,
        createdAt: new Date().toISOString(),
        sucursalId: sucursalId,
        sucursalNombre: sucursal.nombre,
        clienteId: user?.pk_ct?.toString() || '1',
        clienteNombre: user?.nm_ct || 'Cliente Demo'
      };

      await apiService.createReserva(reservaData);
      
      // Recargar reservas para mostrar la nueva
      const [reservasData, productosData] = await Promise.all([
        apiService.getReservas(),
        apiService.getProductos()
      ]);

      const updatedReservations = reservasData.map(reserva => {
        const producto = productosData.find(p => p.id === reserva.productoId);
        return producto ? convertReservaToReservation(reserva, producto) : null;
      }).filter(Boolean) as Reservation[];

      setReservations(updatedReservations);
      
      alert("¡Reserva creada exitosamente!");
    } catch (error) {
      console.error("Error creating reservation", error);
      alert("Error al crear la reserva");
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await apiService.updateReserva(reservationId, {
        estado: 'cancelada'
      });
      
      // Recargar reservas
      const [reservasData, productosData] = await Promise.all([
        apiService.getReservas(),
        apiService.getProductos()
      ]);

      const updatedReservations = reservasData.map(reserva => {
        const producto = productosData.find(p => p.id === reserva.productoId);
        return producto ? convertReservaToReservation(reserva, producto) : null;
      }).filter(Boolean) as Reservation[];

      setReservations(updatedReservations);
    } catch (error) {
      console.error("Error canceling reservation", error);
      alert("Error al cancelar la reserva");
    }
  };

  const activeReservationsCount = reservations.filter(r => r.status === "active").length;

  const renderView = () => {
    if (showReservations) {
      return (
        <MyReservations
          onClose={() => setShowReservations(false)}
          onCancel={handleCancelReservation}
        />
      );
    }

    if (selectedProduct) {
      return (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onReserve={handleReserve}
        />
      );
    }

    switch (activeView) {
      case "home":
        return <HomeView onSelectProduct={setSelectedProduct} />;
      case "categories":
        return <CategoriesView onSelectProduct={setSelectedProduct} />;
      case "search":
        return <SearchView onSelectProduct={setSelectedProduct} />;
      case "settings":
        return <SettingsView />;
      default:
        return <HomeView onSelectProduct={setSelectedProduct} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-lg p-1.5">
            <div className="w-6 h-6 bg-primary rounded"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold">CATEFARM</h1>
            {user && (
              <p className="text-xs opacity-80">Hola, {user.nm_ct || user.nc_ct}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowReservations(true)}
          className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <BookmarkCheck className="h-6 w-6" />
          {activeReservationsCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-white text-primary">
              {activeReservationsCount}
            </Badge>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-2 py-2 shadow-lg">
        <div className="flex justify-around items-center">
          <button
            onClick={() => {
              setActiveView("home");
              setSelectedProduct(null);
              setShowReservations(false);
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeView === "home" && !selectedProduct && !showReservations
                ? "text-primary bg-orange-50"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Inicio</span>
          </button>

          <button
            onClick={() => {
              setActiveView("categories");
              setSelectedProduct(null);
              setShowReservations(false);
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeView === "categories" && !selectedProduct && !showReservations
                ? "text-primary bg-orange-50"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            <Grid3x3 className="h-5 w-5" />
            <span className="text-xs">Categorías</span>
          </button>

          <button
            onClick={() => {
              setActiveView("search");
              setSelectedProduct(null);
              setShowReservations(false);
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeView === "search" && !selectedProduct && !showReservations
                ? "text-primary bg-orange-50"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Buscar</span>
          </button>

          <button
            onClick={() => {
              setActiveView("settings");
              setSelectedProduct(null);
              setShowReservations(false);
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeView === "settings" && !selectedProduct && !showReservations
                ? "text-primary bg-orange-50"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Configuración</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ClientPage;