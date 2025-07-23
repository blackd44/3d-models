import { NextResponse } from "next/server"
import { Database } from "@/lib/db"

export async function GET() {
  try {
    const stats = await Database.getAdminStats()
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
