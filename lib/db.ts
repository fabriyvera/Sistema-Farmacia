import sql from 'mssql';

const dbConfig = {
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.PASSWORD!,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

export async function connectDB() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('✅ Conectado a SQL Server');
    return pool;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    throw error;
  }
}

export { sql };