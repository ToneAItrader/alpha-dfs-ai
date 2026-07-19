import { NextResponse } from "next/server";
import { getAnalysisProvider } from "@/providers/analysis-provider";

export async function GET() {
  const status = await getAnalysisProvider().getPipelineStatus();
  return NextResponse.json(status);
}
