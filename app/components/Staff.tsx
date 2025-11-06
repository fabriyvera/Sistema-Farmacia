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
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react";

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const handleAddEmployee = async () => {
    if (!name || !role || !email || !phone) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const newEmployee = {
      nombre: name,
      rol: role,
      email: email,
      telefono: phone,
      estado: "Activo", // puedes cambiarlo según necesites
    };

    try {
      const response = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) throw new Error("Error al guardar el empleado");
      const created = await response.json();

      setStaff((prev) => [
        ...prev,
        {
          id: created.id,
          name: created.nombre,
          role: created.rol,
          email: created.email,
          phone: created.telefono,
          status: created.estado,
          initials: created.nombre
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
        },
      ]);

      // Limpiar campos
      setName("");
      setRole("");
      setEmail("");
      setPhone("");
      alert("Empleado agregado correctamente");
    } catch (error) {
      console.error("Error al agregar empleado:", error);
      }
    };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Usuarios");
        if (!response.ok) throw new Error("Error al obtener datos");
        const data = await response.json();

        const formattedData = data.map((user: any) => ({
          id: user.id,
          name: user.nombre,
          role: user.rol,
          email: user.email,
          phone: user.telefono,
          status: user.estado,
          initials: user.nombre
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
        }));

        setStaff(formattedData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);


  const filteredStaff = staff.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Personal Administrativo</h1>
          <p className="text-muted-foreground">
            Gestiona el personal de la organización
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
              <DialogDescription>
                Completa la información del empleado
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="staffName">Nombre Completo</Label>
                  <Input
                    id="staffName"
                    placeholder="Ej: Juan Pérez López"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffRole">Puesto</Label>
                  <Input
                    id="staffRole"
                    placeholder="Ej: Gerente de Ventas"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="staffEmail">Correo Electrónico</Label>
                  <Input
                    id="staffEmail"
                    type="email"
                    placeholder="empleado@catefarm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffPhone">Teléfono</Label>
                  <Input
                    id="staffPhone"
                    placeholder="+591 78218688"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button onClick={handleAddEmployee}>Guardar Empleado</Button>
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
                placeholder="Buscar empleados..."
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
              Cargando empleados...
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Puesto</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {person.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>{person.name}</div>
                      </div>
                    </TableCell>

                    <TableCell>{person.role}</TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {person.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {person.phone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={person.status === "Activo" ? "default" : "secondary"}
                      >
                        {person.status}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;
