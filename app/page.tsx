'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Verificar si ya hay una sesión activa al cargar la página
  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    const userType = sessionStorage.getItem('userType');
    
    if (userData && userType) {
      setUser(JSON.parse(userData));
      // Redirigir según el tipo de usuario
      if (userType === 'admin') {
        router.push('./admin');
      } else {
        router.push('./cliente');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Guardar información del usuario en sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('userType', data.userType);
        
        // Redirigir según el tipo de usuario
        if (data.userType === 'admin') {
          router.push('./admin');
        } else {
          router.push('./cliente');
        }
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Si ya hay usuario, mostrar información breve
  if (user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Bienvenido a Farmacia App</h1>
        <p>Redirigiendo a tu panel...</p>
        <button 
          onClick={() => {
            sessionStorage.clear();
            setUser(null);
          }}
          style={{ marginTop: '20px', padding: '10px' }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Mostrar formulario de login si no hay usuario
  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Farmacia App - Login
      </h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Usuario:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="Ingresa tu usuario"
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Contraseña:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      {/* Información de prueba */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3 style={{ marginBottom: '10px' }}>Credenciales de prueba:</h3>
        <p><strong>Administrador:</strong> admin01 / AdminPass2025!</p>
        <p><strong>Cliente:</strong> cmendoza / 12345</p>
      </div>
    </div>
  );
}