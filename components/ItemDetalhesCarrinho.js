import React from 'react';

function formatPrice(price) {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
}

export default function ItemDetalhesCarrinho({ item }) {
  const { adicionais, observacao, precoBase } = item;

  // Função para formatar os adicionais para exibição
  const formatAdicionais = () => {
    if (!adicionais || Object.keys(adicionais).length === 0) {
      return null;
    }

    const grupos = Object.keys(adicionais).map((grupoId) => {
      const selecoes = adicionais[grupoId];
      if (selecoes.length === 0) return null;

      // O grupoId é no formato "grupo-X", onde X é o índice.
      // Para exibir o título, precisaríamos do JSON original, mas como não o temos aqui,
      // vamos apenas listar as opções selecionadas.
      // Se o item.adicionais original estivesse disponível, poderíamos fazer:
      // const grupoOriginal = item.adicionais.find(g => g.titulo === ...);

      return selecoes.map((opcao, index) => (
        <li key={`${grupoId}-${index}`} style={{ fontSize: "13px", color: "#444", marginLeft: "15px", listStyleType: "disc" }}>
          {opcao.nome}
          {opcao.preco > 0 && (
            <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
              (+{formatPrice(opcao.preco)})
            </span>
          )}
        </li>
      ));
    }).flat().filter(Boolean);

    if (grupos.length === 0) return null;

    return (
      <div style={{ marginTop: "5px", marginBottom: "10px", paddingLeft: "5px", borderLeft: "2px solid #a72901" }}>
        <p style={{ fontSize: "14px", fontWeight: "bold", color: "#a72901", marginBottom: "5px" }}>Opções Selecionadas:</p>
        <ul style={{ margin: 0, padding: 0 }}>
          {grupos}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "5px" }}>
      {formatAdicionais()}

      {observacao && observacao.trim() !== "" && (
        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#fffbe6", border: "1px solid #ffe58f", borderRadius: "4px" }}>
          <p style={{ fontSize: "14px", fontWeight: "bold", color: "#8c6e00", marginBottom: "3px" }}>Observação:</p>
          <p style={{ fontSize: "13px", color: "#8c6e00", margin: 0 }}>{observacao}</p>
        </div>
      )}
    </div>
  );
}
