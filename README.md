
# 📱 Desplug App

Este projeto é um aplicativo multiplataforma desenvolvido com **Ionic + React.js** no front-end e **Firebase** como back-end principal (Firestore, Auth, Functions, Hosting e Push Notifications).

---

## 🚀 Tecnologias Utilizadas

- **Front-end**: Ionic Framework + React + TypeScript
- **Back-end**: Firebase (Auth, Firestore, Cloud Functions, Hosting)
- **Banco de Dados**: Firestore (NoSQL, tempo real)
- **Hospedagem**: Firebase Hosting ou alternativa via AWS S3 + CloudFront / Vercel / Netlify
- **Notificações Push**: Firebase Cloud Messaging (FCM)

---

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Instale o Ionic CLI (caso não tenha):**
```bash
npm install -g @ionic/cli
```

4. **Instale o Firebase CLI (caso não tenha):**
```bash
npm install -g firebase-tools
firebase login
```

---

## 🧪 Ambiente de Desenvolvimento

### Rodar localmente com hot-reload:
```bash
ionic serve
```

### Para rodar no navegador com layout de dispositivo:
```bash
ionic serve --lab
```

## 🔧 Comandos Úteis

| Comando | Descrição |
|--------|-----------|
| `ionic serve` | Inicia o app localmente |
| `ionic build` | Compila para produção (pasta `public/`) |
| `firebase deploy` | Faz deploy do app e das funções serverless |
| `firebase emulators:start` | (Opcional) Inicia os emuladores locais do Firebase |

---

## 📄 Licença

Este projeto é privado. O uso do código-fonte sem permissão explícita do autor não é permitido.

---
