"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState("admin"); // por defecto
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, tipo }),
      });

      const data = await res.json();

      if (data.success) {
        if (tipo === "admin") {
          router.push("/admin");
        } else {
          router.push("/cliente");
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error al intentar iniciar sesión");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
          <label className="text-gray-600 text-sm">Tipo de usuario</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="admin">Administrador</option>
            <option value="cliente">Cliente</option>
          </select>

          <label className="text-gray-600 text-sm">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu usuario"
            className="border rounded-lg p-2"
          />

          <label className="text-gray-600 text-sm">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            className="border rounded-lg p-2"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}