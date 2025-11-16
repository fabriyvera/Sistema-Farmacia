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

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location?: string;
  status: string;
}

const ModifyEmployee = () => {
  const [staff, setStaff] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Usuarios");
        if (!response.ok) throw new Error("Error al obtener datos");
        const data = await response.json();

        const formattedData: Employee[] = data.map((user: any) => ({
          id: user.id,
          name: user.nombre,
          role: user.rol,
          email: user.email,
          phone: user.telefono,
          location: user.ubicacion,
          status: user.estado,
        }));

        setStaff(formattedData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchStaff();
  }, []);

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    const employee = staff.find(emp => emp.id === employeeId);
    if (employee) {
      setName(employee.name);
      setRole(employee.role);
      setEmail(employee.email);
      setPhone(employee.phone);
      setLocation(employee.location || "");
    }
  };

  const handleUpdate = async () => {
    if (!selectedEmployee || !name || !role || !email || !phone) {
      alert("Por favor, selecciona un empleado y completa todos los campos");
      return;
    }

    const updatedEmployee = {
      nombre: name,
      rol: role,
      email: email,
      telefono: phone,
      ubicacion: location,
    };

    try {
      const response = await fetch(`https://690a052a1a446bb9cc2104c7.mockapi.io/Usuarios/${selectedEmployee}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployee),
      });

      if (!response.ok) throw new Error("Error al actualizar el empleado");
      
      alert("Empleado actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      alert("Error al actualizar empleado");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Modificar Empleado</h1>
        <p className="text-muted-foreground">
          Seleccione un empleado y modifique su información
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label>Seleccionar Empleado</Label>
              <Select onValueChange={handleEmployeeSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un empleado" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEmployee && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Nombre Completo *</Label>
                    <Input
                      id="editName"
                      placeholder="Ej: Juan Pérez López"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editRole">Puesto *</Label>
                    <Input
                      id="editRole"
                      placeholder="Ej: Gerente de Ventas"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editEmail">Correo Electrónico *</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      placeholder="empleado@catefarm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">Teléfono *</Label>
                    <Input
                      id="editPhone"
                      placeholder="+591 78218688"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editLocation">Ubicación</Label>
                  <Input
                    id="editLocation"
                    placeholder="Seleccione la ubicación en el mapa"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 justify-end pt-4">
                  <Button variant="outline" onClick={() => setSelectedEmployee("")}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate}>
                    Actualizar Empleado
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

export default ModifyEmployee;