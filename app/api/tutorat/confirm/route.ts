import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import nodemailer from "nodemailer";

const ensureEmailConfig = () => {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Configuration SMTP manquante: ${missing.join(", ")}`);
  }
};

const buildTransporter = () => {
  ensureEmailConfig();
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendMailSafe = async (options: nodemailer.SendMailOptions) => {
  const transporter = buildTransporter();
  await transporter.sendMail(options);
};

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const accept = req.nextUrl.searchParams.get("accept") === "1";

    if (!token) {
      return NextResponse.json({ error: "Token manquant." }, { status: 400 });
    }

    // NOTE: le client Prisma doit être régénéré pour typer ces modèles.
    // On cast en any pour éviter les erreurs tant que `prisma generate` n'a pas tourné.
    const db = prisma as any;

    const match = await db.match.findUnique({
      where: { token },
      include: { tutorOffer: true, tutorRequest: true },
    });

    if (!match) {
      return NextResponse.json({ error: "Token invalide ou expiré." }, { status: 404 });
    }

    if (match.status !== "PENDING_TUTOR") {
      return NextResponse.json({ error: "Demande déjà traitée." }, { status: 400 });
    }

    if (!accept) {
      // Le tuteur refuse : on libère l'offre, on remet la demande en attente
      await db.$transaction([
        db.match.update({
          where: { id: match.id },
          data: { status: "DECLINED" },
        }),
        db.tutorOffer.update({
          where: { id: match.tutorOfferId },
          data: { status: "DISPO" },
        }),
        db.tutorRequest.update({
          where: { id: match.tutorRequestId },
          data: { status: "EN_ATTENTE" },
        }),
      ]);
      return NextResponse.json({ success: true, message: "Refus enregistré." });
    }

    // Acceptation
    await db.$transaction([
      db.match.update({
        where: { id: match.id },
        data: { status: "CONFIRMED", confirmedAt: new Date() },
      }),
      db.tutorOffer.update({
        where: { id: match.tutorOfferId },
        data: { status: "ASSIGNE", assignments: { increment: 1 } },
      }),
      db.tutorRequest.update({
        where: { id: match.tutorRequestId },
        data: { status: "MATCH_CONFIRME" },
      }),
    ]);

    // Envoi des mails de confirmation
    const tutor = match.tutorOffer;
    const student = match.tutorRequest;
    const contact = `${tutor.contactMethod}${tutor.contactHandle ? ` (${tutor.contactHandle})` : ""}`;

    await sendMailSafe({
      from: `"CEI Tutorat" <${process.env.SMTP_USER}@helmo.be>`,
      to: student.email,
      subject: "Un tuteur a été trouvé pour votre demande",
      text: `Bonjour ${student.firstName},

Un tuteur a accepté de vous aider.
Nom du tuteur : ${tutor.firstName} ${tutor.lastName}
Contact : ${contact}

Merci et bon courage !
- CEI`,
    });

    await sendMailSafe({
      from: `"CEI Tutorat" <${process.env.SMTP_USER}@helmo.be>`,
      to: tutor.email,
      subject: "Confirmation de tutorat",
      text: `Bonjour ${tutor.firstName},

Vous avez accepté d'aider ${student.firstName} ${student.lastName}.
Merci pour votre engagement !

- CEI`,
    });

    return NextResponse.json({ success: true, message: "Match confirmé." });
  } catch (error) {
    console.error("Erreur tutorat/confirm:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}

