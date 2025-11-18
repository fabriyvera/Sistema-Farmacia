"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface SaleForm {
  productoId: string;
  clienteId: string;
  usuarioId: string;
  total: string; // total a cobrar
  cantidad: string;
  fecha: string;
  pago: string;
}

const RegisterSale: React.FC = () => {
  const [form, setForm] = useState<SaleForm>({
    productoId: "",
    clienteId: "",
    usuarioId: "3",
    total: "",
    cantidad: "1",
    fecha: new Date().toISOString(),
    pago: "efectivo"
  });

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
      setForm({
        ...form,
        productoId: product.id,
        total: (product.price * parseInt(form.cantidad)).toString() // total a cobrar
      });
    }
  };

  const handleCantidadChange = (cantidad: string) => {
    setForm(prev => {
      const product = availableProducts.find(p => p.id === prev.productoId);
      const total = product ? product.price * parseInt(cantidad) : 0;
      return { ...prev, cantidad, total: total.toString() };
    });
  };

  const handleSubmit = async () => {
    if (!form.clienteId || !form.productoId || !form.total || !form.cantidad) {
      alert("Completa todos los campos");
      return;
    }

    const payload: SaleForm = {
      ...form,
      fecha: new Date().toISOString()
    };

    try {
      const res = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Error al registrar la venta");

      await res.json();
      alert("Venta registrada correctamente");

      setForm({
        productoId: "",
        clienteId: "",
        usuarioId: "3",
        total: "",
        cantidad: "1",
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
        <CardTitle>Registrar Venta</CardTitle>
        <CardDescription>Completa los detalles de la venta</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="clienteId">ID Cliente</Label>
          <Input
            id="clienteId"
            placeholder="Ej: 5"
            value={form.clienteId}
            onChange={e => setForm({ ...form, clienteId: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="productoId">Producto</Label>
          <Select value={form.productoId} onValueChange={handleProductSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un producto" />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - Bs.{product.price}
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
            <Label htmlFor="total">Total a cobrar</Label>
            <Input
              id="total"
              type="number"
              value={form.total}
              readOnly
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="pago">Método de Pago</Label>
          <Select value={form.pago} onValueChange={value => setForm({ ...form, pago: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efectivo">Efectivo</SelectItem>
              <SelectItem value="tarjeta">Tarjeta</SelectItem>
              <SelectItem value="transferencia">Transferencia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSubmit}>Registrar Venta</Button>
      </CardContent>
    </Card>
  );
};

export default RegisterSale;
