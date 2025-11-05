# DashMottu - Sistema de Gestão Logística de Motos
**Entregável da Sprint 4 – Desafio Mottu**  
**Mobile Application Development – 2TDSPY**

## 👥 Desenvolvido por:
- **Felipe Seiki Hashiguti** - RM: 98985
- **Lucas Corradini Silveira** - RM: 555118  
- **Matheus Gregorio Mota** - RM: 557254

## 📱 Escopo do Aplicativo
O DashMottu é um aplicativo mobile desenvolvido em React Native (Expo) + TypeScript, focado na gestão logística de motos. O sistema permite o cadastro completo de motos, usuários e pátios, facilitando o controle e rastreamento de veículos em diferentes unidades operacionais.

### Principais Funcionalidades:
- 🔐 **Sistema de Autenticação** - Login e registro de usuários
- 🏍️ **Gestão de Motos** - Cadastro, visualização e controle de status
- 👥 **Gerenciamento de Usuários** - Cadastro e edição de perfis por pátio
- 🏢 **Controle de Pátios** - Cadastro e administração de unidades
- 📊 **Dashboard Administrativo** - Visão geral e controle total do sistema
- 📱 **Interface Responsiva** - Adaptada para diferentes tamanhos de tela

## 🛠️ Funcionalidades Implementadas

### ✅ App Completo (40 pts)
- **Todas as telas funcionais**: Login, Register, Home, Dashboard, DashboardAdmin, RegisterMoto, RegisterPatio, EditUsers
- **Navegação fluida**: React Navigation com rotas protegidas e públicas
- **Formulários com validação**: Validação de campos e feedback visual
- **Indicadores de carregamento**: Loading states em operações assíncronas
- **Sistema de autenticação**: Context API para gerenciamento de estado global

### ✅ Publicação e Testes (35 pts)
- **QR Code Expo**: Disponível para teste imediato
- **README atualizado**: Com todas as informações necessárias
- **Hash do commit final**: `7004d1bc9c914bde3d02fadd8532477a6cdf960d`

### ✅ Integração com Dados (25 pts)
- **CRUD Completo**: Implementado com AsyncStorage
  - **Motos**: Cadastro, listagem, edição e exclusão
  - **Usuários**: Cadastro, listagem, edição e exclusão
  - **Pátios**: Cadastro, listagem, edição e exclusão
- **Persistência Local**: Dados salvos no dispositivo via AsyncStorage
- **Mockdb Service**: Sistema completo de gerenciamento de dados

## 🚀 Tecnologias Utilizadas
- **React Native (Expo SDK 54.0.0)** - Framework cross-platform
- **TypeScript** - Tipagem estática e melhor manutenibilidade
- **React Navigation 7.x** - Navegação entre telas
- **Styled Components** - Estilização de componentes
- **React Native Elements** - Biblioteca de componentes UI
- **AsyncStorage** - Persistência de dados local
- **Context API** - Gerenciamento de estado global

## 📥 Instalação e Execução

### Pré-requisitos
- Node.js 16+
- Expo Go instalado no dispositivo móvel
- Git

### Passos de Instalação
```bash
# Clone o repositório
git clone https://github.com/felipeSeiki/Sprint1Mobile.git

# Navegue para o diretório
cd Sprint1Mobile

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

## 📱 Como Testar o Aplicativo

### QR Code para Teste Imediato:
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▄▄▄ ▀▄▀█▄█ ▄▄▄▄▄ █
█ █   █ ██▄▀ █  ▀▀█ █   █ █
█ █▄▄▄█ ██▀▄ ▄▀████ █▄▄▄█ █
█▄▄▄▄▄▄▄█ ▀▄█ ▀▄█ █▄▄▄▄▄▄▄█
█ ▄▀▄▄▀▄▀█▄▀█▄▀█ ▀█▄█▀█▀▀▄█
█      ▄ ▄▄██▄▄▄▄ ▀███▄▀▀ █
█ █▀  █▄▀   █▀█▄ █ ▄▀▀█▀ ██
█ ▄█ ▄▀▄ █ ██▀▄▀ ▄▀ ██▄▀  █
█▄██▄▄█▄█ ▄  ▄▄ █ ▄▄▄  ▄▀▄█
█ ▄▄▄▄▄ ██▀█▀▄  █ █▄█ ███ █
█ █   █ █  █▄ ▀█▄ ▄  ▄ █▀▀█
█ █▄▄▄█ █▀█  ▀█▄ ▄█▀▀▄█   █
█▄▄▄▄▄▄▄█▄▄▄▄██▄▄▄▄█▄▄███▄█
```

### Instruções de Teste:
1. **Android**: Baixe o "Expo Go" na Play Store
2. **iOS**: Use a câmera nativa do iPhone
3. **Escaneie o QR Code** acima
4. **Teste as funcionalidades**:
   - Faça login com usuário: `admin@mottu.com` / senha: `123456`
   - Navegue pelas telas
   - Teste cadastro de motos, usuários e pátios
   - Verifique o dashboard administrativo

## 🎨 Design e Prototipação
**Link do Figma**: [Protótipo DashMottu](https://www.figma.com/design/seu-projeto-figma)

## 📊 Status da Entrega Sprint 4
- ✅ **App Completo (40 pts)** - Todas as telas funcionais e navegação fluida
- ✅ **Publicação e Testes (35 pts)** - QR Code gerado e documentação completa  
- ✅ **Integração com Dados (25 pts)** - CRUD completo implementado

## 🔐 Usuários de Teste
- **Admin**: `admin@mottu.com` / `123456`
- **Operador**: `operador@mottu.com` / `123456`

## 📋 Hash do Commit Final
```
7004d1bc9c914bde3d02fadd8532477a6cdf960d
```

## 🌐 Links Úteis
- **Repositório**: [https://github.com/felipeSeiki/Sprint1Mobile](https://github.com/felipeSeiki/Sprint1Mobile)
- **Expo Metro**: `exp://192.168.15.33:8081`

