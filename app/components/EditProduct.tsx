"use client";
import { useEffect, useState } from "react";
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

interface Product {
  id: string;
  name: string;
  categoria: string;
  proveedor: string;
  stock: string;
  precio: string;
  caducidad: string;
  estado: string;
}

const EditProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [name, setName] = useState("");
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");
  const [caducidad, setCaducidad] = useState("");
  const [estado, setEstado] = useState("Activo");

  const API_URL = "https://690a052a1a446bb9cc2104c7.mockapi.io/Productos";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      setName(product.name);
      setCategoria(product.categoria);
      setProveedor(product.proveedor);
      setStock(product.stock);
      setPrecio(product.precio);
      setCaducidad(product.caducidad);
      setEstado(product.estado);
    }
  };

  const handleUpdate = async () => {
    if (!selectedProductId || !name || !categoria || !stock || !precio) {
      alert("Por favor, selecciona un producto y completa todos los campos");
      return;
    }

    const updatedProduct = {
      name,
      categoria,
      proveedor,
      stock,
      precio,
      caducidad,
      estado,
    };

    try {
      const res = await fetch(`${API_URL}/${selectedProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) throw new Error("Error al actualizar el producto");
      
      alert("Producto actualizado correctamente");
      
      // Recargar la lista de productos
      const updatedProducts = await fetch(API_URL).then(res => res.json());
      setProducts(updatedProducts);
      setSelectedProductId("");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("Error al actualizar producto");
    }
  };

  return (
    <div className="space-y-6">
    <div>
        <h1 className="text-2xl font-bold">Editar Producto</h1>
        <p className="text-muted-foreground">
          Seleccione un producto y modifique su información
        </p>
      </div>
    <Card>
      <CardContent>
        <div className="pt-6">
          <div className="space-y-2">
            <Label>Seleccionar Producto</Label>
            <Select onValueChange={handleProductSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {product.categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProductId && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Nombre del Producto *</Label>
                  <Input
                    id="editName"
                    placeholder="Ej: Paracetamol 500mg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCategoria">Categoría *</Label>
                  <Input
                    id="editCategoria"
                    placeholder="Ej: Analgésicos"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editProveedor">Proveedor</Label>
                  <Input
                    id="editProveedor"
                    placeholder="Ej: Farmacorp"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStock">Stock Actual *</Label>
                  <Input
                    id="editStock"
                    type="number"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editPrecio">Precio Unitario *</Label>
                  <Input
                    id="editPrecio"
                    type="number"
                    placeholder="0.00"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCaducidad">Fecha de Caducidad</Label>
                  <Input
                    id="editCaducidad"
                    type="date"
                    value={caducidad}
                    onChange={(e) => setCaducidad(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editEstado">Estado</Label>
                <Select value={estado} onValueChange={setEstado}>
                  <SelectTrigger id="editEstado">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProductId("")}
                >
                  Cancelar
                </Button>
                <Button onClick={handleUpdate}>
                  Actualizar Producto
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default EditProduct;