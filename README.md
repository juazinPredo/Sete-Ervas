# Sete Ervas 🌿 — Assistente Botânico & Horta Doméstica

> Aplicativo móvel para gerenciamento e rotina de cuidados com plantas, hortaliças e ervas medicinais, desenvolvido com **React Native**, **Expo (SDK 58)** e **TypeScript**.

---

##  Identificação Acadêmica
* **Aluno Desenvolvedor:** João Pedro Mendes**
* **Disciplina:** Programação para Dispositivos Móveis *
---

##  Proposta do Projeto
O cultivo caseiro de plantas e hortas frequentemente falha pela falta de rotina e conhecimento das particularidades de rega de cada espécie. O **Sete Ervas** resolve essa dor atuando como um assistente botânico de bolso:
- Centraliza a **coleção de plantas** do usuário com acompanhamento visual e fotográfico.
- Estabelece um **gerenciador diário de tarefas** com checklist persistente.
- Dispara **lembretes e notificações nativas** no aparelho no horário programado.
- Oferece um **catálogo botânico exploratório** completo com propriedades e orientações de cultivo.
- Funciona de forma **100% offline**, sem anúncios e sem necessidade de conexão com servidores.

---

##  Recursos Nativos Implementados (3 Recursos)
1. **Câmera Nativa (`expo-image-picker` / `launchCameraAsync`):**
   - Captura fotos em tempo real para identificação imediata das espécies na coleção, com permissão em tempo de execução e corte quadrado (1:1).
2. ** Galeria de Imagens do Sistema (`expo-image-picker` / `launchImageLibraryAsync`):**
   - Importação de fotos salvas no armazenamento interno do aparelho para o perfil de cada planta.
3. ** Sistema de Notificações e Alarmes Locais (`expo-notifications`):**
   - Canal nativo registrado no Android (`lembretes-sete-ervas`) com alta prioridade, vibração e luz botânica.
   - Agendamento diário de alarmes periódicos em background (`scheduleNotificationAsync`) e botão de teste imediato.

---

##  Tecnologias e Recursos Utilizados
- **React Native 0.88.1 & Expo SDK 58**
- **Expo Router (Tabs & Stack):** Navegação fluida por abas inferiores e telas empilhadas.
- **AsyncStorage (`@react-native-async-storage/async-storage`):** Persistência permanente em disco no formato chave-valor para plantas e tarefas.
- **FlatList:** Listagem de alto desempenho com virtualização de memória no catálogo botânico.
- **Context API (`PlantContext.tsx`):** Gerenciamento global e reativo do estado da coleção sem prop drilling.
- **React Hooks:** `useState`, `useEffect`, `useContext`, `useMemo`, `useWindowDimensions`.
- **TypeScript:** Tipagem estrita de contratos e dados (0 erros de compilação no `tsc --noEmit`).

---

##  Estrutura do Projeto
```bash
Sete-Ervas/
├── assets/                  # Imagens locais, ícones e base de dados JSON inicial
│   ├── Dados/               # colecao.json, dicas.json
│   └── images/              # Placeholders oficiais (Plantas-Rep) e ícones
├── Atualizacao/             # Relatórios técnicos e documento oficial de entrega (.md e .docx)
├── src/
│   ├── app/                 # Rotas do Expo Router ((tabs), cadastro.tsx, _layout.tsx)
│   ├── components/          # Componentes modulares (ui/ e auth/)
│   ├── constants/           # Cores e catálogo botânico (horta.json)
│   ├── context/             # PlantContext (Estado global da coleção)
│   ├── services/            # storage.ts (AsyncStorage) e notifications.ts (Expo Notifications)
│   └── types/               # Interfaces e tipagens TypeScript
├── app.json                 # Configuração oficial do app e permissões nativas
└── eas.json                 # Configuração de build para geração do APK
```

---

##  Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Expo Go](https://expo.dev/go) instalado no smartphone Android/iOS, ou emulador configurado.

### Passo a passo
```bash
# 1. Clone o repositório
git clone https://github.com/juazinPredo/Sete-Ervas.git

# 2. Acesse a pasta do projeto
cd Sete-Ervas

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npx expo start
```
Escaneie o QR Code exibido no terminal com o aplicativo **Expo Go** no celular.

---

##  Compilação do APK
O arquivo standalone de instalação (`.apk`) é gerado via **EAS Build**:
```bash
# Instalação do EAS CLI
npm install -g eas-cli

# Autenticação
eas login

# Disparo da compilação na nuvem do Expo
eas build -p android --profile preview
```

---

## 📄 Licença e Autoria
Desenvolvido por **João Pedro Mendes **
Projeto acadêmico sob licença MIT.
