import { NextResponse } from "next/server";
// Usando require para importação síncrona
const lojasData = require("../../../mocks/loja-completa.json");

export async function GET() {
  try {
    // Retorna a lista completa de lojas
    return NextResponse.json(lojasData);
  } catch (error) {
    console.error("Erro ao processar lojas:", error);
    // Retorna um erro 500 com uma mensagem de erro
    return new NextResponse(JSON.stringify({ error: "Erro interno do servidor ao processar lojas." }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}
