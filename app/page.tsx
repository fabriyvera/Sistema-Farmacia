"use client";

import { useRouter } from "next/navigation";
import Login from "./components/Login"; // Asegúrate de que la ruta sea correcta

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Aquí puedes decidir a dónde redirigir según el usuario
    // Por simplicidad, si es admin vamos a "/admin", si es cliente "/cliente"
    // Si quieres lógica más compleja, tendrías que recibirla desde el componente Login
    router.push("/admin");
  };

  return <Login onLogin={handleLogin} />;
}
