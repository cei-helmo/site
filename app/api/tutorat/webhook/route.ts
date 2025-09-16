import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, discord, details, departement, activeTab } = body;

    // Validate required fields
    if (!name || !email || !details) {
      return NextResponse.json(
        { error: "Les champs nom, email et détails sont obligatoires" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Get environment variables (server-side only)
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const roleIdTutoree = process.env.DISCORD_ROLE_ID_TUTOREE;
    const roleIdOther = process.env.DISCORD_ROLE_ID_OTHER;

    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "Configuration Discord manquante" },
        { status: 500 }
      );
    }

    const roleId = activeTab === "tutoree" ? roleIdTutoree : roleIdOther;

    if (!roleId) {
      console.error(`Role ID for ${activeTab} is not configured`);
      return NextResponse.json(
        { error: "Configuration des rôles Discord manquante" },
        { status: 500 }
      );
    }

    // Create Discord payload
    const payload = {
      content: `Nouvelle inscription : <@&${roleId}>`,
      embeds: [
        {
          title: "Détails de l'inscription",
          color: activeTab === "tutoree" ? 0x3498db : 0x2ecc71,
          author: { name: "Programme de Tutorat" },
          fields: [
            {
              name: "Nom",
              value: `${name}`,
              inline: false,
            },
            {
              name: "Email",
              value: `${email}`,
              inline: false,
            },
            {
              name: "Discord",
              value: `${discord || "Non fourni"}`,
              inline: false,
            },
            {
              name: "Détails",
              value: `${details}`,
              inline: false,
            },
            {
              name: "Département",
              value: `${departement || "Non fourni"}`,
              inline: false,
            },
            {
              name: "Type d'inscription",
              value: activeTab === "tutoree" ? "Tutoré (B1)" : "Tuteur (B2/B3)",
              inline: false,
            },
          ],
          description:
            "Voici les détails de l'inscription à notre programme de tutorat.\n\nNous vous remercions de votre inscription et nous vous contacterons bientôt pour vous fournir des informations supplémentaires.",
          footer: {
            text: "Programme de Tutorat - CEI HELMo",
            icon_url: "https://cdn.discordapp.com/icons/your-server-id/your-icon.png", // Replace with actual Discord server icon
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Send to Discord webhook
    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error(`Discord webhook error: ${discordResponse.status} - ${errorText}`);
      
      // Provide specific error messages based on status code
      if (discordResponse.status === 401) {
        return NextResponse.json(
          { error: "Erreur d'authentification Discord" },
          { status: 500 }
        );
      } else if (discordResponse.status === 404) {
        return NextResponse.json(
          { error: "Webhook Discord introuvable" },
          { status: 500 }
        );
      } else if (discordResponse.status === 429) {
        return NextResponse.json(
          { error: "Limite de taux Discord atteinte, veuillez réessayer plus tard" },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { error: `Erreur Discord: ${discordResponse.status}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Inscription envoyée avec succès" 
    });

  } catch (error) {
    console.error("Error in tutorat webhook API:", error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Données invalides reçues" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
