import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

type SaveUserPayload = {
  email: string;
  name: string | null;
  avatar: string | null;
};

function parseBody(body: unknown): SaveUserPayload | null {
  if (body === null || typeof body !== "object") {
    return null;
  }
  const record = body as Record<string, unknown>;
  const emailRaw = record.email;
  if (typeof emailRaw !== "string") {
    return null;
  }
  const email = emailRaw.trim();
  if (!email) {
    return null;
  }

  const name =
    record.name === undefined || record.name === null
      ? null
      : typeof record.name === "string"
        ? record.name.trim() || null
        : null;

  const avatar =
    record.avatar === undefined || record.avatar === null
      ? null
      : typeof record.avatar === "string"
        ? record.avatar.trim() || null
        : null;

  return { email, name, avatar };
}

export async function POST(request: Request): Promise<NextResponse> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = parseBody(json);
  if (!payload) {
    return NextResponse.json(
      { error: "Missing or invalid email" },
      { status: 400 },
    );
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (existing) {
      return NextResponse.json({ ok: true, created: false });
    }

    await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        avatar: payload.avatar,
      },
    });

    return NextResponse.json({ ok: true, created: true });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ ok: true, created: false });
    }
    console.error("[save-user] Database error:", error);
    return NextResponse.json(
      { error: "Failed to save user" },
      { status: 500 },
    );
  }
}
