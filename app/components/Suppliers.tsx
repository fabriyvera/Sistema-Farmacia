"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Plus, Search, MapPin, Edit, Trash2 } from "lucide-react";

const API_URL = "https://690a052a1a446bb9cc2104c7.mockapi.io/Proveedores";

interface Supplier {
  id?: string;
  name: string;
  email: string;
  direccion: string;
  ciudad: string;
  tipo: string;
  estado: string;
}

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Supplier>({
    name: "",
    email: "",
    direccion: "",
    ciudad: "",
    tipo: "",
    estado: "Activo",
  });

  // Cargar datos desde la API
  const fetchSuppliers = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setSuppliers(data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Filtrar proveedores
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejo de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Guardar o editar proveedor
  const handleSave = async () => {
    if (editingSupplier) {
      // Editar proveedor
      await fetch(`${API_URL}/${editingSupplier.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      // Nuevo proveedor
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }

    await fetchSuppliers();
    setOpenDialog(false);
    setEditingSupplier(null);
    setFormData({
      name: "",
      email: "",
      direccion: "",
      ciudad: "",
      tipo: "",
      estado: "Activo",
    });
  };

  // Eliminar proveedor
  const handleDelete = async (id: string) => {
    if (confirm("¿Deseas eliminar este proveedor?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchSuppliers();
    }
  };

  // Editar proveedor
  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
    setOpenDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Proveedores</h1>
          <p className="text-muted-foreground">
            Administra la información de tus proveedores
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? "Editar Proveedor" : "Agregar Nuevo Proveedor"}
              </DialogTitle>
              <DialogDescription>
                Completa la información del proveedor
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Empresa</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Farmacéutica XYZ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contacto@ejemplo.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Calle, número, ciudad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Ej: La Paz"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Input
                  id="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  placeholder="Ej: Medicamentos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <select
                  id="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingSupplier ? "Guardar Cambios" : "Guardar Proveedor"}
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
                placeholder="Buscar proveedores..."
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
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {supplier.direccion}
                    </div>
                  </TableCell>
                  <TableCell>{supplier.ciudad}</TableCell>
                  <TableCell>{supplier.tipo}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        supplier.estado === "Activo" ? "default" : "secondary"
                      }
                    >
                      {supplier.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(supplier)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(supplier.id!)}
                      >
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

export default Suppliers;
