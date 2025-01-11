export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import prisma from "@/src/utils/prisma/index";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        createdBy: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ message: "Une erreur est survenue." }, { status: 500 });
  }
}
