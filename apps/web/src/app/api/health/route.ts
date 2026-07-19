import { NextResponse } from "next/server";
import { getHealthStatus } from "@/lib/backend/operations/health-service";

export async function GET() {
  const health = await getHealthStatus();
  const statusCode = health.status === "unhealthy" ? 503 : 200;
  return NextResponse.json(health, { status: statusCode });
}
