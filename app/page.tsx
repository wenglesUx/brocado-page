"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "../components/styles/Desktop.module.css";
import { useCarousel } from "../hooks/useCarousel";
import { useCart } from "./contexts/CartContext";
import { useAuth } from "./contexts/AuthContext";
import { useAddress } from "./contexts/AddressContext";

export default function Desktop() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loja, setLoja] = useState<any>(null); // Agora armazena a primeira loja da lista
  const [categorias, setCategorias] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Novo estado para erro
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 9;
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  // Hooks dos contexts
  const { getTotalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { selectedAddress, getFormattedAddress } = useAddress();

    // Estados para controlar dropdowns dos filtros
  const [dropdownOrdenar, setDropdownOrdenar] = useState(false);
  const [dropdownValeRefeicao, setDropdownValeRefeicao] = useState(false);
  const [dropdownDistancia, setDropdownDistancia] = useState(false);



  const {
    sliderRef,
    isDragging,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useCarousel(200, 2500);

  // 🚀 Busca dados mockados
  useEffect(() => {
    async function fetchMockData() {
      try {
        const [lojaRes, catRes, prodRes] = await Promise.all([
          fetch("/api/lojas"),
          fetch("/api/categorias"),
          fetch("/api/produtos"),
        ]);

        if (!lojaRes.ok || !catRes.ok || !prodRes.ok) {
          throw new Error("Falha ao carregar dados de uma ou mais APIs.");
        }

        const lojasData = await lojaRes.json();
        const lojaData = lojasData[0]; // Pega a primeira loja para o cabeçalho
        const catData = await catRes.json();
        const prodData = await prodRes.json();

        setLoja(lojaData);
        setCategorias(catData);
        setProdutos(prodData);
        setProdutosFiltrados(prodData); // inicial: todos os produtos
      } catch (e) {
        console.error("Erro ao carregar mock da API:", e);
        setError("Erro ao carregar dados. Verifique o console para detalhes.");
      } finally {
        setLoading(false);
      }
    }

    fetchMockData();
  }, []);

  // 📦 Lógica de paginação
  const indiceInicial = (paginaAtual - 1) * produtosPorPagina;
  const indiceFinal = indiceInicial + produtosPorPagina;
  const produtosExibidos = produtosFiltrados.slice(indiceInicial, indiceFinal);

  // 🧠 Função de filtro
  const aplicarFiltro = (tipo: string, valor?: any) => {
    let filtrados = produtos;

    switch (tipo) {
      case "Entrega grátis":
        filtrados = produtos.filter((p) => p.taxaEntrega === "Grátis");
        break;
      case "Valor mínimo":
        filtrados = produtos.filter((p) => p.precoMinimo && p.precoMinimo <= 20);
        break;
      case "Entrega parceira":
        filtrados = produtos.filter((p) => p.parceiro === true);
        break;
      case "Promoções":
        filtrados = produtos.filter((p) => p.promocao === true);
        break;
      case "Super restaurantes":
        filtrados = produtos.filter((p) => p.nota >= 4.8);
        break;
      case "Ordenar":
        // Ordenação
        if (valor === "promocoes") {
          filtrados = produtos.filter((p) => p.promocao === true);
        } else if (valor === "valor-minimo") {
          filtrados = produtos.filter((p) => p.precoMinimo && p.precoMinimo <= 20);
        }
        break;
      case "Vale refeição":
        // Filtro por tipo de vale refeição
        filtrados = produtos.filter((p) => p.valeRefeicao && p.valeRefeicao.includes(valor));
        break;
      case "Distância":
        // Filtro por distância (assumindo que produtos têm campo distancia em km)
        filtrados = produtos.filter((p) => p.distancia && p.distancia <= valor);
        break;
      case "reset":
        filtrados = produtos; // volta todos os produtos
        setBusca(""); // limpa o campo de busca
        setCategoriaAtiva(null); // limpa o filtro de categoria
        break;

      default:
        filtrados = produtos;
    }

    setProdutosFiltrados(filtrados);
    setPaginaAtual(1); // volta à primeira página
    
    // Fecha todos os dropdowns após aplicar filtro
    setDropdownOrdenar(false);
    setDropdownValeRefeicao(false);
    setDropdownDistancia(false);
  };

  // filtro por catgorias slider
const aplicarFiltroCategoria = (slug: string) => {
  const filtrados = produtos.filter((p) => {
    const categoriaProduto = p.categoria?.toLowerCase().replace(/\s|&|ç|ã|á|é|í|ó|ô|ú/g, (match) => {
      const mapa = {
        " ": "-",
        "&": "e",
        "ç": "c",
        "ã": "a",
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ô": "o",
        "ú": "u",
      };
      return mapa[match] || "";
    });

    return p.slugCategoria === slug;
  });

  setProdutosFiltrados(filtrados);
  setPaginaAtual(1);
  setBusca("");
  setCategoriaAtiva(slug);

};



  // busca por texto
  // 🔎 Filtro em tempo real pelo campo de busca
useEffect(() => {
  if (!busca.trim()) {
    // Se o campo estiver vazio, volta a exibir todos os produtos
    setProdutosFiltrados(produtos);
    setPaginaAtual(1);
    return;
  }

  const termo = busca.toLowerCase();

  const filtrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(termo) ||
      (p.categoria && p.categoria.toLowerCase().includes(termo)) ||
      (loja?.nome && loja.nome.toLowerCase().includes(termo)) // Mantém a busca por nome da loja no cabeçalho
  );

  setProdutosFiltrados(filtrados);
  setPaginaAtual(1);
}, [busca, produtos, loja]);

{busca && (
  <button
    onClick={() => setBusca("")}
    className={styles["clear-search"]}
    aria-label="Limpar busca"
  >
    ✕
  </button>
)}



  return (
    <>
       <Header
        showSearch={true}
        busca={busca}
        onSearchChange={(value) => setBusca(value)}
        onClearSearch={() => setBusca("")}
      />
     
      <main>
        <section id="restaurants" className={styles["restaurants-section"]}>
          <div className={styles.container}>
            <h2 className={styles["restaurants-section__title"]}>
              Os melhores restaurantes
            </h2>
            <hr className={styles["restaurants-section__divider"]} />

            {/* SLIDER DE CATEGORIAS */}
            <div
              ref={sliderRef}
              className={styles["categories-slider"]}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              {loading && <span>Carregando categorias...</span>}
              {error && <span style={{color: 'red'}}>Erro ao carregar categorias: {error}</span>}
              {!loading && !error &&
                categorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => aplicarFiltroCategoria(categoria.slug)}
                    className={`${styles["category-item"]} ${
                      categoriaAtiva === categoria.slug ? styles["category-active"] : ""
                    }`}
                  >
                    <div className={styles["category-icon"]}>
                      <Image
                        src={categoria.icone}
                        alt={categoria.nome}
                        width={29}
                        height={29}
                      />
                    </div>
                    <span>{categoria.nome}</span>
                  </button>
                ))}
            </div>


            {/* FILTROS */}
            {/* <div className={styles.filters}>
              <button
                className={styles["filter-badge"]}
                onClick={() => aplicarFiltro("Entrega grátis")}
              >
                Entrega grátis
              </button>
              <button
                className={styles["filter-badge"]}
                onClick={() => aplicarFiltro("Valor mínimo")}
              >
                Valor mínimo
              </button>
              <button
                className={styles["filter-badge"]}
                onClick={() => aplicarFiltro("Entrega parceira")}
              >
                Entrega parceira
              </button>
              <button
                className={styles["filter-badge"]}
                onClick={() => aplicarFiltro("Promoções")}
              >
                Promoções
              </button>
              <button
                className={styles["filter-badge"]}
                onClick={() => aplicarFiltro("reset")}
              >
                Resetar filtros
              </button>
            </div> */}
             {/* FILTROS */}
            <div className={styles.filters}>
              {/* Dropdown Ordenar */}
              <div className={styles["filter-dropdown"]}>
                <button
                  className={styles["filter-badge"]}
                  onClick={() => {
                    setDropdownOrdenar(!dropdownOrdenar);
                    setDropdownValeRefeicao(false);
                    setDropdownDistancia(false);
                  }}
                >
                  Ordenar
                  <span className={styles["dropdown-arrow"]}>▼</span>
                </button>
                {dropdownOrdenar && (
                  <div className={styles["dropdown-menu"]}>
                    <button
                      className={styles["dropdown-item"]}
                      onClick={() => aplicarFiltro("Ordenar", "promocoes")}
                    >
                      Promoções
                    </button>
                    <button
                      className={styles["dropdown-item"]}
                      onClick={() => aplicarFiltro("Ordenar", "valor-minimo")}
                    >
                      Valor mínimo
                    </button>
                  </div>
                )}
              </div>

              {/* Botão Entrega Grátis */}
              <button
                className={styles["filter-badge"]}
                onClick={() => aplicarFiltro("Entrega grátis")}
              >
                Entrega grátis
              </button>

              {/* Dropdown Vale Refeição */}
              <div className={styles["filter-dropdown"]}>
                <button
                  className={styles["filter-badge"]}
                  onClick={() => {
                    setDropdownValeRefeicao(!dropdownValeRefeicao);
                    setDropdownOrdenar(false);
                    setDropdownDistancia(false);
                  }}
                >
                  Vale refeição
                  <span className={styles["dropdown-arrow"]}>▼</span>
                </button>
                {dropdownValeRefeicao && (
                  <div className={styles["dropdown-menu"]}>
                    <button
                      className={styles["dropdown-item"]}
                      onClick={() => aplicarFiltro("Vale refeição", "Alelo")}
                    >
                      Alelo
                    </button>
                    <button
                      className={styles["dropdown-item"]}
                      onClick={() => aplicarFiltro("Vale refeição", "Sodexo")}
                    >
                      Sodexo
                    </button>
                    <button
                      className={styles["dropdown-item"]}
                      onClick={() => aplicarFiltro("Vale refeição", "Ticket")}
                    >
                      Ticket
                    </button>
                    <button
                      className={styles["dropdown-item"]}
                      onClick={() => aplicarFiltro("Vale refeição", "VR")}
                    >
                      VR
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown Distância */}
              <div className={styles["filter-dropdown"]}>
                <button
                  className={styles["filter-badge"]}
                  onClick={() => {
                    setDropdownDistancia(!dropdownDistancia);
                    setDropdownOrdenar(false);
                    setDropdownValeRefeicao(false);
                  }}
                >
                  Distância
                  <span className={styles["dropdown-arrow"]}>▼</span>
                </button>
                {dropdownDistancia && (
                  <div className={styles["dropdown-menu"]}>
                    <button
                      className={styles["dropdown-item"]}
                      onClick={() => aplicarFiltro("Distância", 1)}
                    >
                      Até 1 km
                    </button>
                    <button
                      className={styles["dropdown-item"]}
                      onClick={() => aplicarFiltro("Distância", 2)}
                    >
                      Até 2 km
                    </button>
                    <button
                      className={styles["dropdown-item"]}
                      onClick={() => aplicarFiltro("Distância", 5)}
                    >
                      Até 5 km
                    </button>
                    <button
                      className={styles["dropdown-item"]}
                      onClick={() => aplicarFiltro("Distância", 10)}
                    >
                      Até 10 km
                    </button>
                  </div>
                )}
              </div>

              {/* Botão Entrega Parceira */}
              <button
                className={styles["filter-badge"]}
                onClick={() => aplicarFiltro("Entrega parceira")}
              >
                Entrega parceira
              </button>

              {/* Botão Super Restaurantes */}
              <button
                className={styles["filter-badge"]}
                onClick={() => aplicarFiltro("Super restaurantes")}
              >
                Super restaurantes
              </button>
               <button
                className={styles["filter-badge"]}
                onClick={() => aplicarFiltro("reset")}
              >
                Resetar filtros
              </button>
            </div>


              
            {/* GRID DE PRODUTOS */}
            <div className={styles["restaurant-grid"]}>
              {loading && <p>Carregando restaurantes...</p>}
              {error && <p style={{color: 'red'}}>Erro ao carregar produtos: {error}</p>}

              {!loading && !error &&
                produtosExibidos.map((item) => (
                  <Link
                    key={item.id}
                    href={item.slugLoja && item.slugCategoria && item.slug ? `/loja/${item.slugLoja}/${item.slugCategoria}/${item.slug}` : "#"}
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
                      <h3 className={styles["restaurant-card__name"]}>
                        {item.nome}
                      </h3>

                      <div className={styles["restaurant-card__meta"]}>
                        <div className={styles.rating}>
                          <div className={styles["star-icon"]}>
                            <div
                              className={styles["star-icon__background"]}
                            ></div>
                            <div
                              className={styles["star-icon__foreground"]}
                            ></div>
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
                        <span>{item.categoria}</span>
                        <Image
                          src="/images/I2_3875_2_3866.svg"
                          alt=""
                          className={styles["separator-dot"]}
                          width={3}
                          height={3}
                        />
                        <span>{item.distancia}</span>
                      </div>

                      <div className={styles["restaurant-card__delivery"]}>
                        <span>{item.tempoEntrega}</span>
                        <Image
                          src="/images/I2_3875_2_3872.svg"
                          alt=""
                          className={styles["separator-dot"]}
                          width={3}
                          height={3}
                        />
                        <span>{item.taxaEntrega}</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {/* PAGINAÇÃO */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                disabled={paginaAtual === 1}
                className={styles["filter-badge"]}
              >
                Anterior
              </button>

              <span style={{ alignSelf: "center" }}>
                Página {paginaAtual} de{" "}
                {Math.ceil(produtosFiltrados.length / produtosPorPagina)}
              </span>

              <button
                onClick={() =>
                  setPaginaAtual((p) =>
                    p < Math.ceil(produtosFiltrados.length / produtosPorPagina)
                      ? p + 1
                      : p
                  )
                }
                disabled={
                  paginaAtual >=
                  Math.ceil(produtosFiltrados.length / produtosPorPagina)
                }
                className={styles["filter-badge"]}
              >
                Próxima
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
