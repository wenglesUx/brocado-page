"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../endereco/endereco.module.css";
import { useAddress, Address } from "../contexts/AddressContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function EnderecoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addresses, selectedAddress, addAddress, removeAddress, selectAddress, getFormattedAddress } = useAddress();
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Campos do formulário
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [referencia, setReferencia] = useState("");

  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAddress: Omit<Address, "id"> = {
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      referencia,
      isDefault: addresses.length === 0,
    };

    addAddress(newAddress);
    toast.success("Endereço adicionado com sucesso!");
    
    // Limpar formulário
    setRua("");
    setNumero("");
    setComplemento("");
    setBairro("");
    setCidade("");
    setEstado("");
    setCep("");
    setReferencia("");
    setShowForm(false);
  };

  const handleSelectAddress = (id: string) => {
    selectAddress(id);
    toast.success("Endereço selecionado!");
    
    if (redirect !== "/") {
      router.push(redirect);
    }
  };

  const handleRemoveAddress = (id: string) => {
    if (addresses.length === 1) {
      toast.error("Você precisa ter pelo menos um endereço");
      return;
    }
    removeAddress(id);
    toast.success("Endereço removido!");
  };

  return (
    <>
       <Header showSearch={false} />

      <main>
        <section className={styles["restaurants-section"]}>
          <div className={styles.container}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <h2 className={styles["title"]}>Meus Endereços</h2>
              <hr className={styles["restaurants-section__divider"]} />

              <div style={{ marginTop: "30px", marginBottom: "30px" }}>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className={styles["filter-badge"]}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#a72901",
                    color: "#fff",
                  }}
                >
                  {showForm ? "Cancelar" : "+ Adicionar novo endereço"}
                </button>
              </div>

              {showForm && (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    padding: "25px",
                    border: "1px solid #f96700",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    marginBottom: "30px",
                  }}
                >
                  <h3 style={{ marginBottom: "20px" }}>Novo Endereço</h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                        CEP
                      </label>
                      <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        required
                        className={styles["header__search-input"]}
                        style={{ width: "100%", padding: "10px" }}
                        placeholder="00000-000"
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                        Rua
                      </label>
                      <input
                        type="text"
                        value={rua}
                        onChange={(e) => setRua(e.target.value)}
                        required
                        className={styles["header__search-input"]}
                        style={{ width: "100%", padding: "10px" }}
                        placeholder="Nome da rua"
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                        Número
                      </label>
                      <input
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        required
                        className={styles["header__search-input"]}
                        style={{ width: "100%", padding: "10px" }}
                        placeholder="123"
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        className={styles["header__search-input"]}
                        style={{ width: "100%", padding: "10px" }}
                        placeholder="Apto, bloco, etc"
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        required
                        className={styles["header__search-input"]}
                        style={{ width: "100%", padding: "10px" }}
                        placeholder="Nome do bairro"
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        required
                        className={styles["header__search-input"]}
                        style={{ width: "100%", padding: "10px" }}
                        placeholder="Nome da cidade"
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                        Estado
                      </label>
                      <input
                        type="text"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        required
                        className={styles["header__search-input"]}
                        style={{ width: "100%", padding: "10px" }}
                        placeholder="SP"
                        maxLength={2}
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                        Ponto de referência (opcional)
                      </label>
                      <input
                        type="text"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                        className={styles["header__search-input"]}
                        style={{ width: "100%", padding: "10px" }}
                        placeholder="Ex: Próximo ao mercado"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={styles["filter-badge"]}
                    style={{
                      marginTop: "20px",
                      padding: "12px 30px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                    }}
                  >
                    Salvar Endereço
                  </button>
                </form>
              )}

              <div style={{ display: "grid", gap: "15px" }}>
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    style={{
                      padding: "20px",
                      border: selectedAddress?.id === address.id ? "2px solid #f96700" : "1px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: selectedAddress?.id === address.id ? "#f0f8ff" : "#fff",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                          {getFormattedAddress(address)}
                        </p>
                        <p style={{ color: "#666", fontSize: "14px" }}>
                          {address.bairro}, {address.cidade} - {address.estado}
                        </p>
                        <p style={{ color: "#666", fontSize: "14px" }}>CEP: {address.cep}</p>
                        {address.referencia && (
                          <p style={{ color: "#999", fontSize: "13px", marginTop: "5px" }}>
                            Ref: {address.referencia}
                          </p>
                        )}
                        {selectedAddress?.id === address.id && (
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "10px",
                              padding: "4px 10px",
                              backgroundColor: "#a72901",
                              color: "#fff",
                              borderRadius: "4px",
                              fontSize: "12px",
                            }}
                          >
                            Endereço selecionado
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        {selectedAddress?.id !== address.id && (
                          <button
                            onClick={() => handleSelectAddress(address.id)}
                            className={styles["filter-badge"]}
                            style={{ padding: "8px 16px" }}
                          >
                            Selecionar
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveAddress(address.id)}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {redirect !== "/" && (
                <div style={{ marginTop: "30px", textAlign: "center" }}>
                  <Link href={redirect} className={styles["filter-badge"]}>
                    Voltar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
