// Conteúdo do arquivo: page.tsx

// PAGINA PRINCIPAL DE EXIBIÇÃO DAS LOJAS
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import styles from "../../../components/styles/Desktop.module.css";
import { useParams } from "next/navigation";
import ModalStatus from "../../../components/ModalStatus";
import { Star, MapPin, Clock, Bike } from "lucide-react";

interface Item {
  id: number;
  nome: string;
  slug: string;
  nota: number;
  distancia: string;
  tempoEntrega: string;
  taxaEntrega: string;
  imagem: string;
  descricaoCompleta: string;
  preco: number;
}

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  icone: string;
  itens: Item[];
}

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
  categorias: Categoria[];
}

export default function LojaDetalhes() {
  const params = useParams();
  const lojaSlug = params.lojaSlug as string;
  const [loja, setLoja] = useState<Loja | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'closed' | '24h' | null>(null); // NOVO ESTADO
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLojaData() {
      try {
        setLoading(true);
        // Simula a busca por uma loja específica
        const res = await fetch("/api/lojas");
        if (!res.ok) {
          throw new Error("Falha ao carregar dados da API.");
        }
        const lojasData: Loja[] = await res.json();
        const lojaEncontrada = lojasData.find((l) => l.slug === lojaSlug);

        if (!lojaEncontrada) {
          setError("Loja não encontrada.");
        } else {
          setLoja(lojaEncontrada);
          
          // Lógica para mostrar o modal
          const agora = new Date();
          const horaAtual = agora.getHours() * 60 + agora.getMinutes();
          const [hAbertura, mAbertura] = lojaEncontrada.horarioAbertura.split(":").map(Number);
          const [hFechamento, mFechamento] = lojaEncontrada.horarioFechamento.split(":").map(Number);
          const minAbertura = hAbertura * 60 + mAbertura;
          let minFechamento = hFechamento * 60 + mFechamento;

          // Se o fechamento for depois da meia-noite (ex: 00:00), ajusta para o dia seguinte
          if (minFechamento < minAbertura) {
            minFechamento += 24 * 60;
          }

          let estaAberto = false;
          if (lojaEncontrada.is24h) {
            estaAberto = true;
          } else if (minAbertura <= minFechamento) {
            // Horário de abertura e fechamento no mesmo dia
            estaAberto = horaAtual >= minAbertura && horaAtual <= minFechamento;
          } else {
            // Horário de abertura em um dia e fechamento no dia seguinte (ex: 22:00 - 05:00)
            // Aberto se for depois da abertura OU antes do fechamento (no dia seguinte)
            estaAberto = horaAtual >= minAbertura || horaAtual <= minFechamento;
          }

          // LÓGICA ATUALIZADA PARA O MODAL
          if (!estaAberto) {
            console.log("Loja fechada. Exibindo modal de fechamento.");
            setModalType('closed');
            setShowModal(true);
          } else if (lojaEncontrada.is24h) {
            console.log("Loja 24h. Exibindo modal informativo.");
            setModalType('24h');
            setShowModal(true);
          } else {
            console.log("Loja aberta. Não exibindo modal.");
            setModalType(null);
            setShowModal(false); // Garante que o modal não está visível
          }
        }
      } catch (e) {
        console.error("Erro ao carregar mock da API:", e);
        setError("Erro ao carregar dados. Verifique o console para detalhes.");
      } finally {
        setLoading(false);
      }
    }

    if (lojaSlug) {
      fetchLojaData();
    }
  }, [lojaSlug]);

  if (loading) {
    return (
      <>
        <Header showSearch={false} />
        <main>
          <div className={styles.container}>
            <p>Carregando detalhes da loja...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !loja) {
    return (
      <>
        <Header/>
        <main>
          <div className={styles.container}>
            <p style={{ color: "red" }}>{error || "Loja não encontrada."}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isLojaAberta = () => {
    if (loja.is24h) return true;

    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    const [hAbertura, mAbertura] = loja.horarioAbertura.split(":").map(Number);
    const [hFechamento, mFechamento] = loja.horarioFechamento.split(":").map(Number);
    const minAbertura = hAbertura * 60 + mAbertura;
    let minFechamento = hFechamento * 60 + mFechamento;

    if (minFechamento < minAbertura) {
      minFechamento += 24 * 60;
    }

    if (minAbertura <= minFechamento) {
      return horaAtual >= minAbertura && horaAtual <= minFechamento;
    } else {
      return horaAtual >= minAbertura || horaAtual <= minFechamento;
    }
  };

  const estaAberta = isLojaAberta();

  return (
    <>
      {/* RENDERIZAÇÃO DO MODAL ATUALIZADA */}
      {showModal && modalType && (
        <ModalStatus
          loja={loja}
          modalType={modalType} // NOVO PROP
          onClose={() => setShowModal(false)}
          onBackToHome={() => {
            // Redirecionar para a página de seleção de restaurantes (Home)
            window.location.href = "/";
          }}
        />
      )}
      <Header showSearch={true} />
      <main>
        {/* Banner da Loja (Simulação do topo da página de referência) */}
        <section className={styles["loja-banner"]}>
          <div className={styles.container}>
            <div className={styles["loja-header-remodelado"]}>
              <div className={styles["loja-logo-container"]}>
                <Image
                  src={loja.logo}
                  alt={loja.nome}
                  width={120}
                  height={120}
                  className={styles["loja-logo"]}
                />
              </div>
              <div className={styles["loja-info-remodelado"]}>

                <div className={styles["info-main"]}>
                
                  <h1 className={styles["loja-nome"]}>{loja.nome}</h1>
                    <h3 className={styles["loja-status"]}>
                      {estaAberta ? "Aberto" : "Fechado"}
                      {loja.is24h && " (24h)"}
                    </h3>
                </div>
                
                <div className={styles["loja-meta-remodelado"]}>
  
                    {/* Avaliação */}
                    <span className={styles["loja-avaliacao"]}>
                      <Star size={16} className={styles["icone"]} />
                      {loja.avaliacao}
                    </span>

                    {/* Endereço */}
                    <span className={styles["loja-endereco"]}>
                      <MapPin size={16} className={styles["icone"]} />
                      {loja.endereco}
                    </span>

                    {/* Horário */}
                    <span className={styles["loja-horario"]}>
                      <Clock size={16} className={styles["icone"]} />
                      {loja.is24h
                        ? "Aberto 24h"
                        : `Abre às ${loja.horarioAbertura} - Fecha às ${loja.horarioFechamento}`}
                    </span>

                    {/* Tempo de entrega */}
                    <span className={styles["loja-entrega"]}>
                      <Bike size={16} className={styles["icone"]} />
                      {loja.tempoMedioEntrega}
                    </span>

                    {/* Taxa de entrega (sem ícone) */}
                    <span className={styles["loja-taxa"]}>
                      {loja.taxaEntrega === "R$ 0,00" || loja.taxaEntrega === "Grátis"
                        ? "Entrega Grátis"
                        : loja.taxaEntrega}
                    </span>

                  </div>

              </div>
            </div>
          </div>
        </section>
        {/* Seção de Produtos */}
        <section className={styles["loja-produtos"]}>
          <div className={styles.container}>
            <h2 className={styles["loja-produtos__title"]}>Cardápio</h2>
            <hr className={styles["restaurants-section__divider"]} />

            {loja.categorias.map((categoria) => (
              <div key={categoria.id} className={styles["categoria-section"]}>
                <h3 className={styles["categoria-title"]}>{categoria.nome}</h3>
                <div className={`${styles["restaurant-grid"]} ${styles["items-grid"]}`}>
                  {categoria.itens.map((item) => (
                    <Link
                      key={item.id}
                      href={`/loja/${loja.slug}/${categoria.slug}/${item.slug}`}
                      className={styles["item-card"]}
                    >
                      <div className={styles["item-card__image"]}>
                        <Image
                          src={item.imagem}
                          alt={item.nome}
                          width={100}
                          height={100}
                        />
                      </div>

                      <div className={styles["item-card__content"]}>
                        <h4 className={styles["item-card__name"]}>{item.nome}</h4>

                        <div className={styles["item-card__meta"]}>
                          <span className={styles["item-card__rating"]}>⭐ {item.nota}</span>
                          <span className={styles["item-card__category"]}>{categoria.nome}</span>
                          <span className={styles["item-card__distance"]}>{item.distancia}</span>
                        </div>

                        <div className={styles["item-card__delivery"]}>
                          <span>{item.tempoEntrega}</span>
                          <span>{item.taxaEntrega}</span>
                        </div>

                        <span className={styles["item-card__price"]}>
                          R$ {item.preco.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
