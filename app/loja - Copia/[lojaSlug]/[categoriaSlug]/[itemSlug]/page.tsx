"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "../../../../../components/styles/Desktop.module.css";
import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import { useCart } from "../../../../contexts/CartContext";
import { useAuth } from "../../../../contexts/AuthContext";
import { useAddress } from "../../../../contexts/AddressContext";
import { toast } from "sonner";

// Simulação de importação de dados
import lojasData from "../../../../../mocks/loja-completa.json";

interface ItemPageProps {
  params: {
    lojaSlug: string;
    categoriaSlug: string;
    itemSlug: string;
  };
}

// Função para buscar o item específico
function getItemDetails(lojaSlug: string, categoriaSlug: string, itemSlug: string) {
  // 1. Encontrar a loja
  const loja = lojasData.find((l) => l.slug === lojaSlug);

  if (!loja) {
    return null;
  }

  // 2. Encontrar a categoria
  const categoria = loja.categorias.find(
    (cat) => cat.slug === categoriaSlug
  );

  if (!categoria) {
    return null;
  }

  // 3. Encontrar o item
  const item = categoria.itens.find((i) => i.slug === itemSlug);

  if (!item) {
    return null;
  }

  return {
    loja: loja,
    categoria: categoria,
    item: item,
  };
}

export default function ItemPage({ params }: ItemPageProps) {
  const { lojaSlug, categoriaSlug, itemSlug } = params;
  const data = getItemDetails(lojaSlug, categoriaSlug, itemSlug);
  
  const { addItem, getTotalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { selectedAddress, getFormattedAddress } = useAddress();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [quantidade, setQuantidade] = useState(1);

  if (!data) {
    notFound();
  }

  const { loja, categoria, item } = data;

  const handleAddToCart = () => {
    addItem(
      {
        id: item.id.toString(),
        nome: item.nome,
        preco: item.preco,
        imagem: item.imagem,
        lojaSlug,
        categoriaSlug,
        itemSlug,
        lojaNome: loja.nome,
        taxaEntrega: loja.taxaEntrega,
      },
      quantidade
    );
    
    toast.success(`${quantidade}x ${item.nome} adicionado ao carrinho!`);
    setQuantidade(1);
  };

  return (
    <>
       <Header showSearch={false} />


      <main>
        <section className={styles["restaurants-section"]}>
          <div className={styles.container}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: "20px", fontSize: "14px", color: "#666" }}>
              <Link href="/" style={{ color: "#007bff", textDecoration: "none" }}>
                Início
              </Link>
              {" > "}
              <span>{loja.nome}</span>
              {" > "}
              <span>{categoria.nome}</span>
              {" > "}
              <span style={{ fontWeight: "500", color: "#333" }}>{item.nome}</span>
            </div>

            <h2 className={styles["restaurants-section__title"]}>
              {item.nome}
            </h2>
            <hr className={styles["restaurants-section__divider"]} />

            <div className={styles["grid-cart-items"]}>
              {/* Imagem do produto */}
              <div>
                {item.imagem && (
                  <Image
                    src={item.imagem}
                    alt={item.nome}
                    width={500}
                    height={500}
                    style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "12px" }}
                  />
                )}
              </div>

              {/* Informações e ações */}
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "6px",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    {categoria.nome}
                  </span>
                </div>

                <p style={{ fontSize: "18px", lineHeight: "1.6", marginBottom: "25px", color: "#555" }}>
                  {item.descricaoCompleta || "Descrição detalhada não disponível."}
                </p>

                <div className={styles["restaurant-card__meta"]} style={{ marginBottom: "25px" }}>
                  <div className={styles.rating}>
                    <div className={styles["star-icon"]}>
                      <div className={styles["star-icon__background"]}></div>
                      <div className={styles["star-icon__foreground"]}></div>
                    </div>
                    <span>{item.nota}</span>
                  </div>

                  <Image
                    src="/images/I2_3875_2_3863.svg"
                    alt=""
                    className={styles["separator-dot"]}
                    width={3}
                    height={3}
                  />
                  <span>{loja.tempoMedioEntrega}</span>
                  <Image
                    src="/images/I2_3875_2_3866.svg"
                    alt=""
                    className={styles["separator-dot"]}
                    width={3}
                    height={3}
                  />
                  <span>{loja.taxaEntrega}</span>
                </div>

                <div
                  style={{
                    padding: "25px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "10px",
                    marginBottom: "25px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ fontSize: "16px", color: "#666" }}>Preço:</span>
                    <span style={{ fontSize: "32px", fontWeight: "bold", color: "#a72901" }}>
                      R$ {item.preco.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "10px", fontWeight: "500" }}>
                      Quantidade:
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <button
                        onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                        className={styles["filter-badge"]}
                        style={{ padding: "10px 20px", fontSize: "18px" }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: "24px", fontWeight: "bold", minWidth: "40px", textAlign: "center" }}>
                        {quantidade}
                      </span>
                      <button
                        onClick={() => setQuantidade(quantidade + 1)}
                        className={styles["filter-badge"]}
                        style={{ padding: "10px 20px", fontSize: "18px" }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={styles["filter-badge"]}
                    style={{
                      width: "100%",
                      padding: "18px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      backgroundColor: "#a72901",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    Adicionar ao Carrinho - R$ {(item.preco * quantidade).toFixed(2).replace(".", ",")}
                  </button>
                </div>

                <div style={{ fontSize: "14px", color: "#666" }}>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Loja:</strong> {loja.nome}
                  </p>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Endereço:</strong> {loja.endereco}
                  </p>
                  <p>
                    <strong>Avaliação:</strong> ⭐ {loja.avaliacao}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/" className={styles["filter-badge"]}>
                ← Voltar para a loja
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}


