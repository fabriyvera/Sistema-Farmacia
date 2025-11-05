import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { ShoppingCart, Plus, Search, DollarSign, Calendar, User, Package, Trash2, Wallet } from "lucide-react";

interface Sale {
  id: string;
  date: string;
  customerName: string;
  products: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
  status: string;
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: "VEN-001",
      date: "2025-11-04 10:30",
      customerName: "María González",
      products: [
        { name: "Paracetamol 500mg", quantity: 2, price: 25.50 },
        { name: "Vitamina C 1000mg", quantity: 1, price: 45.00 }
      ],
      total: 96.00,
      paymentMethod: "Efectivo",
      status: "Completada"
    },
    {
      id: "VEN-002",
      date: "2025-11-04 11:15",
      customerName: "Carlos Ramírez",
      products: [
        { name: "Ibuprofeno 400mg", quantity: 3, price: 35.00 }
      ],
      total: 105.00,
      paymentMethod: "Tarjeta",
      status: "Completada"
    },
    {
      id: "VEN-003",
      date: "2025-11-04 12:00",
      customerName: "Ana López",
      products: [
        { name: "Omeprazol 20mg", quantity: 1, price: 55.00 },
        { name: "Loratadina 10mg", quantity: 2, price: 28.00 }
      ],
      total: 111.00,
      paymentMethod: "Efectivo",
      status: "Completada"
    },
    {
      id: "VEN-004",
      date: "2025-11-04 14:30",
      customerName: "Juan Pérez",
      products: [
        { name: "Metformina 850mg", quantity: 1, price: 45.00 }
      ],
      total: 45.00,
      paymentMethod: "Transferencia",
      status: "Completada"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state for new sale
  const [newSale, setNewSale] = useState({
    customerName: "",
    paymentMethod: "Efectivo"
  });

  // Cart items for the current sale
  const [cartItems, setCartItems] = useState<Array<{ name: string; quantity: number; price: number }>>([]);

  // Temporary state for adding a product to cart
  const [tempProduct, setTempProduct] = useState({
    productName: "",
    quantity: "1",
    price: ""
  });

  const availableProducts = [
    { name: "Paracetamol 500mg", price: 25.50 },
    { name: "Ibuprofeno 400mg", price: 35.00 },
    { name: "Vitamina C 1000mg", price: 45.00 },
    { name: "Omeprazol 20mg", price: 55.00 },
    { name: "Loratadina 10mg", price: 28.00 },
    { name: "Metformina 850mg", price: 45.00 },
    { name: "Aspirina 100mg", price: 18.00 },
    { name: "Amoxicilina 500mg", price: 85.00 }
  ];

  const handleAddToCart = () => {
    if (!tempProduct.productName || !tempProduct.quantity || !tempProduct.price) {
      alert("Por favor selecciona un producto y especifica la cantidad");
      return;
    }

    const quantity = parseInt(tempProduct.quantity);
    const price = parseFloat(tempProduct.price);

    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.name === tempProduct.productName);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product exists
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      // Add new product to cart
      setCartItems([...cartItems, {
        name: tempProduct.productName,
        quantity: quantity,
        price: price
      }]);
    }

    // Reset temp product
    setTempProduct({
      productName: "",
      quantity: "1",
      price: ""
    });
  };

  const handleRemoveFromCart = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const handleAddSale = () => {
    if (!newSale.customerName || cartItems.length === 0) {
      alert("Por favor completa el nombre del cliente y agrega al menos un producto");
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const total = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    const sale: Sale = {
      id: `VEN-${String(sales.length + 1).padStart(3, '0')}`,
      date: formattedDate,
      customerName: newSale.customerName,
      products: cartItems,
      total: total,
      paymentMethod: newSale.paymentMethod,
      status: "Completada"
    };

    setSales([sale, ...sales]);
    setIsAddDialogOpen(false);
    setNewSale({
      customerName: "",
      paymentMethod: "Efectivo"
    });
    setCartItems([]);
    setTempProduct({
      productName: "",
      quantity: "1",
      price: ""
    });
  };

  const handleProductSelect = (productName: string) => {
    const product = availableProducts.find(p => p.name === productName);
    if (product) {
      setTempProduct({
        ...tempProduct,
        productName: productName,
        price: product.price.toString()
      });
    }
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const filteredSales = sales.filter(sale =>
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayTotal = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySalesCount = sales.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gestión de Ventas</h1>
          <p className="text-muted-foreground">
            Registra y administra las ventas realizadas
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Venta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Venta</DialogTitle>
              <DialogDescription>
                Completa los detalles de la venta y agrega los productos
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Customer Information */}
              <div className="grid gap-2">
                <Label htmlFor="customerName">Nombre del Cliente</Label>
                <Input
                  id="customerName"
                  placeholder="Ej: María González"
                  value={newSale.customerName}
                  onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                />
              </div>

              {/* Add Product Section */}
              <div className="border-t pt-4">
                <h3 className="mb-3">Agregar Productos</h3>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="product">Producto</Label>
                    <Select
                      value={tempProduct.productName}
                      onValueChange={handleProductSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts.map((product) => (
                          <SelectItem key={product.name} value={product.name}>
                            {product.name} - Bs.{product.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Cantidad</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={tempProduct.quantity}
                        onChange={(e) => setTempProduct({ ...tempProduct, quantity: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Precio Unitario</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={tempProduct.price}
                        onChange={(e) => setTempProduct({ ...tempProduct, price: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="gap-2"
                    onClick={handleAddToCart}
                  >
                    <Plus className="h-4 w-4" />
                    Agregar a la Venta
                  </Button>
                </div>
              </div>

              {/* Cart Items */}
              {cartItems.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="mb-3">Productos en la Venta</h3>
                  <div className="space-y-2">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x Bs. {item.price.toFixed(2)} = Bs.{(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromCart(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="grid gap-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select
                  value={newSale.paymentMethod}
                  onValueChange={(value) => setNewSale({ ...newSale, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total */}
              {cartItems.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-900">
                    <strong>Total a cobrar: </strong>
                    <span className="text-xl">Bs. {calculateCartTotal().toFixed(2)}</span>
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setCartItems([]);
                setTempProduct({ productName: "", quantity: "1", price: "" });
                setNewSale({ customerName: "", paymentMethod: "Efectivo" });
              }}>
                Cancelar
              </Button>
              <Button onClick={handleAddSale} disabled={cartItems.length === 0}>
                Registrar Venta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ventas de Hoy</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{todaySalesCount}</div>
            <p className="text-xs text-muted-foreground">
              Transacciones completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total de Hoy</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">Bs. {todayTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Ingresos del día
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ticket Promedio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              Bs.{todaySalesCount > 0 ? (todayTotal / todaySalesCount).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio por venta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registro de Ventas</CardTitle>
              <CardDescription>Lista de todas las ventas realizadas</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ventas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell className="text-sm">{sale.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {sale.customerName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {sale.products.map((product, index) => (
                        <div key={index} className="text-sm flex items-center gap-1">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          {product.name} x{product.quantity}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{sale.paymentMethod}</TableCell>
                  <TableCell className="text-primary">
                    Bs. {sale.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-500">
                      {sale.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
