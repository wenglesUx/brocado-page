'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useAddress } from '@/app/contexts/AddressContext';
import styles from '@/components/styles/Desktop.module.css';

interface HeaderProps {
  showSearch?: boolean;
  busca?: string;
  onSearchChange?: (value: string) => void;
  onClearSearch?: () => void;
}

export default function Header({
  showSearch = false,
  busca = '',
  onSearchChange,
  onClearSearch,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { selectedAddress, getFormattedAddress } = useAddress();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleClearSearch = () => {
    if (onClearSearch) {
      onClearSearch();
    }
  };

  return (
    <header id="section-header" className={styles.header}>
      <div className={`${styles.header__container} ${styles.container}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles["logo-images"]}>
            <Image
              src="/images/logo.png"
              alt="Brocado Logo Text"
              className={styles["logo-text"]}
              width={100}
              height={30}
            />
          </div>
        </Link>

        {/* Campo de busca - apenas na página principal */}
        {showSearch && (
          <div className={styles.header__search}>
            <Image
              src="/images/search.png"
              alt="Search"
              className={styles["header__search-icon"]}
              width={24}
              height={24}
            />
            <input
              type="text"
              placeholder="Busque por produto ou loja"
              className={styles["header__search-input"]}
              value={busca}
              onChange={handleSearchChange}
            />
            {busca && (
              <button
                onClick={handleClearSearch}
                className={styles["clear-search"]}
                aria-label="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Itens do menu */}
        <div
          className={`${styles.header__menu} ${
            menuOpen ? styles.menuOpen : ""
          }`}
        >
          <Link href="/endereco" className={styles.header__delivery}>
            <p className={styles["header__delivery-label"]}>Entregar em:</p>
            <p className={styles["header__delivery-address"]}>
              {selectedAddress ? getFormattedAddress(selectedAddress) : "Selecione um endereço"}
            </p>
          </Link>

          <Link href="/carrinho" className={styles.header__cart}>
            <Image
              src="/images/shopping-bag.png"
              alt="Shopping Bag"
              width={24}
              height={24}
            />
              {getTotalItems() > 0 && (
                <span>{getTotalItems()}</span>
              )}
          </Link>

          {isAuthenticated ? (
            <Link href="/minha-conta" className={styles["header__login-btn"]}>
              {user?.nome || "Minha Conta"}
            </Link>
          ) : (
            <Link href="/login" className={styles["header__login-btn"]}>
              Entrar
            </Link>
          )}
        </div>

        {/* Botão Hamburguer */}
        <button
          className={`${styles.hamburger} ${
            menuOpen ? styles.active : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Overlay escuro */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.show : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>
    </header>
  );
}
