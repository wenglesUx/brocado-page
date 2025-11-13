"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../login/login.module.css";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, senha);
      
      if (success) {
        toast.success("Login realizado com sucesso!");
        router.push(redirect);
      } else {
        toast.error("Email ou senha incorretos");
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
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
              <h2 className={styles["title"]} style={{ textAlign: "center" }}>
                Entrar na sua conta
              </h2>
              <hr className={styles["restaurants-section__divider"]} />

              <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                <div style={{ marginBottom: "25px" }}>
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

                <div style={{ marginBottom: "25px" }}>
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
                    placeholder="••••••••"
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
                    backgroundColor: "#a72901",
                    color: "#fff",
                    border: "none",
                    marginBottom: "20px",
                  }}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <p style={{ color: "#666" }}>
                    Não tem uma conta?{" "}
                    <Link
                      href={`/cadastro${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
                      style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                      Cadastre-se
                    </Link>
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "30px",
                    padding: "15px",
                    backgroundColor: "#f0f8ff",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                >
                  <p style={{ marginBottom: "8px", fontWeight: "500" }}>Conta de demonstração:</p>
                  <p style={{ color: "#666" }}>Email: demo@exemplo.com</p>
                  <p style={{ color: "#666" }}>Senha: demo123</p>
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
