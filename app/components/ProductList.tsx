"use client";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Search } from "lucide-react";

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

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://690a052a1a446bb9cc2104c7.mockapi.io/Productos";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <div className="space-y-6">
        <div>
        <h1 className="text-2xl font-bold">Lista de Productos</h1>
        <p className="text-muted-foreground">
            Administra los productos registrados en el sistema
        </p>
      </div>
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-6">
            Cargando productos...
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Caducidad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{`Bs. ${product.precio}`}</TableCell>
                  <TableCell>{product.proveedor}</TableCell>
                  <TableCell>{product.caducidad}</TableCell>
                  <TableCell>
                    <Badge variant={product.estado === "Activo" ? "default" : "secondary"}>
                      {product.estado}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
    </div>
  );

};

export default ProductList;