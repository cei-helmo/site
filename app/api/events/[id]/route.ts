import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/src/utils/prisma/index";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  

  if (!id) {
    return NextResponse.json({ message: 'ID manquant dans l\'URL.' }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        createdBy: {
          select: { name: true },
        },
      },
    });


    if (!event) {
      console.error("Événement non trouvé."); 
      return NextResponse.json({ message: 'Événement non trouvé.' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ message: 'Une erreur est survenue.' }, { status: 500 });
  }
}
