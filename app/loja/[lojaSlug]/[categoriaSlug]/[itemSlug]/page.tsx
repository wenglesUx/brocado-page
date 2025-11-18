// PAGINA DE ADICIONAR ITEMS AO CARRINHO
"use client";

import { useState, useMemo, useEffect } from "react";
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
import { useLojaAberta } from "../../../../hooks/useLojaAberta";
import Carousel from "../../../../../components/Carousel"; // Importando o novo componente Carousel
import Adicionais from "../../../../../components/Adicionais"; // Importando o novo componente Adicionais

// Simulação de importação de dados - MUDANÇA: Usando o JSON atualizado
import lojasData from "../../../../../mocks/loja-completa.json";

// MUDANÇA: Definindo a interface para o item com os novos campos
interface AdicionalOpcao {
  nome: string;
  preco: number;
}

interface AdicionalGrupo {
  titulo: string;
  minimo: number;
  maximo: number;
  opcoes: AdicionalOpcao[];
}

interface Item {
  id: number;
  nome: string;
  slug: string;
  nota: number;
  distancia: string;
  tempoEntrega: string;
  taxaEntrega: string;
  imagem: string;
  imagensAdicionais?: string[]; // Novo campo
  descricaoCompleta: string;
  preco: number;
  adicionais?: AdicionalGrupo[]; // Novo campo
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
  horarioAbertura: string; // Novo campo
  horarioFechamento: string; // Novo campo
  categorias: Categoria[];
}

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
  const loja = lojasData.find((l: Loja) => l.slug === lojaSlug);

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
    loja: loja as Loja,
    categoria: categoria as Categoria,
    item: item as Item,
  };
}

// MUDANÇA: Função para verificar se a loja está aberta
// function isLojaOpen(loja: Loja): boolean {
//   if (!loja.horarioAbertura || !loja.horarioFechamento) {
//     return true; // Assume aberto se não houver horário definido
//   }

//   const now = new Date();
//   const currentHours = now.getHours();
//   const currentMinutes = now.getMinutes();

//   const [openHours, openMinutes] = loja.horarioAbertura.split(':').map(Number);
//   const [closeHours, closeMinutes] = loja.horarioFechamento.split(':').map(Number);

//   const openTime = openHours * 60 + openMinutes;
//   let closeTime = closeHours * 60 + closeMinutes;
//   const currentTime = currentHours * 60 + currentMinutes;

//   // Se o fechamento for depois da meia-noite (ex: 00:00), ajusta para o dia seguinte
//   if (closeTime < openTime) {
//     closeTime += 24 * 60;
//   }

//   // Se a hora atual for antes da abertura, ou depois do fechamento
//   if (currentTime < openTime || currentTime > closeTime) {
//     return false;
//   }

//   return true;
// }


