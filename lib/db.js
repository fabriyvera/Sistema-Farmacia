import sql from "mssql";

const config = 
{
  user: "tuUsuario",
  password: "tuPassword",
  server: "localhost",
  database: "TuBaseDeDatos",
  options: {
    encrypt: true,
    trustServerCertificate: true, // necesario en local
  },
};

let pool;

export async function getConnection() 
{
  try 
  {
    if (!pool) 
    {
      pool = await sql.connect(config);
    }
    return pool;
  } 
  catch (err) 
  {
    console.error("Error al conectar a SQL Server:", err);
    throw err;
  }
}
