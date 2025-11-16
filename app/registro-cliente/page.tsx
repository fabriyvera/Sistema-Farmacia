"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nc_ct: "",
    nm_ct: "",
    tl_ct: "",
    em_ct: "",
    ds_ct: "",
    pw_ct: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validaciones
    if (!formData.nc_ct || !formData.nm_ct || !formData.tl_ct || 
        !formData.em_ct || !formData.ds_ct || !formData.pw_ct) {
      setError("Por favor, completa todos los campos");
      setLoading(false);
      return;
    }

    if (formData.pw_ct !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.pw_ct.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Cliente registrado correctamente. Ahora puedes iniciar sesión.");
        router.push("/login");
      } else {
        setError(result.message || "Error al registrar cliente");
      }
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-orange-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center relative">
          <h1 className="text-white text-3xl md:text-4xl font-extrabold tracking-wide">
            CATEFARM
          </h1>
        </div>
      </header>

      {/* MAIN: card centrado */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 bg-white">
          {/* LEFT: logo area (fondo suave naranja) */}
          <div className="hidden md:flex items-center justify-center bg-orange-50 p-10">
            <div className="w-72 h-72 relative">
              <Image
                src="/Catedral-Logo-Naranja-Original.png"
                alt="Catedral logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          {/* RIGHT: formulario de registro */}
          <div className="p-10 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Crear Cuenta
            </h2>
            <p className="text-gray-600 mb-6">
              Regístrate como cliente para acceder a nuestros servicios
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  name="nc_ct"
                  value={formData.nc_ct}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Juan Pérez López"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  name="nm_ct"
                  value={formData.nm_ct}
                  onChange={handleChange}
                  required
                  placeholder="Ej: juan.perez"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  name="em_ct"
                  type="email"
                  value={formData.em_ct}
                  onChange={handleChange}
                  required
                  placeholder="Ej: juan@email.com"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  name="tl_ct"
                  value={formData.tl_ct}
                  onChange={handleChange}
                  required
                  placeholder="Ej: +591 78218688"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  name="ds_ct"
                  value={formData.ds_ct}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Av. Siempre Viva 123"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    name="pw_ct"
                    type={showPassword ? "text" : "password"}
                    value={formData.pw_ct}
                    onChange={handleChange}
                    required
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repite tu contraseña"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 font-medium shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button 
                onClick={() => router.push("/login")} 
                className="text-orange-600 font-medium hover:underline"
              >
                Inicia sesión aquí
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative w-36 h-36 mb-3">
              <Image
                src="/Catedral-Logo-Naranja-Original.png"
                alt="Logo CATEFARM"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="text-lg font-semibold text-gray-800">CATEFARM</div>
            <div className="text-sm text-gray-500">Sistema de gestión</div>
          </div>

          {/* Contacto */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-semibold text-gray-700 mb-3">Contáctanos</h4>

            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
              {/* Redes */}
              <a className="p-2 text-gray-600 hover:text-blue-600 hover:scale-110 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.7c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.14h-1.1c-1.1 0-1.45.68-1.45 1.38V12h2.5l-.4 2.9h-2.1v7A10 10 0 0022 12z"/>
                </svg>
              </a>

              <a className="p-2 text-gray-600 hover:text-pink-500 hover:scale-110 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.9A3.1 3.1 0 1015.1 11 3.1 3.1 0 0012 7.9zm6.4-.6a1.15 1.15 0 11-1.15-1.15A1.15 1.15 0 0118.4 7.3z"/>
                </svg>
              </a>

              <a className="p-2 text-gray-600 hover:text-black hover:scale-110 transition">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.6 2.1v7.6c0 .1 0 .2.1.3 0 2.1-1.6 3.8-3.7 3.8-2.1 0-3.7-1.7-3.7-3.8s1.6-3.8 3.7-3.8c.5 0 1 .1 1.4.3V4.1c-.5-.2-1-.3-1.4-.3C8 3.8 6 5.8 6 8.3 6 10.9 8 13 10.6 13c2.4 0 4.3-1.9 4.3-4.3V2.1h-2.3z" />
                </svg>
              </a>

              <a className="p-2 text-gray-600 hover:text-sky-700 hover:scale-110 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.6 4.06 5.5 2.98 5.5S1 4.6 1 3.5 1.92 1.5 3 1.5 4.98 2.4 4.98 3.5zM1.5 8.5h3v12h-3v-12zM8.5 8.5h2.9v1.6h.1c.4-.8 1.6-1.6 3.3-1.6 3.5 0 4.2 2.3 4.2 5.3v6.7h-3v-6c0-1.4 0-3.2-2-3.2-2 0-2.3 1.5-2.3 3v6.2h-3v-12z"/>
                </svg>
              </a>
            </div>

            <div className="text-sm text-gray-500">
              <div>Tel: +591 7XX XXXX</div>
              <div>contacto@catefarm.com</div>
            </div>
          </div>

          {/* Categorías */}
          <div className="text-right md:text-right">
            <h4 className="text-base font-semibold text-gray-700 mb-3">Categorías</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Dermatología</li>
              <li>Farmacia y Salud</li>
              <li>Vitaminas</li>
              <li>Ortopedia</li>
              <li>Suplementos</li>
              <li>Cuidado Personal</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pb-6">
          © {new Date().getFullYear()} CATEFARM — Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}