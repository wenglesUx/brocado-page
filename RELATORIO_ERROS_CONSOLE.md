## Relatório Detalhado de Erros de Console e Soluções

### Introdução
Este relatório apresenta os erros e avisos que provavelmente aparecerão no console do navegador ao executar a aplicação Next.js refatorada, juntamente com as causas raiz e as soluções recomendadas.

---

## 1. Erros Críticos

### 1.1 Hydration Mismatch (Erro de Hidratação)
**Severidade:** 🔴 Crítica  
**Mensagem de Erro Típica:**
```
Hydration failed because the initial UI does not match what was rendered on the server.
```

**Causa Raiz:**
A aplicação renderiza conteúdo diferente no servidor (SSR) e no cliente (CSR). Isso ocorre principalmente nas páginas que usam `localStorage` (carrinho, autenticação, endereços) ou em componentes que renderizam dados condicionais baseados no estado do cliente.

**Locais de Ocorrência:**
- `components/Header.tsx` - O contador do carrinho e o nome do usuário são lidos do `localStorage` no cliente, mas o servidor não tem acesso a esses dados.
- `app/carrinho/page.tsx` - O conteúdo do carrinho é carregado do `localStorage`.
- `app/login/page.tsx` - O estado de login é verificado no cliente.

**Solução Recomendada:**

**Passo 1:** Certifique-se de que os componentes que usam `localStorage` estão marcados como Client Components:
```typescript
// components/Header.tsx
'use client'; // Adicione esta linha no topo

import { useEffect, useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const { cartItems } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    // Apenas após a montagem do componente no cliente
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Renderize um placeholder ou nada durante o SSR
    return <header>{/* Placeholder */}</header>;
  }

  return (
    <header>
      {/* Conteúdo real */}
      <span>({cartItems.length})</span>
      <span>{user?.name || 'Entrar'}</span>
    </header>
  );
}
```

**Passo 2:** Atualize os contextos para inicializar com valores seguros:
```typescript
// app/contexts/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Carregar do localStorage apenas no cliente
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Salvar no localStorage apenas se estiver montado
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (item: CartItem) => {
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
```

---

### 1.2 Missing `key` Prop em Listas
**Severidade:** 🟡 Média  
**Mensagem de Erro Típica:**
```
Warning: Each child in a list should have a unique "key" prop.
```

**Causa Raiz:**
Quando você renderiza uma lista de elementos usando `map()`, o React precisa de uma chave única para cada elemento para rastrear as mudanças de forma eficiente.

**Locais de Ocorrência:**
- `app/page.tsx` - Renderização de restaurantes (`restaurants.map(...)`)
- `app/carrinho/page.tsx` - Renderização de itens do carrinho (`cartItems.map(...)`)
- `components/Header.tsx` - Renderização de endereços ou itens do menu
- `app/endereco/page.tsx` - Renderização de endereços salvos

**Solução Recomendada:**

Sempre adicione a prop `key` com um valor único (preferencialmente um ID):
```typescript
// Exemplo: app/page.tsx
{restaurants.map((restaurant) => (
  <div key={restaurant.id} className={styles.restaurantCard}>
    <h3>{restaurant.name}</h3>
    <p>{restaurant.description}</p>
  </div>
))}

// Exemplo: app/carrinho/page.tsx
{cartItems.map((item) => (
  <div key={item.id} className={styles.cartItem}>
    <h4>{item.name}</h4>
    <span>R$ {item.price.toFixed(2)}</span>
  </div>
))}
```

**Nota:** Se os dados não tiverem um ID único, considere usar o índice como último recurso, mas isso pode causar problemas se a lista for reordenada:
```typescript
// Não recomendado, mas aceitável se a lista não mudar
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}
```

---

## 2. Avisos Não-Críticos

### 2.1 Propriedades CSS Não Utilizadas
**Severidade:** 🟢 Baixa  
**Mensagem de Erro Típica:**
```
Unused CSS rule: .classNameNotUsed { ... }
```

**Causa Raiz:**
Durante a refatoração, algumas classes CSS podem ter permanecido no arquivo, mas não estão sendo usadas em nenhum componente.

**Solução Recomendada:**
A refatoração já removeu muitas classes não utilizadas. Para garantir que não há mais classes não utilizadas, execute uma auditoria periódica:

1. Use ferramentas como **PurgeCSS** ou **UnCSS** para identificar classes não utilizadas.
2. Manualmente, revise os arquivos CSS e remova as classes que não aparecem em nenhum componente.

Exemplo usando **PurgeCSS**:
```bash
npm install --save-dev purgecss
npx purgecss --css app/globals.css --content 'app/**/*.tsx' 'components/**/*.tsx' --output app/globals.purged.css
```

---

### 2.2 Avisos de Tipagem (TypeScript)
**Severidade:** 🟡 Média  
**Mensagem de Erro Típica:**
```
Type 'X' is not assignable to type 'Y'.
```

