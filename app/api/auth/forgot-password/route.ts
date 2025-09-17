import { NextResponse } from "next/server";
import prisma from "../../../../src/utils/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "465", 10),
        secure: process.env.SMTP_SECURE === "true", // true pour SSL
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: `"CEI HELMo" <${process.env.SMTP_USER}@helmo.be>`,
        to: email,
        subject: "Réinitialisation de votre mot de passe - CEI",
        text: `Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte CEI.

Cliquez sur le lien suivant pour créer un nouveau mot de passe :
${resetUrl}

⚠️ Important :
- Ce lien est valide pendant 1 heure seulement
- Si vous n'avez pas demandé cette réinitialisation, ignorez cet email
- Ne partagez jamais ce lien avec d'autres personnes

Cet email a été envoyé automatiquement, merci de ne pas y répondre.
© ${new Date().getFullYear()} CEI - Tous droits réservés`,
        html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
    .container { background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #4f46e5; margin-bottom: 10px; }
    .title { color: #1f2937; margin-bottom: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .button:hover { background-color: #4338ca; }
    .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; color: #92400e; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">CEI HELMo</div>
      <h1 class="title">Réinitialisation de votre mot de passe</h1>
    </div>
    
    <div>
      <p>Bonjour,</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte CEI.</p>
      <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
      </div>
      <div class="warning">
        <strong>⚠️ Important :</strong>
        <ul>
          <li>Ce lien est valide pendant 1 heure seulement</li>
          <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
          <li>Ne partagez jamais ce lien avec d'autres personnes</li>
        </ul>
      </div>
      <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
      <p><a href="${resetUrl}" style="color: #4f46e5; word-break: break-all;">${resetUrl}</a></p>
    </div>
    
    <div class="footer">
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      <p>© ${new Date().getFullYear()} CEI - Tous droits réservés</p>
    </div>
  </div>
</body>
</html>`
      };

      await transporter.sendMail(mailOptions);
      console.log(`Reset password email sent to ${email}`);
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
