import { NextResponse } from "next/server";
import { getDiagnosticsResponse } from "@/lib/backend/operations/diagnostics-service";

export async function GET() {
  return NextResponse.json(getDiagnosticsResponse());
}
