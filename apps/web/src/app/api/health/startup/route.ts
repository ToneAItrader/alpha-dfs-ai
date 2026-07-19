import { NextResponse } from "next/server";
import { validateStartup } from "@/lib/backend/operations/startup-validation";

export async function GET() {
  const result = await validateStartup();
  const statusCode = result.ok ? 200 : 503;
  return NextResponse.json(result, { status: statusCode });
}
