"use client";

import { TooltipProvider } from "@/components/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AddressProvider } from "./contexts/AddressContext";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <AuthProvider>
          <AddressProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                {children}
              </TooltipProvider>
            </CartProvider>
          </AddressProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
