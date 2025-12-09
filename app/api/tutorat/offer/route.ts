import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import nodemailer from "nodemailer";

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

const sendMailSafe = async (options: nodemailer.SendMailOptions) => {
  const transporter = buildTransporter();
  await transporter.sendMail(options);
};

export async function POST(req: Request) {
  try {
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

    const tutorOffer = await prisma.tutorOffer.create({
      data: {
        firstName,
        lastName,
        email,
        contactMethod,
        contactHandle: contactHandle || null,
        cursus,
        courses: courseList,
        details: details || null,
        status: "DISPO",
      },
    });

    await sendMailSafe({
      from: `"CEI Tutorat" <${process.env.SMTP_USER}@helmo.be>`,
      to: tutorOffer.email,
      subject: "Merci de vous proposer comme tuteur",
      text: `Bonjour ${tutorOffer.firstName},

Merci de proposer votre aide en tutorat.
Cursus : ${cursus}
Cours où vous pouvez aider : ${courseList.join(", ")}
Contact préféré : ${contactMethod}${contactHandle ? ` (${contactHandle})` : ""}

Nous vous contacterons lorsqu'un étudiant correspondant à votre profil aura besoin d'aide.

- CEI`,
    });

    // Optionnel : tenter un match simple avec une demande en attente
    const pendingRequest = await prisma.tutorRequest.findFirst({
      where: { status: "EN_ATTENTE", cursus },
      orderBy: { createdAt: "asc" },
    });

    if (pendingRequest) {
      const reqCourses = Array.isArray(pendingRequest.courses)
        ? (pendingRequest.courses as string[])
        : [];
      const intersect = reqCourses.some((c) => courseList.includes(c));
      if (intersect) {
        // Laisser la route /api/tutorat/request créer le match quand elle reçoit une demande.
        // Ici on met seulement la demande en priorité en laissant l'offre dispo.
      }
    }

    return NextResponse.json({ success: true, status: "DISPO" }, { status: 201 });
  } catch (error) {
    console.error("Erreur tutorat/offer:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}

