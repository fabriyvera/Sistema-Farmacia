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

interface Admin {
  pk_adm: string;
  nm_adm: string;
  nms_adm: string;
  app_adm: string;
  apm_adm: string;
  fk_rl: number;
  fk_sc: number;
  st_adm: boolean;
  em_adm: string;
  tl_adm: string;
  ds_adm: string;
}

const ModifyEmployee = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [username, setUsername] = useState("");
  const [nombres, setNombres] = useState("");
  const [apPaterno, setApPaterno] = useState("");
  const [apMaterno, setApMaterno] = useState("");
  const [rol, setRol] = useState("0");
  const [sucursal, setSucursal] = useState("0");
  const [estado, setEstado] = useState("1");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("/api/admin");
        if (!response.ok) throw new Error("Error al obtener administradores");
        const data = await response.json();

        if (data.success) {
          setAdmins(data.data);
        } else {
          throw new Error(data.message || "Error al cargar datos");
        }
      } catch (error) {
        console.error("Error cargando administradores:", error);
        alert("Error al cargar la lista de administradores");
      }
    };

    fetchAdmins();
  }, []);

  const handleAdminSelect = (adminId: string) => {
    setSelectedAdmin(adminId);
    const admin = admins.find(admin => admin.pk_adm === adminId);
    if (admin) {
      setUsername(admin.nm_adm);
      setNombres(admin.nms_adm || "");
      setApPaterno(admin.app_adm || "");
      setApMaterno(admin.apm_adm || "");
      setRol(admin.fk_rl?.toString() || "0");
      setSucursal(admin.fk_sc?.toString() || "0");
      setEstado(admin.st_adm ? "1" : "0");
      setEmail(admin.em_adm || "");
      setTelefono(admin.tl_adm || "");
      setDireccion(admin.ds_adm || "");
    }
  };

  const handleUpdate = async () => {
    if (!selectedAdmin || !username || !nombres || !apPaterno || !email || !telefono) {
      alert("Por favor, selecciona un administrador y completa todos los campos obligatorios");
      return;
    }

    const updatedAdmin = {
      nm_adm: username,
      nms_adm: nombres,
      app_adm: apPaterno,
      apm_adm: apMaterno,
      fk_rl: parseInt(rol) || 0,
      fk_sc: parseInt(sucursal) || 0,
      st_adm: estado,
      em_adm: email,
      tl_adm: telefono,
      ds_adm: direccion,
    };

    try {
      const response = await fetch(`/api/admin/${selectedAdmin}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAdmin),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}`);
      }

      if (result.success) {
        alert("Administrador actualizado correctamente");
        // Recargar la lista de administradores
        const refreshResponse = await fetch("/api/administradores");
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success) {
            setAdmins(refreshData.data);
          }
        }
      } else {
        throw new Error(result.message || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      alert(error instanceof Error ? error.message : "Error al actualizar administrador");
    }
  };

  const handleCancel = () => {
    setSelectedAdmin("");
    setUsername("");
    setNombres("");
    setApPaterno("");
    setApMaterno("");
    setRol("0");
    setSucursal("0");
    setEstado("1");
    setEmail("");
    setTelefono("");
    setDireccion("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Modificar Administrador</h1>
        <p className="text-muted-foreground">
          Seleccione un administrador y modifique su información
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label>Seleccionar Administrador</Label>
              <Select onValueChange={handleAdminSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un administrador" />
                </SelectTrigger>
                <SelectContent>
                  {admins.map((admin) => (
                    <SelectItem key={admin.pk_adm} value={admin.pk_adm}>
                      {admin.nms_adm} {admin.app_adm} - {admin.nm_adm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAdmin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editUsername">Username *</Label>
                    <Input
                      id="editUsername"
                      placeholder="Ej: juan.perez"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editNombres">Nombres *</Label>
                    <Input
                      id="editNombres"
                      placeholder="Ej: Juan Carlos"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editApPaterno">Apellido Paterno *</Label>
                    <Input
                      id="editApPaterno"
                      placeholder="Ej: Pérez"
                      value={apPaterno}
                      onChange={(e) => setApPaterno(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editApMaterno">Apellido Materno</Label>
                    <Input
                      id="editApMaterno"
                      placeholder="Ej: López"
                      value={apMaterno}
                      onChange={(e) => setApMaterno(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editEmail">Correo Electrónico *</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      placeholder="admin@catefarm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editTelefono">Teléfono *</Label>
                    <Input
                      id="editTelefono"
                      placeholder="+591 78218688"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editRol">Rol</Label>
                    <select
                      id="editRol"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={rol}
                      onChange={(e) => setRol(e.target.value)}
                    >
                      <option value="0">Administrador</option>
                      <option value="1">Supervisor</option>
                      <option value="2">Empleado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editSucursal">Sucursal</Label>
                    <Input
                      id="editSucursal"
                      type="number"
                      placeholder="0"
                      value={sucursal}
                      onChange={(e) => setSucursal(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editEstado">Estado</Label>
                    <select
                      id="editEstado"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                    >
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editDireccion">Dirección</Label>
                  <Input
                    id="editDireccion"
                    placeholder="Dirección del administrador"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 justify-end pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate}>
                    Actualizar Administrador
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