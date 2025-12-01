"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  nombres?: string;
  apPaterno?: string;
  apMaterno?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
  rol?: string;
  sucursal?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    const userType = sessionStorage.getItem('userType');

    if (userData && userType === 'admin') {
      setUser(JSON.parse(userData));
    } else if (userData && userType === 'client') {
      // Si es cliente, redirigir a la página principal
      router.push('/');
    } else {
      // Si no hay usuario, redirigir al login
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userType');
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user
  };
}