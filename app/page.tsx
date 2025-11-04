"use client";

import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "./components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const handleAdminLogin = () => {
    router.push("./admin");
  };

  const handleClientLogin = () => {
    router.push("./cliente");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Bienvenido a Catefarm
        </h1>
        <p className="text-gray-500 mb-8">Selecciona tu tipo de usuario:</p>

        <div className="flex flex-col gap-4">
          <Button 
          onClick={handleAdminLogin}>Administrador</Button>
          <Button
            onClick={handleClientLogin}
            className="bg-green-600 hover:bg-green-700"
          >
            Cliente
          </Button>
        </div>
      </div>
    </main>
  );
}
