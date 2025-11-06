import sql from "mssql/msnodesqlv8";

const config = {
  server: "localhost\\SQLEXPRESS",
  database: "FarmaciaDB",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

export async function getConnection() {
  try {
    const pool = await sql.connect(config);
    console.log("✅ Conectado a SQL Server (Windows Auth)");
    return pool;
  } catch (err) {
    console.error("❌ Error de conexión SQL:", err);
    throw err;
  }
}
