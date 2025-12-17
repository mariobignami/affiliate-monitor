# Affiliate Monitor

Sistema completo para monitorar automaticamente novas ofertas com links de afiliados, converter links para o ID do afiliado do usuário e enviar automaticamente para canais (Telegram, WhatsApp, Discord).

## 🚀 Funcionalidades

- ✅ **Coleta Automática de Ofertas**: RSS feeds, web scraping e APIs
- ✅ **Conversão de Links de Afiliados**: Suporte para Amazon, Shopee, Mercado Livre
- ✅ **Envio Automático**: Integração com Telegram (WhatsApp e Discord em breve)
- ✅ **Banco de Dados Robusto**: PostgreSQL com modelos completos
- ✅ **Filas de Processamento**: Bull Queue com Redis
- ✅ **Interface Web**: Dashboard React com Tailwind CSS
- ✅ **API REST**: Autenticação JWT e endpoints completos
- ✅ **Docker**: Deployment simplificado com Docker Compose

## 📋 Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- PostgreSQL 15+ (se não usar Docker)
- Redis 7+ (se não usar Docker)

## 🛠️ Instalação Rápida

1. Clone o repositório:
```bash
git clone https://github.com/mariobignami/affiliate-monitor.git
cd affiliate-monitor
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite .env com suas configurações
```

3. Execute o script de setup:
```bash
./scripts/setup.sh
```

4. Acesse a aplicação:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api/v1

## 📚 Documentação

- [Instalação](./INSTALLATION.md) - Guia detalhado de instalação
- [Arquitetura](./ARCHITECTURE.md) - Especificação técnica do sistema
- [API](./API.md) - Documentação dos endpoints
- [Deployment](./DEPLOYMENT.md) - Guia de deployment em produção

## 🏗️ Estrutura do Projeto

```
affiliate-monitor/
├── backend/              # API Node.js/Express
│   ├── src/
│   │   ├── api/         # Rotas e controllers
│   │   ├── models/      # Modelos do banco
│   │   ├── services/    # Lógica de negócio
│   │   ├── workers/     # Bull workers
│   │   └── integrations/# Integrações externas
│   └── Dockerfile
├── frontend/            # React App
│   ├── src/
│   │   ├── pages/      # Páginas
│   │   ├── components/ # Componentes
│   │   └── services/   # API client
│   └── Dockerfile
├── docker-compose.yml   # Orquestração
└── scripts/            # Scripts de deploy
```

## 🔧 Desenvolvimento

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🧪 Testes

```bash
cd backend
npm test
```

## 🐳 Docker

### Build e Start
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f
```

### Parar serviços
```bash
docker-compose down
```

## 📦 Tecnologias

### Backend
- Node.js 18
- Express.js
- PostgreSQL 15
- Redis 7
- Bull (job queue)
- Sequelize (ORM)
- JWT (autenticação)
- Winston (logging)

### Frontend
- React 18
- React Router
- Tailwind CSS
- React Query
- Zustand (state management)
- Axios

### DevOps
- Docker & Docker Compose
- Nginx

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

## 👤 Autor

Mario Bignami

## 🙏 Agradecimentos

- Promobit e Pelando pela inspiração
- Comunidade open source
