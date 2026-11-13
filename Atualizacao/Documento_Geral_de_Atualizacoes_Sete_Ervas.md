# Dossiê Geral de Atualizações: Projeto Sete Ervas

**Versão:** 4.1 Consolidada  
**Data:** 12 de Novembro de 2026  
**Status do Compilador:** 0 Erros de Compilação no TypeScript (`npx tsc --noEmit`)  
**Plataforma:** React Native com Expo Router  

---

## 1. Resumo Executivo

Este documento consolida o histórico completo de todas as alterações arquiteturais, novos recursos, telas construídas, integrações de estado e correções visuais realizadas no projeto **Sete Ervas**.

---

## 2. Histórico Consolidado de Módulos

### 2.1. Tela de Início (Dashboard Principal) e PlantContext
* **Gerenciador de Estado Compartilhado (`src/context/PlantContext.tsx`):**
  * Conecta a Tela de Início à Coleção de Plantas de forma reativa.
  * Mantém plantas cadastradas, nível de vitalidade, histórico de rega e lista diária de tarefas.
  * Métricas calculadas em tempo real: total de plantas, tarefas pendentes e média de vitalidade.
* **Componente da Tela de Início (`src/app/(tabs)/index.tsx`):**
  * **Header Padrão:** Identidade visual `SETE ERVAS` com saudação harmoniosa (*"Olá 🌿 / Suas plantas estão prosperando"*).
  * **Card "Resumo Hoje":** Badge `85% SAÚDE`, três colunas métricas (*plantas*, *para regar*, *vitalidade*) e barra de progresso horizontal em verde neon (`#10DE80`).
  * **Carrossel "Minhas plantas":** Rolagem horizontal suave com cards botânicos, badge flutuante de saúde (ex: `92%`), nome e indicador de última rega (`🕒 há 2 dias`), além do botão **"Ver tudo >"** para navegação imediata à Coleção.
  * **Tarefas de hoje:** Checklist com checkbox interativo em formato circular, ícone de gota d'água (`Ionicons water`) e atualização dinâmica do painel de resumo ao concluir tarefas.

---

### 2.2. Tela de Coleção e Câmera Nativa (`expo-image-picker`)
* **Grade Visual em 2 Colunas (`src/app/(tabs)/colecao.tsx`):**
  * Apresenta todas as plantas do usuário (Monstera, Suculenta, Jiboia, Espada de São Jorge, Samambaia, Alecrim).
  * Botão de coração para marcar espécies favoritas.
  * Botão sobreposto na foto **"Adicionar foto +"** que dispara a câmera nativa do aparelho e atualiza a imagem daquela planta.
  * Botão flutuante `BotaoAdicionar` (+) para cadastrar novas espécies fotografadas diretamente na coleção.

---

### 2.3. Padronização Global do Header e Limpeza Visual
* **Componente `HeaderPadrao` (`src/components/ui/HeaderPadrao.tsx`):**
  * Nome do aplicativo: `SETE ERVAS` com ponto verde neon (`#10DE80`).
  * Saudação unificada: *"Olá 🌿"* e *"Suas plantas estão prosperando"*.
  * **Canto Superior Direito Limpo:** Removidos o sino de notificações, badge de alerta e avatar de usuário ("J").
* **Aplicação:** Incorporado nas telas `index.tsx` (Início), `explorar.tsx` (Explorar) e `colecao.tsx` (Coleção).
* **Telas de Autenticação (`Login.tsx` e `cadastro.tsx`):**
  * Removido o `ImageBackground` (`BackLogin.jpg`).
  * Adotado o fundo escuro padrão `#05110E`, com formulários perfeitamente centralizados e sem o cabeçalho.

---

### 2.4. Tela de Explorar e Catálogo de Plantas em JSON
* **Base de Dados (`src/constants/horta.json`):** 30 espécies botânicas completas com 7 dicas de cultivo.
* **Barra de Pesquisa:** Busca instantânea por nome comum, científico ou propriedades.
* **Chips de Categoria:** Filtros dinâmicos (*Todas*, *Erva Aromática*, *Medicinal*, *Condimento*, *Hortaliça Folhosa*, *Outras*).
* **Grade de Plantas:** Cards com foto, tag flutuante e ícone de brilho.
* **Modal de Detalhes:** Apresenta foto ampliada, instruções de *"Como Cuidar"* e *"Benefícios"*.
* **Ajuste Fino:** Redução de 5px na altura da foto do modal e elevação do topo (`height: 52px`), eliminando qualquer sobreposição do botão de fechar **X**.

