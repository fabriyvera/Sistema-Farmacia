"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ArrowLeft, BookmarkCheck, Plus, Minus, AlertCircle, Check, MapPin } from "lucide-react";
import { Product, Sucursal } from "@/types/reservas";
import { apiService } from "@/lib/api";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onReserve: (product: Product, quantity: number, pickupLocation: string, sucursalId: string) => void;
}

const ProductDetail = ({ product, onBack, onReserve }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReserveDialog, setShowReserveDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSucursales = async () => {
      try {
        const sucursalesData = await apiService.getSucursales();
        // Filtrar solo sucursales activas
        const sucursalesActivas = sucursalesData.filter(s => s.estado === "Activo");
        setSucursales(sucursalesActivas);
        if (sucursalesActivas.length > 0) {
          setSelectedLocation(sucursalesActivas[0].id);
        }
      } catch (error) {
        console.error("Error loading sucursales", error);
      }
    };

    loadSucursales();
  }, []);

  const handleReserve = async () => {
    setLoading(true);
    try {
      const sucursal = sucursales.find(s => s.id === selectedLocation);
      if (!sucursal) {
        alert("Error: No se encontró la sucursal seleccionada");
        return;
      }

      // Crear reserva en la API
      const reservaData = {
        productoId: product.id,
        fecha: new Date().toISOString(),
        cantidad: quantity.toString(),
        estado: 'pendiente' as const,
        createdAt: new Date().toISOString(),
        sucursalId: selectedLocation,
        sucursalNombre: sucursal.nombre,
        clienteId: '1', // En un sistema real, esto vendría del usuario logueado
        clienteNombre: 'Cliente Demo' // En un sistema real, esto vendría del usuario logueado
      };

      await apiService.createReserva(reservaData);
      
      // Llamar a la función del padre
      onReserve(product, quantity, sucursal.nombre, selectedLocation);
      setShowReserveDialog(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 2000);
      
    } catch (error) {
      console.error("Error creating reservation", error);
      alert("Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg">Detalle del Producto</h2>
      </div>

      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.requiresPrescription && (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive" className="text-sm">
              Requiere Receta Médica
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h1 className="text-xl mb-1">{product.name}</h1>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-2xl text-primary">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">por unidad</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Badge variant={product.stock > 50 ? "default" : "secondary"}>
              {product.stock > 50 ? "Disponible" : "Stock Limitado"}
            </Badge>
            <span className="text-muted-foreground">
              {product.stock} unidades disponibles
            </span>
          </div>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Descripción</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {product.description}
          </CardContent>
        </Card>

        {/* Active Ingredient */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Principio Activo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {product.activeIngredient}
          </CardContent>
        </Card>

        {/* Prescription Warning */}
        {product.requiresPrescription && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-red-900 mb-1">
                  Este medicamento requiere receta médica
                </p>
                <p className="text-red-700 text-xs">
                  Deberás presentar tu receta al momento de recoger el producto en farmacia
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quantity Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cantidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl text-primary">
                  ${(product.price * quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {showSuccess && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-900">
                ¡Reserva realizada exitosamente! Tienes 24 horas para recogerlo.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pb-4">
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => setShowReserveDialog(true)}
            disabled={product.stock === 0}
          >
            <BookmarkCheck className="h-5 w-5" />
            Reservar Producto
          </Button>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
          <p className="flex items-start gap-2">
            <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">Reserva válida por 24 horas</span>
          </p>
          <p className="flex items-start gap-2">
            <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">Retiro gratis en sucursal</span>
          </p>
          <p className="flex items-start gap-2">
            <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">Sin costo de reserva</span>
          </p>
        </div>
      </div>

      {/* Reserve Dialog */}
      <Dialog open={showReserveDialog} onOpenChange={setShowReserveDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Selecciona tu sucursal</DialogTitle>
            <DialogDescription>
              Elige dónde recogerás tu reserva. Tendrás 24 horas para retirarla.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup value={selectedLocation} onValueChange={setSelectedLocation}>
              <div className="space-y-3">
                {sucursales.map((sucursal) => (
                  <div key={sucursal.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={sucursal.id} id={sucursal.id} className="mt-1" />
                    <Label htmlFor={sucursal.id} className="flex-1 cursor-pointer">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm mb-1">{sucursal.nombre}</p>
                          <p className="text-xs text-muted-foreground">{sucursal.direccion}</p>
                          <p className="text-xs text-muted-foreground">{sucursal.telefono}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-2">
            <p className="text-sm text-orange-900">
              <strong>Resumen de tu reserva:</strong>
            </p>
            <p className="text-sm text-orange-800 mt-1">
              {quantity} x {product.name}
            </p>
            <p className="text-sm text-orange-800">
              Total: ${(product.price * quantity).toFixed(2)}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReserveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReserve} disabled={loading} className="gap-2">
              <BookmarkCheck className="h-4 w-4" />
              {loading ? "Creando reserva..." : "Confirmar Reserva"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;