export default function ItemPage({ params }: ItemPageProps) {
  const { lojaSlug, categoriaSlug, itemSlug } = params;
  const data = getItemDetails(lojaSlug, categoriaSlug, itemSlug);
  
  const { addItem, getTotalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { selectedAddress, getFormattedAddress } = useAddress();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  // MUDANÇA: Novos estados para adicionais e observação
  const [observacao, setObservacao] = useState("");
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState({});

  if (!data) {
    notFound();
  }

  const { loja, categoria, item } = data;
  const lojaOpen = useLojaAberta(loja);

  // MUDANÇA: Cálculo do preço total (item + adicionais)
  const precoAdicionais = useMemo(() => {
    let total = 0;
    Object.values(adicionaisSelecionados).forEach((selections: AdicionalOpcao[]) => {
      selections.forEach((opcao) => {
        total += opcao.preco;
      });
    });
    return total;
  }, [adicionaisSelecionados]);

  const precoTotalItem = item.preco + precoAdicionais;
  const precoTotalCompra = precoTotalItem * quantidade;

  // MUDANÇA: Validação de adicionais obrigatórios
  const isAdicionaisValid = useMemo(() => {
    if (!item.adicionais) return true;

    return item.adicionais.every((grupo, index) => {
      const grupoId = `grupo-${index}`;
      const selections = adicionaisSelecionados[grupoId] || [];
      return grupo.minimo === 0 || selections.length >= grupo.minimo;
    });
  }, [item.adicionais, adicionaisSelecionados]);


  const handleAddToCart = () => {
    if (!lojaOpen) {
      toast.error("A loja está fechada no momento e não aceita pedidos.");
      return;
    }
    
    if (!isAdicionaisValid) {
      toast.error("Por favor, selecione todas as opções obrigatórias.");
      return;
    }

    // MUDANÇA: Adicionando adicionais e observação ao item do carrinho
    addItem(
      {
        id: item.id.toString(),
        nome: item.nome,
        preco: precoTotalItem, // Preço já com adicionais
        precoBase: item.preco, // Preço base do item
        imagem: item.imagem,
        lojaSlug,
        categoriaSlug,
        itemSlug,
        lojaNome: loja.nome,
        taxaEntrega: loja.taxaEntrega,
        adicionais: adicionaisSelecionados,
        observacao: observacao,
      },
      quantidade
    );
    
    toast.success(`${quantidade}x ${item.nome} adicionado ao carrinho!`);
    setQuantidade(1);
    setObservacao("");
    setAdicionaisSelecionados({});
  };

  // MUDANÇA: Função para formatar o preço
  const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace(".", ",")}`;

  // MUDANÇA: Combina a imagem principal com as adicionais para o carrossel
  const carouselImages = [item.imagem, ...(item.imagensAdicionais || [])];

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
              <Link href={`/loja/${loja.slug}`} style={{ color: "#007bff", textDecoration: "none" }}>
                {loja.nome}
              </Link>
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
              {/* MUDANÇA: Carrossel de imagens */}
              <div>
                <Carousel images={carouselImages} altText={item.nome} />
              </div>

              {/* Informações e ações */}
              <div>
                {/* MUDANÇA: Informações da Loja e Status */}
                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: "bold", color: "#333" }}>{loja.nome}</span>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: lojaOpen ? "#1e7e34" : "#dc3545",
                        backgroundColor: lojaOpen ? "#d4edda" : "#f8d7da",
                      }}
                    >
                      {lojaOpen ? "ABERTO" : "FECHADO"}
                    </span>
                  </div>
                </div>

                {/* MUDANÇA: Descrição do item (mais proeminente) */}
                <p style={{ fontSize: "18px", lineHeight: "1.6", marginBottom: "25px", color: "#555", borderLeft: "4px solid #a72901", paddingLeft: "10px" }}>
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
                
                {/* MUDANÇA: Componente de Adicionais */}
                <Adicionais
                  adicionais={item.adicionais}
                  onSelectionChange={setAdicionaisSelecionados}
                />

                {/* MUDANÇA: Área de Observação */}
                <div style={{ marginBottom: "25px", marginTop: "25px" }}>
                  <label htmlFor="observacao" style={{ display: "block", marginBottom: "10px", fontWeight: "500", fontSize: "16px" }}>
                    Observações (Ex: Sem cebola, ponto da carne):
                  </label>
                  <textarea
                    id="observacao"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    rows={3}
                    maxLength={255}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      resize: "none",
                      fontSize: "16px",
                    }}
                    placeholder="Digite aqui suas observações..."
                  />
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
                    <span style={{ fontSize: "16px", color: "#666" }}>Preço Base:</span>
                    <span style={{ fontSize: "24px", fontWeight: "bold", color: "#555" }}>
                      {formatPrice(item.preco)}
                    </span>
                  </div>
                  {precoAdicionais > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px dashed #ccc", paddingBottom: "10px" }}>
                      <span style={{ fontSize: "16px", color: "#666" }}>Adicionais:</span>
                      <span style={{ fontSize: "24px", fontWeight: "bold", color: "#a72901" }}>
                        +{formatPrice(precoAdicionais)}
                      </span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ fontSize: "16px", color: "#666" }}>Preço Total do Item:</span>
                    <span style={{ fontSize: "32px", fontWeight: "bold", color: "#a72901" }}>
                      {formatPrice(precoTotalItem)}
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
                    disabled={!lojaOpen || !isAdicionaisValid} // Desabilita se a loja estiver fechada ou adicionais inválidos
                    style={{
                      width: "100%",
                      padding: "18px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      backgroundColor: (!lojaOpen || !isAdicionaisValid) ? "#ccc" : "#a72901",
                      color: "#fff",
                      border: "none",
                      cursor: (!lojaOpen || !isAdicionaisValid) ? "not-allowed" : "pointer",
                    }}
                  >
                    {/* MUDANÇA: Exibindo o preço total da compra no botão */}
                    Adicionar ao Carrinho - {formatPrice(precoTotalCompra)}
                  </button>
                  {!lojaOpen && (
                    <p style={{ color: "#dc3545", textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>
                      Loja Fechada
                    </p>
                  )}
                  {!isAdicionaisValid && lojaOpen && (
                    <p style={{ color: "#dc3545", textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>
                      Selecione as opções obrigatórias
                    </p>
                  )}
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
              <Link href={`/loja/${loja.slug}`} className={styles["filter-badge"]}>
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