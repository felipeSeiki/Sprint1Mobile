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

### 💻 **Desenvolvimento Local** (Alternativo)
Para testar durante desenvolvimento:
```bash
npx expo start
# Escaneie o QR Code gerado
```

### 🔐 **Credenciais de Teste:**
- **Admin**: `admin@mottu.com` / `123456`
- **Operador**: `operador@mottu.com` / `123456`

### 📋 **Funcionalidades para Testar:**
- ✅ Login/Logout com diferentes perfis
- ✅ Cadastro de motos com validação
- ✅ Gerenciamento de usuários por pátio  
- ✅ Dashboard com filtros dinâmicos
- ✅ Navegação entre todas as telas
- ✅ Persistência de dados local

## 🎨 Design e Prototipação
**Link do Figma**: [Protótipo DashMottu](https://www.figma.com/design/dashMottu-fleet-management)

## 📋 Informações Técnicas

### QR Code

![alt text](image-1.png)

### **Hash do Commit Final:**
```
4b59efaad96efa3c1f9b1160110a517d7eac19d8
```

### **EAS Update ID:**
```
8afe78f9-94fb-417b-9145-1facd2909054
```

## 🌐 Links Importantes

| Tipo | Link | Descrição |
|------|------|-----------|
| **📱 App Publicado** | [Expo Dashboard](https://expo.dev/accounts/felipeseiki/projects/MeuPrimeiroApp) | Versão permanente do app |
| **💻 Repositório** | [GitHub](https://github.com/felipeSeiki/Sprint1Mobile) | Código fonte completo |
| **🎨 Protótipo** | [Figma](https://www.figma.com/design/dashMottu-fleet-management) | Design e wireframes |
| **📊 EAS Update** | [Dashboard EAS](https://expo.dev/accounts/felipeseiki/projects/MeuPrimeiroApp/updates/8afe78f9-94fb-417b-9145-1facd2909054) | Detalhes da publicação |

---

### 🎯 **Status da Entrega - Sprint 4**
✅ **App Completo e Funcional** - Todas as telas implementadas  
✅ **Publicado via EAS** - Acesso permanente via Expo Go  
✅ **Documentação Completa** - README atualizado  
✅ **CRUD Implementado** - Motos, Usuários e Pátios  
✅ **Pronto para Avaliação** - Hash e links disponíveis