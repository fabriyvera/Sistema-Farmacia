require('dotenv').config();
const sql = require('mssql');

console.log('🧪 Probando conexión EXCLUSIVA a Azure...');

// Configuración SOLO Azure
const azureConfig = {
  server: process.env.AZURE_DB_SERVER,
  database: process.env.AZURE_DB_NAME,
  user: process.env.AZURE_DB_USER,
  password: process.env.AZURE_DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000
  }
};

async function testAzureOnly() {
  console.log('📍 Servidor Azure:', azureConfig.server);
  console.log('📁 Base de datos:', azureConfig.database);
  console.log('👤 Usuario:', azureConfig.user);
  
  if (!azureConfig.server || !azureConfig.database || !azureConfig.user || !azureConfig.password) {
    console.log('❌ FALTAN variables de entorno para Azure');
    return;
  }

  try {
    const pool = await sql.connect(azureConfig);
    console.log('✅ ¡CONEXIÓN AZURE EXITOSA!');
    
    // Probar consulta
    const result = await pool.request().query('SELECT @@version as version');
    console.log('🔧 Versión SQL:', result.recordset[0].version);
    
    await pool.close();
  } catch (error) {
    console.log('❌ Error Azure:', error.message);
    
    if (error.code === 'ELOGIN') {
      console.log('🔑 Revisa usuario/contraseña de Azure');
    } else if (error.code === 'ESOCKET') {
      console.log('🌐 Revisa nombre del servidor y firewall');
    }
  }
}

testAzureOnly();