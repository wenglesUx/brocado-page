"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Address {
  id: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  referencia?: string;
  isDefault?: boolean;
}

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getFormattedAddress: (address: Address) => string;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar endereços do localStorage ao montar
  useEffect(() => {
    const savedAddresses = localStorage.getItem("addresses");
    if (savedAddresses) {
      try {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
        
        // Selecionar o endereço padrão
        const defaultAddress = parsedAddresses.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (parsedAddresses.length > 0) {
          setSelectedAddress(parsedAddresses[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar endereços:", error);
      }
    } else {
      // Endereço padrão inicial
      const defaultAddr: Address = {
        id: "default-1",
        rua: "R. Traíra",
        numero: "110",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
        isDefault: true,
      };
      setAddresses([defaultAddr]);
      setSelectedAddress(defaultAddr);
    }
    setIsLoaded(true);
  }, []);

  // Salvar endereços no localStorage sempre que mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("addresses", JSON.stringify(addresses));
    }
  }, [addresses, isLoaded]);

  const addAddress = (address: Omit<Address, "id">) => {
    const newAddress: Address = {
      ...address,
      id: `address-${Date.now()}`,
    };
    
    setAddresses((prev) => {
      // Se for o primeiro endereço ou marcado como padrão, desmarcar outros
      if (prev.length === 0 || address.isDefault) {
        const updated = prev.map((addr) => ({ ...addr, isDefault: false }));
        return [...updated, { ...newAddress, isDefault: true }];
      }
      return [...prev, newAddress];
    });
    
    // Se for o primeiro endereço ou padrão, selecionar automaticamente
    if (addresses.length === 0 || address.isDefault) {
      setSelectedAddress(newAddress);
    }
  };

  const updateAddress = (id: string, addressData: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, ...addressData } : addr
      )
    );
    
    // Atualizar endereço selecionado se for o mesmo
    if (selectedAddress?.id === id) {
      setSelectedAddress((prev) => (prev ? { ...prev, ...addressData } : null));
    }
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((addr) => addr.id !== id);
      
      // Se removeu o endereço selecionado, selecionar outro
      if (selectedAddress?.id === id && filtered.length > 0) {
        setSelectedAddress(filtered[0]);
      } else if (filtered.length === 0) {
        setSelectedAddress(null);
      }
      
      return filtered;
    });
  };

  const selectAddress = (id: string) => {
    const address = addresses.find((addr) => addr.id === id);
    if (address) {
      setSelectedAddress(address);
    }
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const getFormattedAddress = (address: Address): string => {
    return `${address.rua}, ${address.numero}${
      address.complemento ? ` - ${address.complemento}` : ""
    }`;
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        addAddress,
        updateAddress,
        removeAddress,
        selectAddress,
        setDefaultAddress,
        getFormattedAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error("useAddress deve ser usado dentro de um AddressProvider");
  }
  return context;
}
