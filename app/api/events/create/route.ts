import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/src/utils/prisma/index";

export async function POST(req: NextRequest) {
  console.log("Received a POST request."); // LOG: Requête reçue

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      console.error("Utilisateur non autorisé."); // LOG: Non autorisé
      return NextResponse.json(
        { message: "Utilisateur non autorisé" },
        { status: 401 },
      );
    }

    const { title, description, date, imageUrl } = await req.json();

    if (!title || !description || !date) {
      console.error("Données manquantes."); // LOG: Données incomplètes
      return NextResponse.json(
        { message: "Des informations sont manquantes dans la requête." },
        { status: 400 },
      );
    }

    // Créer le nouvel événement
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date,
        imageUrl,
        createdBy: { connect: { email: token.email as string } },
      },
    });

    // Récupérer tous les événements après la création
    const allEvents = await prisma.event.findMany();

    return NextResponse.json(allEvents, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error); // LOG: Erreur serveur
    return NextResponse.json(
      {
        message: "Erreur lors de la création de l'événement",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}