---

### 2.5. Correção e Otimização de Fotos Botânicas
* Acervo de imagens botânicas reais em alta definição integradas ao catálogo e à coleção (Monstera, Alecrim, Cebolinha, Tomilho, Sálvia, Poejo, Arruda, Rúcula, Couve-manteiga, Gengibre, Suculenta, Jiboia, Espada de São Jorge, Samambaia).

---

### 2.6. Reorganização Estrutural em `src/`
* Diretórios padronizados: `src/app`, `src/components/ui`, `src/components/auth`, `src/constants`, `src/context` e `src/types`.
* Path aliases configurados no `tsconfig.json` (`@/*`, `@components/*`, `@/assets/*`).
* Tipagem forte TypeScript com zero avisos.

---

### 2.7. Carrossel de Dicas de Cuidados na Tela de Início
* **Componente Modular (`src/components/ui/CarrosselDicas.tsx`):**
  * Inserido no feed da página inicial (`src/app/(tabs)/index.tsx`), posicionado abaixo do `HeaderPadrao` e antes do `CardTarefas`.
  * Topo padronizado com **DICA 💡** em negrito e badge de categoria da espécie.
  * Nome da planta em negrito com emoji botânico correspondente.
  * Exibição de exatamente **dois pontos essenciais de dicas** (Luz de Sol e Rega) com ícones dedicados e descrições práticas.
* **Base de Dados Externa (`assets/Dados/dicas.json`):**
  * Dados desacoplados da lógica em arquivo JSON dedicado, permitindo fácil manutenção e expansão.
* **Avanço Automático e Desempenho:**
  * Timer contínuo de 4 segundos com transição suave e loop infinito.
  * Controle com `useRef` para evitar re-renderizações desnecessárias.
  * Pausa inteligente de 5 segundos quando o usuário toca ou arrasta o card manualmente.
  * Layout compacto com padding reduzido em 5px e remoção total de setas e dots para visual limpo.

---

### 2.8. Sistema de Notificação com Validação de Horário em Tarefas
* **Opção "Notificar" no `CardTarefas.tsx`:**
  * Botão interativo com ícone de sino (`notifications`) que expande o campo numérico de horário.
  * Bloqueio estrito de caracteres não numéricos (letras e símbolos são rejeitados instantaneamente).
  * Máscara automática no formato `HH:MM`.
  * Validação em tempo real: horas travadas no intervalo de `00` a `23` e minutos de `00` a `59`, impedindo horários inviáveis (como `28:90`).
  * Remoção completa de bordas ou anéis de foco brancos (`outlineWidth: 0`, `outlineColor: 'transparent'`).
  * Exibição de badge com horário e ícone de sino nos cards de tarefas salvas.

---

### 2.9. Edição e Alteração de Tarefas via Menu de 3 Pontos e Fechamento Ágil
* **Ícone de 3 Pontos Vertical (`more-vertical`):**
  * Inserido em cada card de tarefa ao lado do botão de exclusão.
* **Modal Dedicado de Alteração:**
  * Abre uma janela suspensa transparente no tema escuro do app (`#072019`).
  * Permite renomear o texto da tarefa e alterar/ativar/desativar o horário de lembrete com a mesma validação numérica estrita.
  * Botões de "Cancelar" e "Salvar", aplicando a atualização reativa no estado local.
* **Fechamento Automático do Formulário:**
  * Ao pressionar o botão de adicionar (`+`), a tarefa é adicionada e o formulário *"Escreva a nova tarefa"* se fecha automaticamente, otimizando o espaço da tela.

---

