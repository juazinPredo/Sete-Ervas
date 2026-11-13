# PROJETO FINAL — DESENVOLVIMENTO MOBILE
## APLICATIVO SETE ERVAS 🌿

---

### Dados de Identificação do Aluno
* **Nome do Aluno:** João Pedro Mendes do Nascimento
* **Matrícula:** 25214290017
* **Repositório no GitHub:** [https://github.com/juazinPredo](https://github.com/juazinPredo)
* **Arquivo de Instalação (APK):** `sete-ervas.apk` (anexado nesta atividade)
* **Data da Entrega:** Novembro de 2026

---

### 1. Nome do Aplicativo e Descrição do Problema que Busca Resolver

* **Nome do Aplicativo:** Sete Ervas

* **Descrição do Problema e Necessidade:**
Cultivar plantas, hortaliças e ervas medicinais em casa ou em apartamentos é um hábito cada vez mais presente na rotina das pessoas, mas que frequentemente esbarra na falta de conhecimento prático e na desorganização dos cuidados básicos. Na realidade do dia a dia, a maioria das pessoas perde suas mudas por dois motivos muito comuns: ou se esquecem de regar no intervalo correto, ou exageram na água por não saberem a necessidade biológica de cada espécie.

Além disso, grande parte dos aplicativos de jardinagem disponíveis no mercado é pesada, repleta de anúncios invasivos e exige conexão contínua com a internet — o que se torna um obstáculo quando o usuário cuida de plantas em quintais, sacadas ou locais com sinal instável.

O **Sete Ervas** resolve essa necessidade de forma prática e descomplicada. Ele funciona como um assistente botânico de bolso que centraliza a coleção do usuário, estabelece uma rotina de tarefas com lembretes automáticos no celular e disponibiliza um catálogo com fichas técnicas de dezenas de ervas medicinais e temperos, operando de forma totalmente offline e sem necessidade de conexão com servidores externos.

---

### 2. Principais Funcionalidades Implementadas

O aplicativo foi estruturado com uma interface visual limpa no tema botânico noturno e navegação por abas inferiores (*Tabs*):

1. **Gestão da Coleção Pessoal (CRUD Completo de Plantas):**
   * **Cadastro Personalizado:** Permite registrar novas plantas selecionando entre quatro categorias principais (*Chás*, *Flor / Ornamento*, *Horta / Tempero* e *Suculenta / Cacto*), informando a frequência de água por dia e associando uma fotografia.
   * **Visualização da Coleção:** Grid interativo de duas colunas exibindo o nome, foto, categoria botânica, data de plantio, frequência hídrica e botão rápido para favoritar.
   * **Edição via Menu de 3 Pontos:** Ao tocar no menu contextual de qualquer card, abre-se um modal pré-preenchido onde o usuário pode alterar o nome da planta, categoria, rotina de rega e atualizar a foto.
   * **Exclusão Efetiva:** Opção direta de remover a espécie da coleção, com atualização imediata no armazenamento permanente.

2. **Gerenciador de Tarefas Diárias de Cuidados:**
   * Checklist dinâmico na tela inicial para registro de ações cotidianas (rega, adubação, poda ou controle de pragas).
   * Marcação de conclusão através de checkbox interativo, mantendo o histórico marcado entre sessões.
   * Menu contextual em cada tarefa para alteração de texto, reprogramação de horário ou exclusão.

3. **Lembretes e Notificações Automáticas no Sistema:**
   * Configuração de horário de lembrete diário em formato numérico validado (`HH:MM`).
   * Agendamento de alarmes no sistema operacional do aparelho, garantindo que o usuário seja avisado na hora certa mesmo com o celular bloqueado ou com o app fechado.
   * Botão de teste imediato para validação instantânea do disparo da notificação.

4. **Catálogo Exploratório de Ervas e Hortaliças:**
   * Acervo com dezenas de espécies de ervas aromáticas, medicinais, condimentos e hortaliças carregadas a partir de banco de dados estruturado.
   * Barra de pesquisa com busca em tempo real por nome popular, nome científico ou benefícios à saúde.
   * Filtros rápidos por chips de categorias botânicas.
   * Modal inferior com ficha técnica completa: categoria, como cuidar, necessidades de rega e propriedades terapêuticas.

5. **Carrossel de Dicas e Curiosidades Botânicas:**
   * Carrossel horizontal na tela inicial com rolagem fluida e indicadores de paginação, apresentando orientações práticas sobre drenagem de vasos, luminosidade adequada e adubação orgânica.

6. **Módulo de Autenticação e Perfil:**
   * Telas de Login e Cadastro harmonizadas na identidade visual do app, com campos seguros para senha (ícone de visualização embutido), validação de termos e fluxo de navegação de retorno.

7. **Card de Autoria e Identificação Acadêmica:**
   * Componente fixado na tela inicial contendo os dados oficiais do aluno, número de matrícula e botão interativo com direcionamento externo para o repositório do projeto no GitHub.

---

### 3. Recursos Tecnológicos Utilizados

O desenvolvimento seguiu padrões consolidados de arquitetura mobile com componentização modular e separação de responsabilidades:

* **React Native (0.88.1) & Expo SDK 58:**
  Utilização da versão mais recente da plataforma Expo gerenciada, garantindo alta performance nativa e suporte multiplataforma.

* **Navegação com Expo Router (Tabs & Stack):**
  Arquitetura moderna de roteamento baseada em arquivos, integrada ao React Navigation. Permite transições entre abas inferiores flutuantes (`index`, `explorar`, `colecao`, `Login`) e telas empilhadas secundárias (`cadastro`).

* **Gerenciamento Global com Context API (`PlantContext.tsx`):**
  Centralização do estado global das plantas da coleção. Evita o repasse desnecessário de propriedades (*prop drilling*) e permite que qualquer tela do aplicativo acione métodos de inclusão, alteração, exclusão e contagem de itens.

* **Hooks Estruturais do React:**
  * `useState`: Gerenciamento do estado local de formulários, controle de modais, inputs de texto e status de carregamento.
  * `useEffect`: Execução de ciclos de vida dos componentes, recuperação assíncrona dos dados salvos no disco e sincronização de eventos.
  * `useContext`: Consumo limpo e desacoplado dos dados globais da coleção.
  * `useMemo`: Otimização da busca e filtragem de plantas no catálogo exploratório, evitando renderizações desnecessárias ao digitar.
  * `useWindowDimensions`: Detecção dinâmica das dimensões da tela para adaptação de layouts entre celulares e tablets.

* **Persistência Permanente com AsyncStorage (`@react-native-async-storage/async-storage`):**
  Criação de um serviço modular (`src/services/storage.ts`) com métodos tipados (`salvarDados`, `buscarDados`, `removerDados`, `limparTudo`) protegidos por blocos `try/catch`. Grava os dados localmente no formato chave-valor (`@sete_ervas:colecao` e `@sete_ervas:tarefas`), garantindo persistência completa e funcionamento totalmente offline.

* **Virtualização com FlatList (`src/app/(tabs)/explorar.tsx`):**
  Renderização de alto rendimento do catálogo botânico através do componente `FlatList`, utilizando reciclagem de memória para exibição em duas colunas, com cabeçalho de busca desacoplado (`ListHeaderComponent`) e tratamento de busca sem resultados (`ListEmptyComponent`).

* **Componentização Modular e Design System:**
  Desenvolvimento de componentes reutilizáveis de interface em `src/components/ui/` (`Card`, `HeaderPadrao`, `CardTarefas`, `CardSobre`, `CarrosselDicas`, `BotaoAdicionar`, `BotaoEntrar`, `BotaoCadastro`, `CompLink`, `Termos`), padronizados em uma paleta botânica noturna escura (`#05110E`, `#0B2B22`, `#10DE80`, `#134233`).

* **TypeScript em Modo Estrito:**
  Contratos de dados rigorosamente tipados (`PlantaColecao`, `TarefaItem`, `Planta`), assegurando previsibilidade e ausência de falhas em tempo de execução, com compilação limpa no `tsc --noEmit`.

---

### 4. Recursos Nativos Implementados (3 Recursos)

A disciplina exigiu a utilização obrigatória de pelo menos dois recursos nativos estudados ao longo do semestre. O projeto **Sete Ervas** implementou **três recursos nativos plenamente funcionais**:

1. **Câmera Nativa do Dispositivo (`expo-image-picker` / `launchCameraAsync`):**
   * **Implementação Técnica:** Na tela de coleção e no modal de edição, o usuário pode capturar fotos em tempo real. O app solicita a permissão do sistema operacional (`requestCameraPermissionsAsync`), aciona a câmera nativa do smartphone com proporção quadrada (`aspect: [4, 4]`) e salva a URI do arquivo gerado para exibição imediata no card correspondente.

2. **Galeria de Fotos do Sistema Operacional (`expo-image-picker` / `launchImageLibraryAsync`):**
   * **Implementação Técnica:** Permite que o usuário selecione imagens já salvas no armazenamento interno do aparelho. Solicita autorização de acesso à mídia (`requestMediaLibraryPermissionsAsync`), abre o seletor padrão do Android e importa a foto selecionada com recorte otimizado.

3. **Sistema de Notificações Locais e Alarmes do SO (`expo-notifications`):**
   * **Implementação Técnica:** Criado um serviço centralizado (`src/services/notifications.ts`) que configura um canal nativo no Android (`lembretes-sete-ervas`) com alta prioridade, vibração e luz botânica. O app gerencia permissões de execução e programa alarmes diários recorrentes no sistema operacional através de `scheduleNotificationAsync` com gatilho `SchedulableTriggerInputTypes.DAILY`, além de cancelar alarmes órfãos (`cancelScheduledNotificationAsync`) quando tarefas são excluídas.

---

### 5. Arquivo de Instalação (APK)

* **Nome do Arquivo Gerado:** `sete-ervas.apk`
* **Identificador de Pacote Android:** `com.seteervas.app`
* **Ambiente de Build:** Compilado com sucesso via EAS Build no perfil `preview` (`buildType: "apk"`).
* **Compatibilidade:** Android 8.0 (API 26) ou superior, funcionando de maneira autônoma sem a necessidade do Expo Go instalado no aparelho de teste.

---

### 6. Roteiro Prático para a Apresentação Presencial (2,0 Pontos)

Para a arguição com o professor, a apresentação pode ser conduzida em duas etapas bem estruturadas:

#### A. Demonstração Prática do Aplicativo (1,0 ponto):
1. **Início (Home):** Abrir o app no celular com o APK instalado, mostrar o carrossel de dicas botânicas e marcar uma tarefa de cuidado na lista.
2. **Recurso Nativo 1 (Notificações):** Criar uma tarefa com lembrete de horário e tocar no botão *"Testar"* para demonstrar a notificação descendo na barra de status do celular em tempo real.
3. **Recurso Nativo 2 e 3 (Câmera e Galeria):** Acessar a aba Coleção, clicar em "Adicionar", fotografar um objeto ou planta com a câmera nativa, salvar e mostrar o card gerado na coleção.
4. **Persistência (AsyncStorage):** Fechar o aplicativo completamente no gerenciador de tarefas do Android e abri-lo novamente para comprovar que a nova planta e a tarefa marcada permanecem salvas localmente.
5. **Catálogo & Virtualização (FlatList):** Acessar a aba Explorar, digitar um termo na busca para demonstrar o filtro em tempo real e abrir o modal de detalhes de uma planta.

#### B. Defesa Técnica e Domínio do Código (1,0 ponto):
* **Context API & Arquitetura:** Explicar que os dados da coleção ficam centralizados no `PlantContext.tsx`, permitindo que adições, exclusões e edições reflitam instantaneamente em toda a aplicação sem acoplamento.
* **Persistência com AsyncStorage:** Demonstrar o arquivo `storage.ts`, explicando que as listas são serializadas em JSON e gravadas no armazenamento interno do aparelho com tratamento de erro em `try/catch`.
* **Desempenho com FlatList:** Justificar a escolha do `FlatList` na tela Explorar pela capacidade de virtualizar a lista, economizando memória RAM ao reaproveitar células conforme o usuário rola a página.
* **Recursos Nativos:** Destacar que as permissões de câmera e notificações são tratadas em tempo de execução para respeitar as exigências de privacidade do Android moderno.
