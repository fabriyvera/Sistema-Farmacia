"use client";
import { useState } from "react";
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
import { Plus, Search, Edit, Trash2, AlertTriangle, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Analgésicos",
      sku: "PAR-500-001",
      stock: 450,
      minStock: 100,
      maxStock: 1000,
      price: 25.50,
      supplier: "Farmacéutica Central",
      expiry: "2026-12-31",
      status: "En Stock"
    },
    {
      id: 2,
      name: "Ibuprofeno 400mg",
      category: "Antiinflamatorios",
      sku: "IBU-400-002",
      stock: 32,
      minStock: 80,
      maxStock: 800,
      price: 35.00,
      supplier: "Distribuidora Médica",
      expiry: "2026-08-15",
      status: "Stock Bajo"
    },
    {
      id: 3,
      name: "Amoxicilina 500mg",
      category: "Antibióticos",
      sku: "AMO-500-003",
      stock: 28,
      minStock: 60,
      maxStock: 500,
      price: 85.00,
      supplier: "Laboratorios Unidos",
      expiry: "2027-03-20",
      status: "Stock Bajo"
    },
    {
      id: 4,
      name: "Losartan 50mg",
      category: "Antihipertensivos",
      sku: "LOS-050-004",
      stock: 15,
      minStock: 50,
      maxStock: 400,
      price: 95.00,
      supplier: "Farmacéutica Central",
      expiry: "2026-11-10",
      status: "Stock Crítico"
    },
    {
      id: 5,
      name: "Metformina 850mg",
      category: "Antidiabéticos",
      sku: "MET-850-005",
      stock: 380,
      minStock: 70,
      maxStock: 600,
      price: 45.00,
      supplier: "Distribuidora Médica",
      expiry: "2027-01-25",
      status: "En Stock"
    },
    {
      id: 6,
      name: "Omeprazol 20mg",
      category: "Antiulcerosos",
      sku: "OME-020-006",
      stock: 520,
      minStock: 100,
      maxStock: 800,
      price: 55.00,
      supplier: "Laboratorios Unidos",
      expiry: "2026-09-30",
      status: "En Stock"
    }
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.status === "Stock Bajo" || p.status === "Stock Crítico");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En Stock":
        return "default";
      case "Stock Bajo":
        return "secondary";
      case "Stock Crítico":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Gestión de Inventario</h1>
          <p className="text-muted-foreground">
            Administra los productos farmacéuticos
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogDescription>
                Completa la información del producto
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nombre del Producto</Label>
                  <Input id="productName" placeholder="Ej: Paracetamol 500mg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="Ej: PAR-500-001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analgesicos">Analgésicos</SelectItem>
                      <SelectItem value="antibioticos">Antibióticos</SelectItem>
                      <SelectItem value="antiinflamatorios">Antiinflamatorios</SelectItem>
                      <SelectItem value="antihipertensivos">Antihipertensivos</SelectItem>
                      <SelectItem value="antidiabeticos">Antidiabéticos</SelectItem>
                      <SelectItem value="antiulcerosos">Antiulcerosos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Select>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Farmacéutica Central</SelectItem>
                      <SelectItem value="2">Distribuidora Médica</SelectItem>
                      <SelectItem value="3">Laboratorios Unidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Actual</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Mínimo</Label>
                  <Input id="minStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStock">Stock Máximo</Label>
                  <Input id="maxStock" type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio Unitario</Label>
                  <Input id="price" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Fecha de Caducidad</Label>
                  <Input id="expiry" type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Guardar Producto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Package className="h-4 w-4" />
            Todos los Productos
          </TabsTrigger>
          <TabsTrigger value="low" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Stock Bajo ({lowStockProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
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
                    <TableHead>SKU</TableHead>
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
                      <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div>
                          <div>{product.stock} unidades</div>
                          <div className="text-xs text-muted-foreground">
                            Min: {product.minStock} / Max: {product.maxStock}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Bs.{product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-sm">{product.supplier}</TableCell>
                      <TableCell className="text-sm">{product.expiry}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
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
        </TabsContent>

        <TabsContent value="low">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                <h3>Productos que Requieren Reabastecimiento</h3>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock Actual</TableHead>
                    <TableHead>Stock Mínimo</TableHead>
                    <TableHead>Cantidad a Pedir</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(product.status)}>
                          {product.stock} unidades
                        </Badge>
                      </TableCell>
                      <TableCell>{product.minStock} unidades</TableCell>
                      <TableCell className="text-primary">
                        {product.maxStock - product.stock} unidades
                      </TableCell>
                      <TableCell>{product.supplier}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">Generar Pedido</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
