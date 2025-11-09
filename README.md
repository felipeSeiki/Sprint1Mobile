# DashMottu - Sistema de Gestão Logística de Motos

**Entregável da Sprint 4 – Desafio Mottu**  
**Mobile Application Development – 2TDSPY**

## 👥 Desenvolvido por:
- **Felipe Seiki Hashiguti** - RM: 98985
- **Lucas Corradini Silveira** - RM: 555118  
- **Matheus Gregorio Mota** - RM: 557254

## 📱 Sobre o Projeto

O DashMottu é um aplicativo mobile desenvolvido em React Native com Expo e TypeScript para gestão logística de motos. O sistema permite controle completo de frotas com cadastro de veículos, gerenciamento de usuários e administração de pátios operacionais.

### Principais Funcionalidades:
- 🔐 **Sistema de Autenticação** com 3 níveis de usuário (Master/Admin/Operador)
- 🏍️ **Gestão de Motos** - Cadastro, visualização e controle de status
- 👥 **Gerenciamento de Usuários** por pátio com diferentes permissões
- 🏢 **Controle de Pátios** - Múltiplas unidades com endereços completos
- 📊 **Dashboard** com filtros e visualização em tempo real

## 🚀 Tecnologias Utilizadas

- **React Native** com Expo SDK 54.0.0
- **TypeScript** para tipagem estática
- **React Navigation** para navegação entre telas
- **Styled Components** para estilização
- **React Native Elements** para componentes UI
- **AsyncStorage** para persistência de dados local
- **Context API** para gerenciamento de estado global

## 📋 Como Executar o Projeto

### Pré-requisitos
- Node.js 16+
- Expo Go instalado no dispositivo móvel
- Git

### Instalação
```bash
# Clone o repositório
git clone https://github.com/felipeSeiki/Sprint1Mobile.git

# Entre no diretório
cd Sprint1Mobile

# Instale as dependências
npm install

# Execute o projeto
npx expo start
```

## 📱 Testar o Aplicativo

### QR Code para teste:
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

### Instruções:
1. **Android**: Baixe o "Expo Go" na Play Store
2. **iOS**: Use a câmera nativa do iPhone
3. **Escaneie o QR Code** acima
4. **Teste as funcionalidades**:
   - Login: `admin@mottu.com` / `123456`
   - Navegue pelas telas e teste todas as funcionalidades

## 🎨 Design e Prototipação
**Link do Figma**: [Protótipo DashMottu](https://www.figma.com/design/dashMottu-fleet-management)

## 📋 Hash do Commit Final
```
928e52353d2196c1bf3737e39b2896b0b63755cd
```

## 🌐 Links Úteis
- **Repositório**: [https://github.com/felipeSeiki/Sprint1Mobile](https://github.com/felipeSeiki/Sprint1Mobile)
- **Expo Metro**: `exp://192.168.15.33:8081`