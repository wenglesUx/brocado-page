import { NextResponse } from "next/server";
// Usando require para importação síncrona
const lojasData = require("../../../mocks/loja-completa.json");

export async function GET() {
  try {
    const todosProdutos = lojasData.flatMap((loja: any) => {
      return loja.categorias.flatMap((categoria: any) => {
        return categoria.itens.map((item: any) => ({
          ...item,
          categoria: categoria.nome, // Adiciona o nome da categoria para compatibilidade
          slugCategoria: categoria.slug, // Adiciona o slug da categoria para roteamento
          slugLoja: loja.slug, // Adiciona o slug da loja para roteamento
          nomeLoja: loja.nome, // Adiciona o nome da loja para exibição
          distancia: loja.endereco, // Usando o endereço como mock de distância/localização
          tempoEntrega: loja.tempoMedioEntrega,
          taxaEntrega: loja.taxaEntrega
        }));
      });
    });

    return NextResponse.json(todosProdutos);
  } catch (error) {
    console.error("Erro ao processar produtos:", error);
    // Retorna um erro 500 com uma mensagem de erro
    return new NextResponse(JSON.stringify({ error: "Erro interno do servidor ao processar produtos." }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}
