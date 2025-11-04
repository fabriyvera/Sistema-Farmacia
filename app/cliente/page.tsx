"use client";

import { useState } from "react";
import { Home, Grid3x3, Search, Settings, BookmarkCheck } from "lucide-react";
import HomeView from "../components/HomeView";
import CategoriesView from "../components/CategoriesView";
import SearchView from "../components/SearchView";
import SettingsView from "../components/SettingsView";
import ProductDetail from "../components/ProductDetail";
import MyReservations from "../components/MyReservations";
import { Badge } from "../components/ui/badge";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  requiresPrescription: boolean;
  description: string;
  activeIngredient: string;
}

export interface Reservation {
  id: string;
  product: Product;
  quantity: number;
  reservationDate: string;
  expiryDate: string;
  status: "active" | "expired" | "collected";
  pickupLocation: string;
}

const App = () => {
  const [activeView, setActiveView] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservations, setShowReservations] = useState(false);

  const addReservation = (product: Product, quantity: number, pickupLocation: string) => {
    const now = new Date();
    const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas

    const newReservation: Reservation = {
      id: `RES-${Date.now()}`,
      product,
      quantity,
      reservationDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
      status: "active",
      pickupLocation
    };

    setReservations(prev => [newReservation, ...prev]);
  };

  const cancelReservation = (reservationId: string) => {
    setReservations(prev => prev.filter(res => res.id !== reservationId));
  };

  const activeReservationsCount = reservations.filter(r => r.status === "active").length;

  const renderView = () => {
    if (showReservations) {
      return (
        <MyReservations
          reservations={reservations}
          onClose={() => setShowReservations(false)}
          onCancel={cancelReservation}
        />
      );
    }

    if (selectedProduct) {
      return (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onReserve={addReservation}
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

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-lg p-1.5">
            <div className="w-6 h-6 bg-primary rounded"></div>
          </div>
          <h1 className="text-lg">CATEFARM</h1>
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

export default App;
