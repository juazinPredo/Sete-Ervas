# Relatório Técnico: Reorganização e Refatoração Estrutural do Projeto Sete Ervas

**Data:** 06 de Novembro de 2026  
**Versão:** 2.0  
**Status:** Concluído e Validado (0 Erros de Compilação no TypeScript)  
**Projeto:** Sete Ervas (React Native / Expo Router)

---

## 1. Resumo Executivo

Este documento descreve detalhadamente a reorganização de pastas, estruturação da arquitetura e correções nos códigos do projeto **Sete Ervas**.

Todas as partes ativas do código fonte foram unificadas dentro do diretório padrão `src/`, estabelecendo uma hierarquia modular de componentes reutilizáveis, módulos de autenticação, constantes e tipagens TypeScript. Todos os erros de compilação existentes foram identificados e corrigidos, garantindo 100% de integridade no `tsc`.

---

## 2. Diagnóstico da Estrutura Anterior e Problemas Encontrados

Antes da refatoração, o projeto apresentava as seguintes inconsistências:

1. **Pastas fora do `src/`:**
   - A pasta `components/` estava posicionada na raiz do projeto (`Sete-Ervas-main/components`), enquanto as rotas estavam em `src/app`. Isso despadronizava a árvore de código e dificultava a resolução de módulos.
2. **Pasta temporária `NovosComps`:**
   - Diversos componentes de login e cadastro foram adicionados dentro de `components/NovosComps/`.
   - As importações relativas dentro dessa pasta estavam redundantes e confusas (ex: `import { BotaoEntrar } from './../../components/NovosComps/BotaoEntrar'`).
3. **Duplicidade e Conflito de Componentes:**
   - Existiam duas versões de `BotaoCadastro.tsx`:
     - Uma na raiz de `components` com funcionalidade de toque longo (`handleLongPress`) e estilo verde.
     - Outra em `NovosComps/BotaoCadastro.tsx` voltada para redirecionamento após cadastro com estilo azul.
4. **Erros Críticos de TypeScript (`npx tsc --noEmit`):**
   - `CompLink.tsx`: Os parâmetros `children` e `onPress` não possuíam tipagem explícita, gerando erro `TS7031: Binding element implicitly has an 'any' type`.
   - `colecao.tsx`: Erro de digitação na propriedade de estilo `textAling: 'center'` gerando `TS2345: Property 'text' is incompatible... Did you mean to write 'textAlign'?`.
5. **Incompatibilidade com Dispositivos Móveis Nativos:**
   - Uso de `window.alert()`. O objeto global `window` existe apenas em ambiente Web. No Android e iOS (React Native puro), isso resultava em crash imediato (`ReferenceError: window is not defined`).
   - Propriedade `shadowOpacity: 100` em cartões (a API de estilos do React Native aceita valores entre `0` e `1`).

---

## 3. Nova Estrutura de Pastas (`src/`)

A árvore de arquivos foi consolidada em `src/` com a seguinte separação de responsabilidades:

