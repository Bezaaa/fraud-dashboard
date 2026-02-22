import { NextRequest, NextResponse } from "next/server";
import { predict, TransactionInput } from "@/lib/fraudModel";

export async function POST(req: NextRequest) {
  try {
    const body: TransactionInput = await req.json();
    const result = predict(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
