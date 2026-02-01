import { NextResponse } from "next/server";
import { verifyMessageInStarknet } from "starknet"; // <- updated import
import { SignJWT } from "jose";

export async function POST(req: Request) {
  const body = await req.json();
  
  const { message, signature } = body;

  // Use the correct function
  const isValid = verifyMessageInStarknet(message, signature);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Continue JWT signing or whatever
  const jwt = await new SignJWT({ user: "starknet-user" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode("your-secret"));

  return NextResponse.json({ token: jwt });
}
