// SESSÃO DE EXIBIÇÃO DE ITEMS
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import styles from "../../../components/styles/Desktop.module.css";
import { useParams } from "next/navigation";

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
  categorias: Categoria[];
}

export default function LojaDetalhes() {
  const params = useParams();
  const lojaSlug = params.lojaSlug as string;
  const [loja, setLoja] = useState<Loja | null>(null);
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
        <Header showSearch={false} />
        <main>
          <div className={styles.container}>
            <p style={{ color: "red" }}>{error || "Loja não encontrada."}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header showSearch={true} />
      <main>
        {/* Banner da Loja (Simulação do topo da página de referência) */}
        <section className={styles["loja-banner"]}>
          <div className={styles.container}>
            <div className={styles["loja-header"]}>
              <div className={styles["loja-logo-container"]}>
                <Image
                  src={loja.logo}
                  alt={loja.nome}
                  width={100}
                  height={100}
                  className={styles["loja-logo"]}
                />
              </div>
              <div className={styles["loja-info"]}>
                <h1 className={styles["loja-nome"]}>{loja.nome}</h1>
                <div className={styles["loja-meta"]}>
                  <span className={styles["loja-avaliacao"]}>
                    ★ {loja.avaliacao}
                  </span>
                  <span className={styles["loja-entrega"]}>
                    {loja.tempoMedioEntrega}
                  </span>
                  <span className={styles["loja-taxa"]}>
                    {loja.taxaEntrega === "R$ 0,00" || loja.taxaEntrega === "Grátis"
                      ? "Entrega Grátis"
                      : loja.taxaEntrega}
                  </span>
                </div>
                <p className={styles["loja-endereco"]}>{loja.endereco}</p>
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
                <div className={styles["restaurant-grid"]}>
                  {categoria.itens.map((item) => (
                    <Link
                      key={item.id}
                      // A rota original era: /loja/gracibolos-doces/doces-e-bolos/torta-de-limao
                      // O novo link deve ser: /loja/[lojaSlug]/[categoriaSlug]/[itemSlug]
                      href={`/loja/${loja.slug}/${categoria.slug}/${item.slug}`}
                      className={styles["restaurant-card"]}
                    >
                      <div className={styles["restaurant-card__image"]}>
                        {item.imagem && (
                          <Image
                            src={item.imagem}
                            alt={item.nome}
                            width={92}
                            height={92}
                          />
                        )}
                      </div>

                      <div className={styles["restaurant-card__info"]}>
                        <h4 className={styles["restaurant-card__name"]}>
                          {item.nome}
                        </h4>
                        <p className={styles["restaurant-card__description"]}>
                          {item.descricaoCompleta}
                        </p>
                        <span className={styles["restaurant-card__price"]}>
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