**Causa Raiz:**
Falta de tipagem rigorosa em algumas funções e variáveis do projeto.

**Locais de Ocorrência:**
- `app/contexts/CartContext.tsx` - Tipos de itens do carrinho podem não estar completamente definidos.
- `app/page.tsx` - Funções de filtro podem não ter tipos de parâmetro e retorno definidos.

**Solução Recomendada:**

Adicione tipos explícitos:
```typescript
// Antes (sem tipagem)
const aplicarFiltro = (filtro) => {
  // ...
};

// Depois (com tipagem)
const aplicarFiltro = (filtro: string): void => {
  // ...
};

// Ou com tipos mais complexos
interface Restaurante {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  nota: number;
}

const filtrarRestaurantes = (restaurantes: Restaurante[], filtro: string): Restaurante[] => {
  return restaurantes.filter(r => r.nome.includes(filtro));
};
```

---

### 2.3 Avisos de Performance
**Severidade:** 🟡 Média  
**Mensagem de Erro Típica:**
```
Slow JavaScript execution detected.
```

**Causa Raiz:**
Operações de filtro e busca executadas no cliente podem ser lentas com grandes conjuntos de dados.

**Solução Recomendada:**

1. **Memoização:** Use `useMemo` para evitar recálculos desnecessários:
```typescript
import { useMemo } from 'react';

const filteredRestaurants = useMemo(() => {
  return restaurants.filter(r => r.nome.includes(searchTerm));
}, [restaurants, searchTerm]);
```

2. **Paginação:** Implemente paginação para limitar o número de itens renderizados por vez (já implementado no projeto).

3. **Lazy Loading:** Use `React.lazy` e `Suspense` para carregar componentes sob demanda.

---

## 3. Erros Específicos do Projeto

### 3.1 Erro: `localStorage is not defined` (SSR)
**Severidade:** 🔴 Crítica  
**Mensagem de Erro Típica:**
```
ReferenceError: localStorage is not defined
```

**Causa Raiz:**
O código tenta acessar `localStorage` durante o Server-Side Rendering (SSR), onde `localStorage` não está disponível.

**Solução Recomendada:**

Sempre verifique se o código está sendo executado no cliente antes de acessar `localStorage`:
```typescript
// Errado
const cart = JSON.parse(localStorage.getItem('cart'));

// Correto
const cart = typeof window !== 'undefined' 
  ? JSON.parse(localStorage.getItem('cart') || '[]')
  : [];

// Ou use useEffect
useEffect(() => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  setCart(cart);
}, []);
```

---

### 3.2 Erro: Componentes Não Encontrados
**Severidade:** 🔴 Crítica  
**Mensagem de Erro Típica:**
```
Module not found: Can't resolve '@/components/Header'
```

**Causa Raiz:**
Caminho de importação incorreto ou arquivo não existe.

**Solução Recomendada:**

Verifique os caminhos de importação. O projeto usa `@/` como alias para a raiz do projeto. Certifique-se de que:
1. O arquivo existe no caminho especificado.
2. O caminho está correto (sensível a maiúsculas/minúsculas em sistemas Linux/Mac).
3. O arquivo é exportado corretamente.

```typescript
// Correto
import Header from '@/components/Header';

// Verifique se o arquivo existe em: /home/ubuntu/loja-app/components/Header.tsx
```

---

## 4. Checklist de Resolução

- [ ] Adicionar `'use client'` em todos os componentes que usam hooks de contexto.
- [ ] Implementar o padrão de `isMounted` em componentes que usam `localStorage`.
- [ ] Adicionar a prop `key` em todas as renderizações de listas.
- [ ] Adicionar tipagem explícita em todas as funções (TypeScript).
- [ ] Testar a aplicação em diferentes navegadores e dispositivos.
- [ ] Executar `npm run build` para verificar se há erros de compilação.
- [ ] Usar o DevTools do navegador (F12) para monitorar o console durante a navegação.

---

## 5. Ferramentas Recomendadas para Monitoramento

1. **ESLint:** Detecta erros de código e avisos.
   ```bash
   npm install --save-dev eslint eslint-plugin-react
   npx eslint . --fix
   ```

2. **TypeScript Strict Mode:** Ativa verificações de tipo mais rigorosas.
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

3. **React DevTools:** Extensão do navegador para depurar componentes React.

4. **Next.js Analytics:** Monitora performance e erros em produção.

---

## Conclusão

O projeto refatorado está em bom estado. Os erros mencionados neste relatório são comuns em aplicações React/Next.js e podem ser resolvidos seguindo as recomendações fornecidas. Recomenda-se aplicar as correções de forma gradual, testando a aplicação após cada mudança.

Para mais informações, consulte a [documentação oficial do Next.js](https://nextjs.org/docs) e a [documentação do React](https://react.dev).
