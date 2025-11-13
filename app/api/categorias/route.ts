import { NextResponse } from "next/server";
// Usando require para importação síncrona, que é mais comum para JSONs grandes em APIs de mock
const lojasData = require("../../../mocks/loja-completa.json");

export async function GET() {
  try {
    // Coleta todas as categorias de todas as lojas, garantindo unicidade pelo slug
    const categoriasMap = new Map();

    lojasData.forEach((loja: any) => {
      loja.categorias.forEach((categoria: any) => {
        if (!categoriasMap.has(categoria.slug)) {
          categoriasMap.set(categoria.slug, {
            id: categoria.id,
            nome: categoria.nome,
            icone: categoria.icone,
            slug: categoria.slug,
          });
        }
      });
    });

    const categorias = Array.from(categoriasMap.values());

    return NextResponse.json(categorias);
  } catch (error) {
    console.error("Erro ao processar categorias:", error);
    // Retorna um erro 500 com uma mensagem de erro
    return new NextResponse(JSON.stringify({ error: "Erro interno do servidor ao processar categorias." }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}