### 2.10. Manutenção do Padrão Visual Original
* **Paleta Original Consolidada:**
  * Fundo escuro original em `#05110E`.
  * Cards e superfícies em `#0B2B22` com bordas sutis em `#134233`.
  * Destaques, botões ativos e ícones em verde neon `#10DE80`.
  * Textos principais em branco puro `#FFFFFF` e secundários em tons suaves (`#8A9A93`, `#7EA293`).
* **Preservação de Todas as Funcionalidades:**
  * Todas as otimizações funcionais desenvolvidas (Carrossel dinâmico via JSON, sistema de notificação por hora válida, modal de edição e fechamento inteligente de inputs) foram mantidas 100% integradas.

---

### 2.11. Migração dos Dados da Coleção para JSON Externo e Estado Vazio
* **Criação do Banco de Dados JSON (`assets/Dados/colecao.json`):**
  * As plantas base da coleção deixaram de ficar inseridas no código-fonte e agora residem em um arquivo `.json` dedicado na pasta de dados (`assets/Dados/colecao.json`).
  * O arquivo inicia como um array vazio (`[]`), respeitando a remoção dos dados fictícios e permitindo alimentação direta via JSON ou cadastro no app.
* **Consumo Dinâmico no Contexto (`src/context/PlantContext.tsx`):**
  * O estado global `PlantContext` agora importa e consome diretamente `colecaoData` de `assets/Dados/colecao.json`, centralizando o gerenciamento de dados em formato desacoplado.
* **Componente de Estado Vazio Amigável (`src/app/(tabs)/colecao.tsx`):**
  * Quando não houver plantas na coleção, o app renderiza um card pontilhado elegante convidando o usuário a fotografar e cadastrar sua primeira espécie pelo botão de adicionar ou pela câmera nativa.

---

### 2.12. Modal Completo de Cadastro de "Nova Planta" na Coleção
* **Acionamento Amigável:**
  * O modal abre ao clicar no botão "Adicionar" do cabeçalho, no botão flutuante `+` ou no card de coleção vazia.
* **Formulário com Campos Específicos:**
  * **Foto da Planta:** Opção de tirar foto instantânea com a câmera nativa, escolher imagem da galeria ou utilizar automaticamente uma foto botânica padrão de alta definição correspondente à categoria selecionada.
  * **Nome da Planta:** Campo de texto com validação obrigatória e foco limpo sem borda branca.
  * **Categoria Selecionável:** Chips interativos para as 4 categorias solicitadas: *Chás*, *Flor / Ornamento*, *Horta / Tempero* e *Suculenta / Cacto*.
  * **Água por Dia:** Campo com ícone de gota d'água (`Ionicons water-outline`) e atalhos rápidos (*1x ao dia*, *2x ao dia*, *A cada 2 dias*, *1x na semana*).
* **Exibição nos Cards da Coleção:**
  * Os cards salvos agora exibem o nome, foto nítida e desobstruída (botão sobreposto "Adicionar foto" removido para limpeza visual), data de plantio, tag da categoria e badge de água diária (ex: `💧 1x ao dia`).

---

### 2.13. Integração dos Placeholders Locais da Coleção (`Plantas-Rep`)
* **Vínculo Direto com o Acervo Local (`assets/images/Plantas-Rep/`):**
  * As imagens locais do projeto foram mapeadas para cada categoria botânica da coleção:
    * `Chás` ➔ `Chás.jpg`
    * `Flor / Ornamento` ➔ `Flor-ornamento.jpg`
    * `Horta / Tempero` ➔ `Horta-tempero.jpg`
    * `Suculenta / Cacto` ➔ `Suculenta-cactos.jpg`
* **Resolver Híbrido e Dinâmico:**
  * Implementada a função `resolverOrigemImagem`, capaz de renderizar perfeitamente tanto fotos locais (`require(...)`) quanto fotos da câmera e galeria (`file://` ou `content://`), sem quebrar a interface.
  * O modal de cadastro agora exibe o placeholder correspondente em tempo real conforme o usuário alterna as categorias.

---

### 2.14. Menu de 3 Pontos para Configurações e Edição de Plantas
* **Acesso Direto nos Cards:**
  * Ao tocar no ícone de 3 pontos verticais (`Feather more-vertical`), abre-se o modal *"Configurações da Planta"* pré-preenchido com os dados atuais da espécie selecionada.
