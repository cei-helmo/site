import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

type ContactMethod = "MAIL" | "TEAMS" | "DISCORD";
type Cursus = "DEV_APPS" | "SEC_SY" | "AI";

// Autorise helmo.be et hepl.be (y compris sous-domaines type student.hepl.be)
const EDU_EMAIL = /@([^.]+\.)?(helmo|hepl)\.be$/i;

const COURSE_MAP: Record<Cursus, string[]> = {
  DEV_APPS: [
    "Algorithmique",
    "Programmation procédurale",
    "Programmation orientée objet",
    "Bases de données",
    "Systèmes d'exploitation",
    "Réseaux",
    "Mathématiques discrètes",
  ],
  SEC_SY: [
    "Algorithmique",
    "Sécurité informatique (intro)",
    "Programmation",
    "Bases de données",
    "Réseaux",
    "Mathématiques",
  ],
  AI: [
    "Algorithmique",
    "Programmation",
    "Bases de données",
    "Réseaux",
    "Mathématiques",
    "Probabilités / Statistiques",
  ],
};

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

const isValidCourses = (cursus: Cursus, courses: unknown): courses is string[] => {
  if (!Array.isArray(courses)) return false;
  const allowed = new Set(COURSE_MAP[cursus]);
  return courses.length > 0 && courses.every((c) => typeof c === "string" && allowed.has(c));
};

const isEduEmail = (email: string) => EDU_EMAIL.test(email);

const pickOfferMatch = async (cursus: Cursus, courses: string[]) => {
  const db = prisma as any; // Prisma doit être régénéré après mise à jour du schéma
  // Récupère les tuteurs dispo du même cursus et filtre côté code sur l'intersection des cours.
  const offers = await db.tutorOffer.findMany({
    where: { status: "DISPO", cursus },
    orderBy: [{ assignments: "asc" }, { createdAt: "asc" }],
  });

  let selected = null as (typeof offers)[number] | null;
  for (const offer of offers) {
    const offerCourses = Array.isArray(offer.courses) ? (offer.courses as string[]) : [];
    const intersect = offerCourses.some((c) => courses.includes(c));
    if (intersect) {
      selected = offer;
      break;
    }
  }
  return selected;
};

const sendMailSafe = async (options: nodemailer.SendMailOptions) => {
  const transporter = buildTransporter();
  await transporter.sendMail(options);
};

export async function POST(req: Request) {
  try {
    const db = prisma as any; // Prisma doit être régénéré après mise à jour du schéma
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      contactMethod,
      contactHandle,
      cursus,
      courses,
      details,
    } = body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      contactMethod?: ContactMethod;
      contactHandle?: string;
      cursus?: Cursus;
      courses?: unknown;
      details?: string;
    };

    // Validations
    if (!firstName || !lastName) {
      return NextResponse.json({ error: "Prénom et nom sont requis." }, { status: 400 });
    }
    if (!email || !isEduEmail(email)) {
      return NextResponse.json({ error: "Email étudiant requis (helmo.be ou hepl.be)." }, { status: 400 });
    }
    if (!contactMethod || !["MAIL", "TEAMS", "DISCORD"].includes(contactMethod)) {
      return NextResponse.json({ error: "Méthode de contact invalide." }, { status: 400 });
    }
    if (contactMethod === "DISCORD" && !contactHandle) {
      return NextResponse.json({ error: "Pseudo Discord requis quand Discord est sélectionné." }, { status: 400 });
    }
    if (!cursus || !["DEV_APPS", "SEC_SY", "AI"].includes(cursus)) {
      return NextResponse.json({ error: "Cursus invalide." }, { status: 400 });
    }
    if (!isValidCourses(cursus as Cursus, courses)) {
      return NextResponse.json({ error: "Sélection de cours invalide." }, { status: 400 });
    }

    const courseList = courses as string[];

    // Crée la demande
    const tutorRequest = await db.tutorRequest.create({
      data: {
        firstName,
        lastName,
        email,
        contactMethod,
        contactHandle: contactHandle || null,
        cursus,
        courses: courseList,
        details: details || null,
        status: "EN_ATTENTE",
      },
    });

    // Tente un match immédiat
    const offer = await pickOfferMatch(cursus as Cursus, courseList);
    if (offer) {
      const token = crypto.randomUUID();
      await db.match.create({
        data: {
          tutorRequestId: tutorRequest.id,
          tutorOfferId: offer.id,
          status: "PENDING_TUTOR",
          token,
        },
      });
      await db.tutorRequest.update({
        where: { id: tutorRequest.id },
        data: { status: "MATCH_PROPOSE" },
      });
      await db.tutorOffer.update({
        where: { id: offer.id },
        data: { status: "PROPOSE" },
      });

      // Mail au tuteur pour confirmation
      await sendMailSafe({
        from: `"CEI Tutorat" <${process.env.SMTP_USER}@helmo.be>`,
        to: offer.email,
        subject: `Demande de tutorat pour ${tutorRequest.firstName} ${tutorRequest.lastName}`,
        text: `Bonjour ${offer.firstName},

Un étudiant (${tutorRequest.firstName} ${tutorRequest.lastName}) a besoin d'aide.
Cursus : ${cursus}
Cours demandés : ${courseList.join(", ")}
Contact préféré : ${contactMethod}${contactHandle ? ` (${contactHandle})` : ""}

Voulez-vous devenir tuteur pour cet étudiant ?
Confirmer : ${process.env.APP_BASE_URL || "http://localhost:3000"}/api/tutorat/confirm?token=${token}&accept=1
Refuser : ${process.env.APP_BASE_URL || "http://localhost:3000"}/api/tutorat/confirm?token=${token}&accept=0

Merci pour votre aide !
- CEI`,
      });
    }

    // Mail de récap au tutoré
    await sendMailSafe({
      from: `"CEI Tutorat" <${process.env.SMTP_USER}@helmo.be>`,
      to: tutorRequest.email,
      subject: "Votre demande de tutorat a bien été reçue",
      text: `Bonjour ${tutorRequest.firstName},

Nous avons reçu votre demande de tutorat.
Cursus : ${cursus}
Cours demandés : ${courseList.join(", ")}
Contact préféré : ${contactMethod}${contactHandle ? ` (${contactHandle})` : ""}

Vous recevrez un second email dès qu'un tuteur sera confirmé.

- CEI`,
    });

    return NextResponse.json(
      { success: true, status: offer ? "MATCH_PROPOSE" : "EN_ATTENTE" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur tutorat/request:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}

