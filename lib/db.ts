import sql from 'mssql';

const azureDbConfig = {
  server: process.env.AZURE_DB_SERVER as string, 
  database: process.env.AZURE_DB_NAME as string, 
  user: process.env.AZURE_DB_USER as string,     
  password: process.env.AZURE_DB_PASSWORD as string, 
  options: {
    encrypt: true, 
    trustServerCertificate: false,
    enableArithAbort: true,
    connectTimeout: 60000,
    requestTimeout: 60000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

export async function getDbConnection() {
  try {
    console.log(' Conectando a Azure SQL Database...');

    if (!process.env.AZURE_DB_SERVER || !process.env.AZURE_DB_NAME || 
        !process.env.AZURE_DB_USER || !process.env.AZURE_DB_PASSWORD) {
      throw new Error(' Faltan variables de entorno para Azure SQL Database');
    }
    
    const pool = await sql.connect(azureDbConfig);
    console.log(' Conexión exitosa a Azure SQL Database');
    return pool;
  } catch (error) {
    console.error(' Error de conexión a Azure SQL:', error);
    throw error;
  }
}

export { getDbConnection as connectDB };