* **Recursos de Alteração:**
  * **Nome da Espécie:** Permite renomear a planta com validação em tempo real.
  * **Categoria:** Permite trocar entre as 4 categorias, atualizando o placeholder visual caso a planta não possua foto personalizada.
  * **Água por Dia:** Permite ajustar a frequência de rega com campo de texto livre e chips de sugestão rápida.
  * **Gerenciamento de Foto:** Permite fotografar uma nova imagem pela câmera, escolher da galeria ou resetar para o placeholder da categoria, com a imagem limpa e sem etiquetas flutuantes de "Placeholder".
  * **Exclusão Efetiva:** Botão dedicado que apaga a planta imediatamente do estado global da coleção e fecha o modal, operando perfeitamente tanto em ambiente Web quanto Mobile.
* **Atualização no Estado Global:**
  * Implementados os métodos `atualizarPlanta` e `removerPlanta` no `PlantContext.tsx`, persistindo as alterações no estado compartilhado do aplicativo.

---

### 2.15. Harmonização Cromática das Telas de Autenticação (Login e Cadastro)
* **Eliminação de Estilos Legados e Contraste Desarmônico:**
  * Removidos os fundos cinza claro de template (`#d3d3d3`), botões em azul padrão (`#007BFF`), links em azul comum (`#0066CC`) e inputs brancos com contornos pretos duros (`#050505`).
* **Padronização na Paleta Botânica Noturna do App:**
  * **Card de Autenticação (`src/components/ui/Card.tsx`):** Fundo verde profundo `#0B2B22`, borda elegante `#134233`, cantos arredondados de 22px e sombra suave.
  * **Campos de Entrada (`Entrar.tsx`, `Registro.tsx` e `CampoNome.tsx`):** Fundo `#072019`, bordas `#134233` com foco ativo em `#10DE80`, texto em branco `#FFFFFF`, placeholders em `#5C8274` e rótulos estruturados em `#8A9A93`.
  * **Ícone de Exibição de Senha:** Integrado ergonomicamente dentro do próprio campo de texto da senha, com ícone `#10DE80`, eliminando o posicionamento deslocado para fora do input.
  * **Botões Principais (`BotaoEntrar.tsx` e `BotaoCadastro.tsx`):** Preenchimento em verde vivo `#10DE80`, texto escuro `#052014` para contraste legível e efeito de clique em `#0EB86B`.
  * **Links e Ações Secundárias (`CompLink.tsx` e `Termos.tsx`):** Links estilizados em verde vibrante `#10DE80` conectando Login e Cadastro de forma intuitiva, além de switch de termos com trilha `#134233` e chave seletora `#10DE80`.
  * **Navegação de Retorno (`src/app/cadastro.tsx`):** Barra superior com botão "Login" e seta de retorno rápido para a tela de autenticação principal.

---

### 2.16. Implementação de Persistência Permanente com AsyncStorage
* **Instalação Oficial do Módulo Expo:**
  * Adicionado `@react-native-async-storage/async-storage` compatível com Expo SDK 58 e React Native 0.88.
* **Criação do Serviço Centralizado (`src/services/storage.ts`):**
  * Métodos utilitários tipados e protegidos com `try/catch` para salvar, buscar, remover e limpar dados serializados em JSON.
  * Dicionário de chaves do aplicativo (`CHAVES_STORAGE.COLECAO_PLANTAS`, `USUARIO_LOGADO`, etc.) para evitar strings soltas no código.
* **Integração no Contexto Global (`src/context/PlantContext.tsx`):**
  * Carregamento assíncrono na montagem inicial com fallback para `assets/Dados/colecao.json`.
  * Atualizador funcional `atualizarEPersistir` que salva imediatamente no armazenamento local qualquer alteração (inclusão de nova planta, edição de dados, troca de foto, remoção ou favoritar).
  * Flag de estado `carregando` exposta para os componentes.
