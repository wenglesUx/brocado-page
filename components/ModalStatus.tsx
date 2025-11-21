"use client";

import React from "react";
import styles from "./styles/Desktop.module.css";

interface Loja {
  id: string;
  slug: string;
  nome: string;
  logo: string;
  endereco: string;
  avaliacao: number;
  tempoMedioEntrega: string;
  taxaEntrega: string;
  entregaGratis: boolean;
  is24h: boolean;
  horarioAbertura: string;
  horarioFechamento: string;
  categorias: any[]; // Usando any para simplificar, pois não precisamos da estrutura completa aqui
}

interface ModalStatusProps {
  loja: Loja | null;
  onClose: () => void;
  onBackToHome: () => void;
}

const ModalStatus: React.FC<ModalStatusProps> = ({
  loja,
  onClose,
  onBackToHome,
}) => {
  if (!loja) return null;

  const is24h = loja.is24h;
  const horarioAbertura = loja.horarioAbertura;
  const horarioFechamento = loja.horarioFechamento;

  const getStatusMessage = () => {
    if (is24h) {
      return {
        title: "Estamos sempre abertos para você!",
        message: `A loja ${loja.nome} funciona 24 horas por dia. Faça seu pedido a qualquer momento!`,
        buttonText: "Ver produtos desta loja",
        onButtonClick: onClose,
      };
    } else {
      return {
        title: "Ops! Estamos fechados no momento.",
        message: `A loja ${loja.nome} abre às ${horarioAbertura} e fecha às ${horarioFechamento}. Você pode conhecer os produtos e voltar depois, quando a loja abrir.`,
        buttonText: "Ver outras lojas",
        onButtonClick: onBackToHome,
      };
    }
  };

  const { title, message, buttonText, onButtonClick } = getStatusMessage();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>
        <button className={styles.modalActionButton} onClick={onButtonClick}>
          {buttonText}
        </button>
        {!is24h && (
          <button className={styles.modalSecondaryButton} onClick={onClose}>
            Ver produtos desta loja
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalStatus;
