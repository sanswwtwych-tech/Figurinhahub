import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt é obrigatório" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    const enhancedPrompt = `Create a high-quality die-cut sticker of: ${prompt}. 
Style: ${style || "cartoon"}. 
Requirements: transparent background, clean bold outlines, vibrant colors, centered composition, suitable for WhatsApp/Telegram stickers, no text unless requested, square format.`;

    if (apiKey) {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: enhancedPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("OpenAI error:", data);
        return NextResponse.json(
          { error: data.error?.message || "Erro na geração com OpenAI" },
          { status: 500 }
        );
      }

      const imageUrl = data.data?.[0]?.url;
      if (!imageUrl) {
        return NextResponse.json({ error: "Nenhuma imagem retornada" }, { status: 500 });
      }

      return NextResponse.json({ imageUrl, prompt: enhancedPrompt });
    }

    // Placeholder quando não tem chave configurada
    return NextResponse.json({
      imageUrl: "https://placehold.co/512x512/7c3aed/ffffff?text=Sticker+AI%0AConfigure+sua+API+Key",
      prompt: enhancedPrompt,
      warning: "Nenhuma chave de IA configurada. Adicione OPENAI_API_KEY nas variáveis de ambiente da Vercel.",
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar figurinha" },
      { status: 500 }
    );
  }
}
