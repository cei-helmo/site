import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 },
      );
    }

    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Cet email est déjà abonné à la newsletter." },
        { status: 400 },
      );
    }

    await prisma.newsletter.create({
      data: { email },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Merci de vous être abonné(e) à notre newsletter !",
      text: "Vous êtes maintenant inscrit(e) à notre newsletter. Restez à l’écoute pour nos mises à jour !",
      html: `<p>Bonjour,</p><p>Merci de vous être abonné(e) à notre newsletter. Restez à l’écoute pour nos prochaines mises à jour !</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Abonnement réussi." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de l’envoi ou l’enregistrement :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
