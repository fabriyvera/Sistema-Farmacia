"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface RegisterProductProps {
  onBack: () => void;
}

const RegisterProduct = ({ onBack }: RegisterProductProps) => {
  const [name, setName] = useState("");
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");
  const [caducidad, setCaducidad] = useState("");
  const [estado, setEstado] = useState("Activo");

  const API_URL = "https://690a052a1a446bb9cc2104c7.mockapi.io/Productos";

  const handleSubmit = async () => {
    if (!name || !categoria || !stock || !precio) {
      alert("Por favor, completa todos los campos obligatorios");
      return;
    }

    const newProduct = {
      name,
      categoria,
      proveedor,
      stock,
      precio,
      caducidad,
      estado,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Error al guardar producto");
      
      // Limpiar formulario
      setName("");
      setCategoria("");
      setProveedor("");
      setStock("");
      setPrecio("");
      setCaducidad("");
      setEstado("Activo");
      
      alert("Producto registrado correctamente");
      onBack();
    } catch (error) {
      console.error("Error al registrar producto:", error);
      alert("Error al registrar producto");
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Registrar Nuevo Producto</h2>
        <p className="text-muted-foreground">
          Complete la información del nuevo producto
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                placeholder="Ej: Paracetamol 500mg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Input
                id="categoria"
                placeholder="Ej: Analgésicos"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor</Label>
              <Input
                id="proveedor"
                placeholder="Ej: Farmacorp"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Actual *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio Unitario *</Label>
              <Input
                id="precio"
                type="number"
                placeholder="0.00"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caducidad">Fecha de Caducidad</Label>
              <Input
                id="caducidad"
                type="date"
                value={caducidad}
                onChange={(e) => setCaducidad(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger id="estado">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Registrar Producto
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterProduct;