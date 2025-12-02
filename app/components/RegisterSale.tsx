"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Definimos el ID especial para clientes de mostrador (sin cuenta)
const CLIENTE_MOSTRADOR_ID = "0"; 

interface Product {
  id: string;
  name: string;
  price: number;
}

// Interfaz actualizada con tipos numéricos correctos
interface SaleForm {
  productoId: string;
  clienteId: string;
  usuarioId: string;
  total: number;     // Ahora es number
  cantidad: number;  // Ahora es number
  fecha: string;
  pago: string;
  productoNombre?: string; // Opcional, útil para la UI
}

const RegisterSale: React.FC = () => {
  const [form, setForm] = useState<SaleForm>({
    productoId: "",
    clienteId: CLIENTE_MOSTRADOR_ID, // ID fijo por defecto
    usuarioId: "3", // ID del cajero/admin actual
    total: 0,
    cantidad: 1,
    fecha: new Date().toISOString(),
    pago: "efectivo"
  });

  // Idealmente esto vendría de tu apiService.getProductos()
  const availableProducts: Product[] = [
    { id: "1", name: "Paracetamol 500mg", price: 25.5 },
    { id: "2", name: "Ibuprofeno 400mg", price: 35 },
    { id: "3", name: "Vitamina C 1000mg", price: 45 },
    { id: "4", name: "Omeprazol 20mg", price: 55 },
    { id: "5", name: "Loratadina 10mg", price: 28 },
    { id: "6", name: "Metformina 850mg", price: 45 },
    { id: "7", name: "Aspirina 100mg", price: 18 },
    { id: "8", name: "Amoxicilina 500mg", price: 85 }
  ];

  const handleProductSelect = (productId: string) => {
    const product = availableProducts.find(p => p.id === productId);
    if (product) {
      setForm(prev => ({
        ...prev,
        productoId: product.id,
        productoNombre: product.name,
        // Calculamos el total usando números reales
        total: Number((product.price * prev.cantidad).toFixed(2))
      }));
    }
  };

  const handleCantidadChange = (cantidadInput: string) => {
    // Aseguramos que sea al menos 1
    const nuevaCantidad = parseInt(cantidadInput) || 0;
    
    setForm(prev => {
      const product = availableProducts.find(p => p.id === prev.productoId);
      const nuevoTotal = product ? product.price * nuevaCantidad : 0;
      
      return { 
        ...prev, 
        cantidad: nuevaCantidad, 
        total: Number(nuevoTotal.toFixed(2)) // Redondear a 2 decimales para evitar 10.000000001
      };
    });
  };

  const handleSubmit = async () => {
    if (!form.productoId || form.cantidad <= 0) {
      alert("Por favor selecciona un producto y una cantidad válida");
      return;
    }

    // Preparamos el payload asegurando tipos numéricos
    const payload = {
      ...form,
      clienteId: CLIENTE_MOSTRADOR_ID, // Forzamos el ID de cliente de paso
      total: Number(form.total),       // Aseguramos envío como número
      cantidad: Number(form.cantidad), // Aseguramos envío como número
      fecha: new Date().toISOString()
    };

    console.log("Enviando venta:", payload);

    try {
      const res = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Error al registrar la venta");

      const data = await res.json();
      console.log("Venta registrada:", data);
      
      alert(`Venta registrada correctamente.\nTotal: Bs. ${form.total}`);

      // Resetear formulario
      setForm({
        productoId: "",
        clienteId: CLIENTE_MOSTRADOR_ID,
        usuarioId: "3",
        total: 0,
        cantidad: 1,
        fecha: new Date().toISOString(),
        pago: "efectivo"
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar la venta");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Venta de Mostrador</CardTitle>
        <CardDescription>Venta rápida para clientes sin cuenta</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        
        {/* Campo de Cliente eliminado visualmente porque es fijo */}
        
        <div className="grid gap-2">
          <Label htmlFor="productoId">Producto</Label>
          <Select value={form.productoId} onValueChange={handleProductSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un producto" />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - Bs. {product.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input
              id="cantidad"
              type="number"
              min="1"
              value={form.cantidad}
              onChange={e => handleCantidadChange(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="total">Total a cobrar (Bs.)</Label>
            <div className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                {form.total > 0 ? form.total.toFixed(2) : "0.00"}
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="pago">Método de Pago</Label>
          <Select value={form.pago} onValueChange={value => setForm(prev => ({ ...prev, pago: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efectivo">Efectivo</SelectItem>
              <SelectItem value="tarjeta">Tarjeta</SelectItem>
              <SelectItem value="transferencia">Transferencia QR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600">
            Confirmar Venta (Bs. {form.total.toFixed(2)})
        </Button>
      </CardContent>
    </Card>
  );
};

export default RegisterSale;