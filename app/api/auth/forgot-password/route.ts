import { NextResponse } from "next/server";
import prisma from "../../../../src/utils/prisma";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../../../../src/utils/email";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return NextResponse.json(
        { message: "If an account with that email exists, we've sent a password reset link." },
        { status: 200 }
      );
    }

    // Générer un token de reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token en base de données
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Envoyer l'email de reset
    try {
      await sendResetPasswordEmail(email, resetToken);
    } catch (emailError) {
      console.error("Error sending reset email:", emailError);
      // Même si l'email échoue, on ne révèle pas l'erreur pour la sécurité
    }

    return NextResponse.json(
      { message: "If an account with that email exists, we've sent a password reset link." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
