"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../../components/styles/Desktop.module.css";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useAddress } from "../contexts/AddressContext";

export default function CarrinhoPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, getDeliveryFee, getFinalTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { selectedAddress, getFormattedAddress } = useAddress();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/carrinho");
      return;
    }

    if (!selectedAddress) {
      router.push("/endereco?redirect=/carrinho");
      return;
    }

    // lógica de checkout
    alert("Pedido finalizado com sucesso! (Funcionalidade de checkout pode ser expandida)");
    clearCart();
    router.push("/");
  };

  return (
    <>
      <Header showSearch={false} />

      <main>
        <section className={styles["restaurants-section"]}>
          <div className={styles.container}>
            <h2 className={styles["restaurants-section__title"]}>Meu Carrinho</h2>
            <hr className={styles["restaurants-section__divider"]} />

            {items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <Image
                  src="/images/shopping-bag.png"
                  alt="Carrinho vazio"
                  width={80}
                  height={80}
                  style={{ opacity: 0.3, marginBottom: "20px" }}
                />
                <h3 style={{ marginBottom: "10px", color: "#666" }}>Seu carrinho está vazio</h3>
                <p style={{ marginBottom: "30px", color: "#999" }}>
                  Adicione produtos para continuar
                </p>
                <Link href="/" className={styles["filter-badge"]} style={{ display: "inline-block" }}>
                  Voltar para a loja
                </Link>
              </div>
            ) : (
              <div className={styles["gridd-cart-items-area"]}
              style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px", maxWidth: "900px", margin: "0 auto" }}>
                {/* Lista de itens */}
                <div>
                  {items.map((item) => (
                    <div
                      key={item.id} className={styles["gridd-cart-items"]}>
                     
                      <Image
                        src={item.imagem}
                        alt={item.nome}
                        width={100}
                        height={100}
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                      />
                      
                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: "8px", fontSize: "18px" }}>{item.nome}</h3>
                        <p style={{ color: "#666", marginBottom: "12px" }}>
                          R$ {item.preco.toFixed(2).replace(".", ",")}
                        </p>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                              className={styles["filter-badge"]}
                              style={{ padding: "5px 12px", minWidth: "auto" }}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: "bold", minWidth: "30px", textAlign: "center" }}>
                              {item.quantidade}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                              className={styles["filter-badge"]}
                              style={{ padding: "5px 12px", minWidth: "auto" }}
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{
                              color: "#e74c3c",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "18px" }}>
                        R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumo do pedido */}
                <div
                  style={{
                    padding: "25px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>Resumo do Pedido</h3>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span>Subtotal:</span>
                    <span>R$ {getTotalPrice().toFixed(2).replace(".", ",")}</span>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span>Taxa de entrega:</span>
                    <span>
                      {getDeliveryFee() === 0
                        ? "Grátis"
                        : `R$ ${getDeliveryFee().toFixed(2).replace(".", ",")}`}
                    </span>
                  </div>
                  
                  <hr style={{ margin: "15px 0", border: "none", borderTop: "1px solid #ddd" }} />
                  
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "25px",
                    }}
                  >
                    <span>Total:</span>
                    <span>R$ {getFinalTotal().toFixed(2).replace(".", ",")}</span>
                  </div>
                  
                  {selectedAddress && (
                    <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#fff", borderRadius: "6px" }}>
                      <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                        Entregar em:
                      </p>
                      <p style={{ fontWeight: "500" }}>{getFormattedAddress(selectedAddress)}</p>
                      <Link href="/endereco" style={{ fontSize: "14px", color: "#007bff", textDecoration: "underline" }}>
                        Alterar endereço
                      </Link>
                    </div>
                  )}
                  
                  <button
                    onClick={handleCheckout}
                    className={styles["filter-badge"]}
                    style={{
                      width: "100%",
                      padding: "15px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      backgroundColor: "#a72901",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    Finalizar Pedido
                  </button>
                  
                  <Link
                    href="/"
                    style={{
                      display: "block",
                      textAlign: "center",
                      marginTop: "15px",
                      color: "#f96700",
                      textDecoration: "underline",
                    }}
                  >
                    Continuar comprando
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
