"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [name, setName] = useState("");
  const [categoria, setCategoria] = useState("");//LISTO
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

  // 🔹 Filtrar productos
  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Guardar o actualizar producto
  const handleSave = async () => {
    const nuevoProducto = {
      name,
      categoria,
      stock,
      precio,
      caducidad,
      estado,
    };

    try {
      const res = await fetch(
        editingProduct ? `${API_URL}/${editingProduct.id}` : API_URL,
        {
          method: editingProduct ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoProducto),
        }
      );

      if (!res.ok) throw new Error("Error al guardar producto");
      const updated = await res.json();

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updated : p))
        );
      } else {
        setProducts((prev) => [...prev, updated]);
      }

      // Resetear
      resetForm();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setCategoria("");
    setProveedor("");
    setStock("");
    setPrecio("");
    setCaducidad("");
    setEstado("Activo");
  };

  // 🔹 Eliminar producto
  const handleDelete = async (id: string) => {
    if (!confirm("¿Deseas eliminar este producto?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // 🔹 Editar producto
  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setCategoria(product.categoria);
    setProveedor(product.proveedor);
    setStock(product.stock);
    setPrecio(product.precio);
    setCaducidad(product.caducidad);
    setEstado(product.estado);
    setOpenDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Gestión de Inventario</h1>
          <p className="text-muted-foreground">Administra los productos farmacéuticos</p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
              <DialogDescription>
                Completa la información del producto
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nombre del Producto</Label>
                  <Input id="productName" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input id="category" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Input id="supplier" value={proveedor} onChange={(e) => setProveedor(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Actual</Label>
                  <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio Unitario</Label>
                  <Input id="price" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Fecha de Caducidad</Label>
                  <Input id="expiry" type="date" value={caducidad} onChange={(e) => setCaducidad(e.target.value)} />
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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingProduct ? "Guardar Cambios" : "Guardar Producto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
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
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.precio}</TableCell>
                  <TableCell>{product.proveedor}</TableCell>
                  <TableCell>{product.caducidad}</TableCell>
                  <TableCell>
                    <Badge variant={product.estado === "Activo" ? "default" : "secondary"}>
                      {product.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default Inventory;
