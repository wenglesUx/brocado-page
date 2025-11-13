"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../minha-conta/minha-conta.module.css";
import { useAuth } from "../contexts/AuthContext";
import { useAddress } from "../contexts/AddressContext";
import { toast } from "sonner";

export default function MinhaContaPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { selectedAddress, getFormattedAddress } = useAddress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      setNome(user.nome);
      setTelefone(user.telefone || "");
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso!");
    router.push("/");
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ nome, telefone });
    toast.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
       <Header showSearch={false} />
       
      <main>
        <section className={styles["restaurants-section"]}>
          <div className={styles.container}>
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
              <h2 className={styles["title"]}>Minha Conta</h2>
              <hr className={styles["restaurants-section__divider"]} />

              <div style={{ marginTop: "40px" }}>
                {/* Informações do perfil */}
                <div
                  style={{
                    padding: "25px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    marginBottom: "25px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "20px" }}>Informações Pessoais</h3>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className={styles["filter-badge"]}
                        style={{ padding: "8px 16px" }}
                      >
                        Editar
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile}>
                      <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                          Nome
                        </label>
                        <input
                          type="text"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          required
                          className={styles["header__search-input"]}
                          style={{ width: "100%", padding: "10px" }}
                        />
                      </div>

                      <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className={styles["header__search-input"]}
                          style={{ width: "100%", padding: "10px", backgroundColor: "#f5f5f5" }}
                        />
                        <p style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
                          O email não pode ser alterado
                        </p>
                      </div>

                      <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          className={styles["header__search-input"]}
                          style={{ width: "100%", padding: "10px" }}
                          placeholder="(11) 99999-9999"
                        />
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="submit"
                          className={styles["filter-badge"]}
                          style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff" }}
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setNome(user.nome);
                            setTelefone(user.telefone || "");
                          }}
                          className={styles["filter-badge"]}
                          style={{ padding: "10px 20px" }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div style={{ marginBottom: "15px" }}>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>Nome</p>
                        <p style={{ fontWeight: "500" }}>{user.nome}</p>
                      </div>

                      <div style={{ marginBottom: "15px" }}>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>Email</p>
                        <p style={{ fontWeight: "500" }}>{user.email}</p>
                      </div>

                      <div>
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>Telefone</p>
                        <p style={{ fontWeight: "500" }}>{user.telefone || "Não informado"}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Links rápidos */}
                <div
                  style={{
                    padding: "25px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    marginBottom: "25px",
                  }}
                >
                  <h3 style={{ fontSize: "20px", marginBottom: "20px" }}>Acesso Rápido</h3>
                  
                  <div style={{ display: "grid", gap: "12px" }}>
                    <Link
                      href="/endereco"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "6px",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <span>Meus Endereços</span>
                      <span>→</span>
                    </Link>

                    <Link
                      href="/carrinho"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "6px",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <span>Meu Carrinho</span>
                      <span>→</span>
                    </Link>

                    <Link
                      href="/"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "6px",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <span>Voltar para a Loja</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

                {/* Botão de logout */}
                <button
                  onClick={handleLogout}
                  className={styles["filter-badge"]}
                  style={{
                    width: "100%",
                    padding: "15px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Sair da Conta
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
