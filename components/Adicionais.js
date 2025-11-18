
"use client";

import { useState, useMemo } from "react";
import styles from "./styles/Desktop.module.css";

function formatPrice(price) {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
}

export default function Adicionais({ adicionais, onSelectionChange }) {
  const [selecoes, setSelecoes] = useState({});

  // Função para lidar com a seleção de uma opção
  const handleOptionChange = (grupoIndex, opcaoIndex, isChecked, min, max) => {
    const grupo = adicionais[grupoIndex];
    const opcao = grupo.opcoes[opcaoIndex];
    const grupoId = `grupo-${grupoIndex}`;

    setSelecoes((prevSelecoes) => {
      const currentSelections = prevSelecoes[grupoId] || [];
      let newSelections;

      if (grupo.maximo === 1) {
        // Seleção única (radio button-like behavior)
        newSelections = isChecked ? [opcao] : [];
      } else {
        // Múltipla seleção (checkbox-like behavior)
        if (isChecked) {
          // Adicionar, mas verificar o máximo
          if (currentSelections.length < max) {
            newSelections = [...currentSelections, opcao];
          } else {
            // Se tentar adicionar mais do que o máximo, retorna o estado anterior
            return prevSelecoes;
          }
        } else {
          // Remover
          newSelections = currentSelections.filter((s) => s.nome !== opcao.nome);
        }
      }

      const updatedSelecoes = {
        ...prevSelecoes,
        [grupoId]: newSelections,
      };

      // Notificar o componente pai sobre a mudança
      onSelectionChange(updatedSelecoes);

      return updatedSelecoes;
    });
  };

  // Renderiza um grupo de adicionais
  const renderGrupo = (grupo, grupoIndex) => {
    const grupoId = `grupo-${grupoIndex}`;
    const currentSelections = selecoes[grupoId] || [];
    const isSingleSelection = grupo.maximo === 1;
    const isRequired = grupo.minimo > 0;
    const isMaxReached = currentSelections.length >= grupo.maximo;

    return (
      <div key={grupoIndex} style={{ marginBottom: "30px", border: "1px solid #eee", borderRadius: "8px", padding: "15px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", color: "#333" }}>
          {grupo.titulo}
        </h3>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
          {isRequired ? "Escolha 1 opção (Obrigatório)" : `Escolha até ${grupo.maximo} opção(ões) (Opcional)`}
        </p>

        {grupo.opcoes.map((opcao, opcaoIndex) => {
          const isSelected = currentSelections.some((s) => s.nome === opcao.nome);
          const isDisabled = !isSelected && isMaxReached && !isSingleSelection;
          const inputType = isSingleSelection ? "radio" : "checkbox";

          return (
            <div
              key={opcaoIndex}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #f5f5f5",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.6 : 1,
              }}
              onClick={() => {
                if (!isDisabled) {
                  handleOptionChange(grupoIndex, opcaoIndex, !isSelected, grupo.minimo, grupo.maximo);
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type={inputType}
                  id={`${grupoId}-${opcaoIndex}`}
                  name={grupoId}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={(e) => handleOptionChange(grupoIndex, opcaoIndex, e.target.checked, grupo.minimo, grupo.maximo)}
                  style={{ marginRight: "10px", transform: "scale(1.2)" }}
                />
                <label htmlFor={`${grupoId}-${opcaoIndex}`} style={{ fontSize: "16px", color: "#333", cursor: "pointer" }}>
                  {opcao.nome}
                </label>
              </div>
              {opcao.preco > 0 && (
                <span style={{ fontSize: "16px", fontWeight: "500", color: "#a72901" }}>
                  +{formatPrice(opcao.preco)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!adicionais || adicionais.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 className={styles["restaurants-section__title"]} style={{ borderBottom: "2px solid #a72901", paddingBottom: "10px", marginBottom: "20px" }}>
        Adicionais
      </h2>
      {adicionais.map(renderGrupo)}
    </div>
  );
}

