"use client";
import { useState } from "react";
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
import { Plus, Search, Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react";

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Farmacéutica Central",
      contact: "María González",
      phone: "+52 55 1234 5678",
      email: "contacto@farmcentral.com",
      address: "Av. Reforma 123, CDMX",
      status: "Activo",
      products: 234
    },
    {
      id: 2,
      name: "Distribuidora Médica",
      contact: "Juan Pérez",
      phone: "+52 55 8765 4321",
      email: "ventas@distmedica.com",
      address: "Calle Juárez 456, Guadalajara",
      status: "Activo",
      products: 189
    },
    {
      id: 3,
      name: "Laboratorios Unidos",
      contact: "Ana Martínez",
      phone: "+52 81 2222 3333",
      email: "info@labunidos.com",
      address: "Blvd. Constitución 789, Monterrey",
      status: "Activo",
      products: 156
    },
    {
      id: 4,
      name: "Pharma Solutions",
      contact: "Carlos Ramírez",
      phone: "+52 33 4444 5555",
      email: "contacto@pharmasol.com",
      address: "Av. Patria 321, Guadalajara",
      status: "Inactivo",
      products: 98
    }
  ]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Gestión de Proveedores</h1>
          <p className="text-muted-foreground">
            Administra la información de tus proveedores
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
              <DialogDescription>
                Completa la información del proveedor
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Empresa</Label>
                  <Input id="name" placeholder="Ej: Farmacéutica XYZ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Persona de Contacto</Label>
                  <Input id="contact" placeholder="Ej: Juan Pérez" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+52 55 1234 5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="contacto@ejemplo.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" placeholder="Calle, número, ciudad" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Guardar Proveedor</Button>
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
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <div>{supplier.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {supplier.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {supplier.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {supplier.email}
                    </div>
                  </TableCell>
                  <TableCell>{supplier.products}</TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === 'Activo' ? 'default' : 'secondary'}>
                      {supplier.status}
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
    </div>
  );
};

export default Suppliers;
