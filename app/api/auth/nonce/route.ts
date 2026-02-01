import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST() {
  const nonce = `Sign in to StarkVault: ${uuid()}`;

  return NextResponse.json({ nonce });
}