* **Persistência Completa das Tarefas Diárias (`src/components/ui/CardTarefas.tsx`):**
  * Vinculada a chave `CHAVES_STORAGE.TAREFAS_CUIDADOS` no componente da Home.
  * Todas as tarefas adicionadas, alteradas (pelo menu de 3 pontos), marcadas como concluídas (checkbox) ou excluídas agora são salvas e restauradas automaticamente entre sessões.
* **Experiência Visual na Coleção (`src/app/(tabs)/colecao.tsx`):**
  * Inserção de indicador de carregamento (`ActivityIndicator` verde `#10DE80`) durante a leitura inicial do disco, prevenindo oscilações na interface antes da renderização dos dados salvos.

---

### 2.17. Integração de Notificações Locais Personalizadas (`expo-notifications`)
* **Instalação e Suporte Nativo:**
  * Pacote `expo-notifications` instalado via `expo install`, alinhado com Expo SDK 58 e React Native 0.88.
* **Serviço Centralizado de Notificações (`src/services/notifications.ts`):**
  * Handler em primeiro plano configurado com suporte a banners e sons no Expo 58 (`shouldShowBanner: true`, `shouldShowList: true`, `shouldShowAlert: true`, `shouldPlaySound: true`).
  * Criação automática do canal Android (`lembretes-sete-ervas`) com alta prioridade, vibração e luz verde botânica `#10DE80`.
  * Funções utilitárias: solicitação de permissões nativas/web, agendamento de alarme diário (`agendarNotificacaoDiaria`), cancelamento de alarme existente (`cancelarNotificacao`) e disparo imediato para testes instantâneos (`dispararNotificacaoInstantanea`).
* **Conexão no Card de Tarefas (`src/components/ui/CardTarefas.tsx`):**
  * As tarefas com lembrete agora agendam automaticamente o alarme diário no horário exato configurado (ex: `08:00`), guardando o `idNotificacao` junto ao item salvo no AsyncStorage.
  * Ao alterar o horário ou desmarcar a notificação (via modal de 3 pontos), a notificação anterior é cancelada e a nova é reprogramada.
  * Ao excluir uma tarefa, seu alarme agendado é cancelado do sistema operacional.
  * Inclusão do botão *"Testar"* no formulário e no modal, permitindo disparar uma notificação instantânea personalizada na hora para validação imediata do usuário.

---

### 2.18. Preparação para Entrega Final e Atendimento aos Critérios Acadêmicos
* **Configuração Oficial do App (`app.json`):**
  * Atualizados o nome do app para *"Sete Ervas"*, slug `sete-ervas` e esquema `seteervas`.
  * Definido o identificador de pacote Android (`com.seteervas.app`), essencial para a geração do APK.
  * Declaradas as permissões e plugins nativos de Câmera, Galeria de Fotos e Notificações.
* **Arquivo de Build EAS (`eas.json`):**
  * Configurado o perfil `preview` com `buildType: "apk"`, viabilizando a compilação do instalador Android sem dependências de lojas de aplicativos.
* **Virtualização com FlatList (`src/app/(tabs)/explorar.tsx`):**
  * Refatoração da listagem do catálogo botânico para o componente `FlatList`, incorporando virtualização de alta performance, cabeçalho e estado vazio desacoplados.

---

### 2.19. Card de Identificação Acadêmica e Autoria do Desenvolvedor
* **Criação do Componente Dedicado (`src/components/ui/CardSobre.tsx`):**
  * Card estilizado na paleta escura do projeto (`#0B2B22` com contorno `#134233` e cantos de 22px).
  * Exibição do texto formal de autoria: aluno **João Pedro Mendes do Nascimento**, matrícula **25214290017**, e objetivo do projeto no auxílio de plantas e hortas caseiras.
  * Botão de ação interativo com ícone do GitHub e abertura direta via `Linking.openURL` apontando para `https://github.com/juazinPredo`.
* **Inserção na Tela Inicial (`src/app/(tabs)/index.tsx`):**
  * Posicionado no rodapé da Home logo abaixo do carrossel de dicas, complementando a apresentação do projeto de forma elegante.

---

## 3. Validação do Compilador

```bash
$ npx tsc --noEmit
# Resultado: 0 erros encontrados!
```
