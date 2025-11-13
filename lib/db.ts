// lib/db.ts - Configuración para Azure
import sql from 'mssql';

const dbConfig = {
  server: process.env.DB_SERVER!, // "tu-servidor.database.windows.net"
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  options: {
    encrypt: true, // OBLIGATORIO para Azure
    trustServerCertificate: false, // false en producción
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

export async function connectDB() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('✅ Conectado a Azure SQL Database');
    return pool;
  } catch (error) {
    console.error('❌ Error de conexión a Azure:', error);
    throw error;
  }
}

export { sql };