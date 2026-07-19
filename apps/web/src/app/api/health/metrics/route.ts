import { NextResponse } from "next/server";
import { getMetricsResponse } from "@/lib/backend/operations/diagnostics-service";

export async function GET() {
  return NextResponse.json(getMetricsResponse());
}