```text
src/
├── app/                        # Telas e Rotas (Expo Router - File-based routing)
│   ├── (tabs)/                 # Navegação por Abas (Tab Navigator)
│   │   ├── _layout.tsx         # Configuração da barra de navegação inferior
│   │   ├── index.tsx           # Tela Início
│   │   ├── explorar.tsx        # Tela Explorar
│   │   ├── colecao.tsx         # Tela Coleção de Plantas
│   │   └── Login.tsx           # Tela de Acesso (Aba Perfil)
│   ├── _layout.tsx             # Layout raiz da aplicação (Stack Navigator)
│   └── cadastro.tsx            # Tela de Cadastro de Usuário
│
├── components/                 # Componentes Modulares e Reutilizáveis
│   ├── auth/                   # Módulo de Autenticação / Formulários
│   │   ├── Entrar.tsx          # Card e formulário de Login
│   │   ├── Registro.tsx        # Card e formulário de Cadastro
│   │   ├── Termos.tsx          # Switch/Checkbox de aceite dos Termos de Uso
│   │   └── index.ts            # Barrel file do módulo de autenticação
│   ├── ui/                     # Componentes Primitivos e Interface Geral
│   │   ├── BotaoCadastro.tsx   # Botão de Ação de Cadastro (Azul com navegação)
│   │   ├── BotaoEntrar.tsx     # Botão de Ação de Login (Azul com navegação)
│   │   ├── BotaoLongPress.tsx  # Botão com toque longo mantido da versão anterior
│   │   ├── CampoNome.tsx       # Input de Nome com feedback visual de foco
│   │   ├── Card.tsx            # Container responsivo CardLogin
│   │   ├── CompLink.tsx        # Link de texto clicável tipado
│   │   └── index.ts            # Barrel file do módulo UI
│   └── index.ts                # Ponto de exportação central de todos os componentes
│
├── constants/                  # Constantes e Tema da Aplicação
│   ├── colors.ts               # Paleta de cores centralizada (Primary, Background, etc.)
│   └── index.ts                # Barrel file de constantes
│
└── types/                      # Definições de Tipos Globais TypeScript
    └── index.ts                # Interfaces para botões, cards, links e formulários
```

---

## 4. Alterações Realizadas nos Códigos

### 4.1. Configuração de Path Aliases no `tsconfig.json`
Configurados aliases limpos para evitar importações relativas frágeis:
```json
"paths": {
  "@/*": ["./src/*"],
  "@components/*": ["./src/components/*"],
  "@/assets/*": ["./assets/*"]
}
```
Isso permite importar qualquer componente de forma limpa em qualquer nível do projeto:
```tsx
import { Entrar } from '@/components/auth/Entrar';
import { CardLogin, BotaoEntrar } from '@/components/ui';
```

### 4.2. Correção de Tipagem e Sintaxe
- **`CompLink.tsx`**: Interface `CompLinkProps` implementada com `children: React.ReactNode` e `onPress?: (event: GestureResponderEvent) => void`.
- **`colecao.tsx`**: Corrigido `textAling: 'center'` para `textAlign: 'center'`.
- **`Card.tsx`**: Interface `CardLoginProps` criada e ajuste em `shadowOpacity: 0.35`.
- **`Termos.tsx`**: Tipagem das propriedades de callback e estado controlado.

### 4.3. Compatibilidade Universal (Mobile e Web)
- Removidas chamadas de `window.alert()`, padronizando o uso nativo do `Alert.alert('Título', 'Mensagem')`.
- Otimização no carregamento de imagens de fundo (`BackLogin.jpg`) utilizando `require(...)` estático para total compatibilidade com o bundler Metro.

### 4.4. Barrel Exports (`index.ts`)
Criados arquivos de índice para permitir importações nomeadas limpas:
```tsx
// Importações simplificadas e elegantes
import { BotaoEntrar, CardLogin, CompLink } from '@/components/ui';
import { Entrar, Registro, Termos } from '@/components/auth';
```

---

## 5. Validação e Resultados dos Testes

Foi executada a verificação estrita de integridade com o compilador oficial TypeScript (`tsc`):

```bash
$ cd Sete-Ervas-main
$ npx tsc --noEmit
npm notice run socorro@1.0.0 npx
npm notice run tsc --noEmit
```

**Resultado:** `0 erros`. Compilação aprovada com 100% de conformidade.

---

## 6. Guia Prático para o Desenvolvimento Contínuo

1. **Criar uma nova tela:** Adicione um arquivo `.tsx` dentro de `src/app/` (ou em `src/app/(tabs)/` caso deva possuir a barra de abas inferior). O Expo Router registrará a rota automaticamente.
2. **Criar componentes visuais genéricos:** Crie dentro de `src/components/ui/` e adicione a exportação em `src/components/ui/index.ts`.
3. **Criar componentes de regras de negócio ou formulários:** Agrupe em `src/components/<modulo>/` (ex: `src/components/plantas/`).
4. **Utilizar cores padronizadas:** Importe as cores a partir de `@/constants/colors`.
