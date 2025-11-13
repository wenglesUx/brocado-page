"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../cadastro/cadastro.module.css";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function CadastroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const success = await register(nome, email, senha, telefone);
      
      if (success) {
        toast.success("Cadastro realizado com sucesso!");
        router.push(redirect);
      } else {
        toast.error("Este email já está cadastrado");
      }
    } catch (error) {
      toast.error("Erro ao fazer cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <Header showSearch={false} />

      <main>
        <section className={styles["restaurants-section"]}>
          <div className={styles.container}>
            <div style={{ maxWidth: "450px", margin: "60px auto", padding: "0 20px" }}>
              <h2 className={styles["restaurants-section__title"]} style={{ textAlign: "center" }}>
                Criar sua conta
              </h2>
              <hr className={styles["restaurants-section__divider"]} />

              <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    htmlFor="nome"
                    style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
                  >
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className={styles["header__search-input"]}
                    style={{ width: "100%", padding: "12px" }}
                    placeholder="Seu nome"
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    htmlFor="email"
                    style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles["header__search-input"]}
                    style={{ width: "100%", padding: "12px" }}
                    placeholder="seu@email.com"
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    htmlFor="telefone"
                    style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
                  >
                    Telefone (opcional)
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className={styles["header__search-input"]}
                    style={{ width: "100%", padding: "12px" }}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    htmlFor="senha"
                    style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
                  >
                    Senha
                  </label>
                  <input
                    type="password"
                    id="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className={styles["header__search-input"]}
                    style={{ width: "100%", padding: "12px" }}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div style={{ marginBottom: "25px" }}>
                  <label
                    htmlFor="confirmarSenha"
                    style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
                  >
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    className={styles["header__search-input"]}
                    style={{ width: "100%", padding: "12px" }}
                    placeholder="Digite a senha novamente"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles["filter-badge"]}
                  style={{
                    width: "100%",
                    padding: "15px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    marginBottom: "20px",
                  }}
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </button>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <p style={{ color: "#666" }}>
                    Já tem uma conta?{" "}
                    <Link
                      href={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
                      style={{ color: "#007bff", backgroundColor:"a729010", textDecoration: "underline" }}
                    >
                      Entrar
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
