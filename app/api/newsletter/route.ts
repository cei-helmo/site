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
        { status: 400 }
      );
    }

    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Cet email est déjà abonné à la newsletter." },
        { status: 400 }
      );
    }

    await prisma.newsletter.create({
      data: { email },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465", 10),
      secure: process.env.SMTP_SECURE === "true", // true pour SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"CEI HELMo" <${process.env.SMTP_USER}@helmo.be>`,
      to: email,
      subject: "Merci de vous être abonné(e) à la newsletter du CEI !",
      text: `Bonjour, 
    
Merci de vous être abonné(e) à la newsletter du Cercle des Étudiants en Informatique ! Grâce à cette newsletter, vous serez tenu(e) au courant de nos événements, soirées et autres activités organisées par le CEI tout au long de l’année. 

Restez connecté(e), et n’hésitez pas à nous suivre sur nos réseaux pour encore plus d’infos et d’interactions avec la communauté !

À très bientôt,  
L’équipe du CEI`,
      html: `<p>Bonjour,</p>
<p>Merci de vous être abonné(e) à la newsletter du <strong>Cercle des Étudiants en Informatique</strong> ! Grâce à cette newsletter, vous serez tenu(e) au courant de nos événements, soirées et autres activités organisées par le CEI tout au long de l’année.</p>
<p>Restez connecté(e), et n’hésitez pas à nous suivre sur nos réseaux pour encore plus d’infos et d’interactions avec la communauté !</p>
<p>À très bientôt,<br><strong>L’équipe du CEI</strong></p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Abonnement réussi." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l’envoi ou l’enregistrement :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
