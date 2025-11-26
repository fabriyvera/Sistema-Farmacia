"use client";
import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { WelcomeBanner } from "./components/WelcomeBanner";
import { CategoryCard } from "./components/CategoryCard";
import { ProductListClient } from "./components/ProductListClient";
import { CartSheet } from "./components/CartSheet";
import { ProductDetail } from "./components/ProductDetail";
import { Footer } from "./components/Footer";
import { ReservationStatus } from "./components/ReservationStatus";
import { Producto, CartItem, Sucursal, Reserva } from "@/types/reservas";
import { useRouter } from "next/navigation"; // Importa useRouter

const categories = [
  { id: 1, name: "Medicamentos", icon: "/drug_4136031.png", itemCount: 0 },
  { id: 2, name: "Suplementos", icon: "/protein_7924058.png", itemCount: 0 },
  { id: 3, name: "Antibióticos", icon: "/pills_6004270.png", itemCount: 0 },
  { id: 4, name: "Higiene", icon: "/toiletries_16892094.png", itemCount: 0 },
  { id: 5, name: "Equipos médicos", icon: "/plaster_7256425.png", itemCount: 0 },
  { id: 6, name: "Cuidado Personal", icon: "/body-oil_1807374.png", itemCount: 0 },
];

export default function App() {
  const router = useRouter(); // Inicializa el router
  const [products, setProducts] = useState<Producto[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
  
  // Estados para filtros y búsqueda
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [productsRes, sucursalesRes, reservasRes] = await Promise.all([
          fetch('https://690a052a1a446bb9cc2104c7.mockapi.io/Productos'),
          fetch('https://690a052a1a446bb9cc2104c7.mockapi.io/Sucursales'),
          fetch('https://690a052a1a446bb9cc2104c7.mockapi.io/Reservas')
        ]);

        const productsData: Producto[] = await productsRes.json();
        const sucursalesData: Sucursal[] = await sucursalesRes.json();
        const reservasData: Reserva[] = await reservasRes.json();

        setProducts(productsData);
        setSucursales(sucursalesData);
        setReservas(reservasData);

        // Set default sucursal (first operational one)
        const operationalSucursal = sucursalesData.find((s: Sucursal) => s.estado === "Operativa");
        setSelectedSucursal(operationalSucursal || sucursalesData[0]);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Verificar autenticación
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const userStr = sessionStorage.getItem('user');
      const userType = sessionStorage.getItem('userType');
      
      if (userStr && userType) {
        const user = JSON.parse(userStr);
        const userData = {
          ...user,
          userType: userType as 'admin' | 'client'
        };
        setUserData(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setUserData(null);
    }
  };

  // 🔹 MODIFICADO: Función para manejar agregar al carrito con verificación de autenticación
  const handleAddToCart = (productId: string) => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      // Guardar el producto que intentó agregar para después del login
      sessionStorage.setItem('pendingProduct', productId);
      // Redirigir a la página de login
      router.push('/login');
      return;
    }

    // Si está autenticado, proceder a agregar al carrito
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.precio.replace('BS ', '')),
      quantity: 1,
      image: product.imagen,
      stock: parseInt(product.stock, 10),
      descripcion: product.descripcion,
      categoria: product.categoria,
      estado: product.estado
    };

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, cartItem];
    });
    setIsCartOpen(true);
  };

  // 🔹 NUEVO: Función para manejar productos pendientes después del login
  useEffect(() => {
    const handlePendingProduct = () => {
      if (isAuthenticated) {
        const pendingProductId = sessionStorage.getItem('pendingProduct');
        if (pendingProductId) {
          // Agregar el producto pendiente al carrito
          handleAddToCart(pendingProductId);
          // Limpiar el producto pendiente
          sessionStorage.removeItem('pendingProduct');
        }
      }
    };

    handlePendingProduct();
  }, [isAuthenticated]);

  // Resto de las funciones permanecen igual...
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleSucursalChange = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal);
  };

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
      setSearchTerm("");
    } else {
      setSelectedCategory(categoryName);
      setSearchTerm("");
    }
    setShowAllProducts(false);
  };

  const handleShowMore = () => {
    setShowAllProducts(true);
  };

  const handleProductClick = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) setSelectedProduct(product);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserData(null);
    window.location.href = '/';
  };

  // Función para manejar la búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      setSelectedCategory(null);
    }
  };

  // Filtrar productos según búsqueda y categoría
  const getFilteredProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.categoria.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.descripcion.toLowerCase().includes(term) ||
        product.categoria.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Update category counts based on actual products
  const updatedCategories = categories.map(category => {
    const count = products.filter(product => 
      product.categoria.toLowerCase() === category.name.toLowerCase()
    ).length;
    return { ...category, itemCount: count };
  });

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <>
        <Header 
          onCartClick={() => setIsCartOpen(true)} 
          cartItemsCount={totalCartItems}
          selectedSucursal={selectedSucursal}
          sucursales={sucursales}
          onSucursalChange={handleSucursalChange}
          onSearch={handleSearch}
          isAuthenticated={isAuthenticated}
          userData={userData}
          onLogout={handleLogout}
        />
        <ProductDetail
          product={selectedProduct}
          onAddToCart={handleAddToCart} // 🔹 Se pasa la función modificada
          onBack={() => setSelectedProduct(null)}
        />
        <CartSheet
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          selectedSucursal={selectedSucursal}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onCartClick={() => setIsCartOpen(true)} 
        cartItemsCount={totalCartItems}
        selectedSucursal={selectedSucursal}
        sucursales={sucursales}
        onSucursalChange={handleSucursalChange}
        onSearch={handleSearch}
        isAuthenticated={isAuthenticated}
        userData={userData}
        onLogout={handleLogout}
      />
      <WelcomeBanner />

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Categories Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-gray-800">Categorías</h2>
            {(selectedCategory || searchTerm) && (
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchTerm("");
                }}
                className="text-orange-600 hover:text-orange-700 transition-colors font-medium"
              >
                Mostrar todos
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {updatedCategories.map(category => (
              <CategoryCard
                key={category.id}
                name={category.name}
                icon={category.icon}
                itemCount={category.itemCount}
                isActive={selectedCategory === category.name}
                onClick={() => handleCategoryClick(category.name)}
              />
            ))}
          </div>
        </section>

        {/* Products Section */}
        <ProductListClient
          products={filteredProducts}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          onAddToCart={handleAddToCart} // 🔹 Se pasa la función modificada
          onProductClick={handleProductClick}
          showAll={showAllProducts}
          onShowMore={handleShowMore}
        />

        {/* Reservation Status Section - Solo mostrar si está autenticado como cliente */}
        {isAuthenticated && userData?.userType === 'client' && (
          <ReservationStatus 
            reservations={reservas} 
            products={products} 
          />
        )}

        {/* Help Section */}
        <div className="fixed bottom-4 right-4 z-40">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg transition-colors">
            ¿Necesitas ayuda?
          </button>
        </div>
      </main>

      <Footer />

      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        selectedSucursal={selectedSucursal}
      />
    </div>
  );
}