import { NextResponse } from "next/server";
import { getReadinessStatus } from "@/lib/backend/operations/health-service";

export async function GET() {
  const readiness = await getReadinessStatus();
  return NextResponse.json(readiness, {
    status: readiness.ready ? 200 : 503,
  });
}
