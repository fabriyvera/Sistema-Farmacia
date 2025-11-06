import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT GETDATE() as date;");
    return NextResponse.json({ success: true, date: result.recordset[0].date });
  } catch (error) {
    console.error("Error SQL:", error);
    return NextResponse.json({ success: false, error });
  }
}
