# Relatório Técnico: Componente Carrossel de Dicas de Cuidados

**Projeto:** Sete Ervas  
**Data:** 12 de Novembro de 2026  
**Componente:** `CarrosselDicas.tsx`  
**Base de Dados:** `assets/Dados/dicas.json`  
**Tela de Integração:** `src/app/(tabs)/index.tsx` (Página de Início)  
**Status do Compilador:** 0 Erros no TypeScript (`npx tsc --noEmit`)  

---

## 1. Visão Geral

O **Carrossel de Dicas** é um componente dinâmico inserido na página inicial do aplicativo **Sete Ervas**. Seu objetivo é apresentar orientações rápidas e práticas de cuidados botânicos para diferentes perfis de plantas (ervas aromáticas, suculentas/cactos, folhagens de interior, plantas rústicas, pendentes tropicais e espécies resistentes).

O componente opera em modo de avanço automático contínuo, sem elementos visuais poluídos (sem setas e sem dots), trazendo foco total na leitura rápida dos cards.

---

## 2. Localização dos Arquivos no Projeto

1. **Componente de Interface:**
   - Caminho: `src/components/ui/CarrosselDicas.tsx`
   - Exportação centralizada: `src/components/ui/index.ts`
2. **Base de Dados Externa (JSON):**
   - Caminho: `assets/Dados/dicas.json`
3. **Página de Exibição:**
   - Caminho: `src/app/(tabs)/index.tsx` (posicionado logo abaixo do `HeaderPadrao` e antes do `CardTarefas`).

---

## 3. Funcionamento da Importação e Tipagem do JSON

### 3.1. Path Alias e Leitura
No arquivo `tsconfig.json`, o projeto já conta com o alias `"@/assets/*": ["./assets/*"]`. Isso permite que o componente importe o arquivo JSON de forma direta e limpa:

```tsx
import dicasData from '@/assets/Dados/dicas.json';
```

### 3.2. Estrutura de Tipos TypeScript
Para garantir segurança e autocompletação no código, os dados do JSON são tipados com duas interfaces:

```tsx
export interface ItemDicaCuidado {
    titulo: string;
    descricao: string;
    icone: keyof typeof Ionicons.glyphMap;
}

export interface DicaPlanta {
    id: string;
    planta: string;
    tipo: string;
    emoji: string;
    dicas: ItemDicaCuidado[];
}

export const DICAS_PLANTAS: DicaPlanta[] = dicasData as DicaPlanta[];
```

### 3.3. Formato do JSON (`assets/Dados/dicas.json`)
Cada espécie contém informações de categoria, emoji e um array `dicas` com exatamente **dois pontos essenciais** (Luz de Sol e Rega):

```json
[
  {
    "id": "1",
    "planta": "Manjericão",
    "tipo": "Erva Aromática",
    "emoji": "🌿",
    "dicas": [
      {
        "titulo": "Luz de sol",
        "descricao": "Sol direto por pelo menos 4 a 6 horas diárias. Gosta muito de calor e claridade.",
        "icone": "sunny"
      },
      {
        "titulo": "Rega",
        "descricao": "Mantenha a terra sempre levemente úmida. Em dias quentes, regue 1 vez ao dia sem encharcar.",
        "icone": "water"
      }
    ]
  }
]
```

*Vantagem arquitetural:* Toda adição ou alteração de texto é feita exclusivamente no JSON, sem necessidade de alterar o código React Native.

---

## 4. Mecanismo de Rolagem e Timer Automático

### 4.1. Controle por Referência (`useRef`)
Em vez de utilizar um estado comum (`useState`) para acompanhar o card visível, o componente utiliza:

```tsx
const indiceAtualRef = useRef(0);
```

*Motivo da escolha:* Usar `useRef` impede que a árvore de componentes re-renderize desnecessariamente a cada 4 segundos. O timer roda de maneira silenciosa, garantindo alta performance e suavidade nas animações.

### 4.2. Temporizador Contínuo (`setInterval`)
A cada 4000 ms (4 segundos), o timer avança para a próxima dica:

```tsx
useEffect(() => {
    if (isPausado) return;

    const intervalo = setInterval(() => {
        indiceAtualRef.current = (indiceAtualRef.current + 1) % DICAS_PLANTAS.length;
        scrollRef.current?.scrollTo({
            x: indiceAtualRef.current * (cardWidth + GAP),
            animated: true,
        });
    }, 4000);

    return () => clearInterval(intervalo);
}, [cardWidth, isPausado]);
```

- **Loop Infinito:** A fórmula `(indiceAtual + 1) % DICAS_PLANTAS.length` garante que, ao alcançar a última dica da lista, o ponteiro volte ao índice `0` suavemente.

### 4.3. Pausa Inteligente em Interações Manuais
Para não frustrar o usuário enquanto ele lê ou desliza manualmente o card:

- Os eventos `onTouchStart` e `onScrollBeginDrag` disparam `pausarTemporariamente()`.
- O timer é congelado por 5 segundos (`setIsPausado(true)`).
- Passados os 5 segundos sem nenhum toque, o timer é reativado automaticamente.

### 4.4. Sincronização de Posição Manual (`onMomentumScrollEnd`)
Se o usuário arrastar a tela manualmente até um card específico, o evento `onMomentumScrollEnd` recalcula o índice daquele card com base na posição `contentOffset.x`:

```tsx
onMomentumScrollEnd={(e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    indiceAtualRef.current = Math.round(offsetX / (cardWidth + GAP));
}}
```

Com isso, o próximo salto automático continuará exatamente a partir do card onde o usuário parou.

---

## 5. Física de Rolagem e Dimensões

- **Largura Dinâmica:**
  `cardWidth = isTablet ? Math.min(width, 700) - 36 : width - 36`  
  Calculado com base nas margens laterais (`paddingHorizontal: 18`) da página inicial, adaptando-se perfeitamente tanto a celulares quanto a tablets.
- **Efeito de Encaixe (`snapToInterval`):**  
  Com `snapToInterval={cardWidth + GAP}` e `decelerationRate="fast"`, ao soltar o dedo, o card é atraído para o centro da tela sem ficar cortado pela metade.

---

## 6. Anatomia Visual e Otimização do Card

O card foi ajustado para um layout compacto e equilibrado:

1. **Topo:**
   - Texto em destaque: **DICA 💡** (`fontSize: 14`, negrito, `#10DE80`).
   - Badge com o tipo da planta em fundo escuro (`#072019`) e borda fina.
2. **Identificação da Planta:**
   - Label *"Planta: "* em tom suave e o nome da planta **em negrito** (`fontSize: 19`, cor branca).
   - Emoji temático no canto direito (🌿, 🌵, 🪴, 🌱, 🍃, 🗡️).
3. **Divisor:** Linha horizontal de separação em `#134233`.
4. **Dois Pontos de Dicas:**
   - Renderização limpa através do `.map()` sobre `item.dicas`.
   - Ícone correspondente (`Ionicons` de sol, água, folhas) envolto em círculo de 28x28px.
   - Título em verde neon e texto descritivo claro em `#D4E2DC` com altura de linha reduzida (`lineHeight: 16`).
5. **Reduções Aplicadas:**
   - Padding interno: `13px` (redução de 5px em relação ao original de 18px).
   - Raio da borda: `18px`.
   - Espaçamento entre as duas dicas: `8px`.
