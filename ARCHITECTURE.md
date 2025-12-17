# Arquitetura - Affiliate Monitor

## Visão Geral

O Affiliate Monitor é uma aplicação full-stack para monitoramento automático de ofertas e conversão de links de afiliados.

## Componentes Principais

### 1. Frontend (React)
- **Tecnologia**: React 18, Tailwind CSS
- **Estado**: Zustand
- **Data Fetching**: React Query
- **Routing**: React Router
- **Build**: Vite

### 2. Backend (Node.js/Express)
- **Framework**: Express.js
- **ORM**: Sequelize
- **Autenticação**: JWT
- **Logging**: Winston
- **Validação**: Joi

### 3. Banco de Dados (PostgreSQL)
- **Versão**: 15
- **Modelo**: Relacional

#### Tabelas

**users**
- id, name, email, password
- affiliateIds (JSON) - IDs de afiliados por plataforma
- active, createdAt, updatedAt

**sources**
- id, userId, name, type (rss/scraper/api)
- url, config (JSON), active
- lastFetchedAt, fetchCount, errorCount
- createdAt, updatedAt

**channels**
- id, userId, name, type (telegram/whatsapp/discord)
- config (JSON), active
- messageCount, lastMessageAt, errorCount
- createdAt, updatedAt

**offers**
- id, sourceId, userId
- title, description, originalUrl, affiliateUrl
- imageUrl, price, originalPrice, discount
- platform, category, metadata (JSON)
- status (pending/processing/sent/failed/skipped)
- sentAt, sentToChannels (JSON array)
- hash (unique), createdAt, updatedAt

**rules**
- id, userId, name
- sourceId, channelId
- filters (JSON), priority, active
- matchCount, lastMatchedAt
- createdAt, updatedAt

### 4. Cache e Filas (Redis)
- **Versão**: 7
- **Uso**: 
  - Cache de dados
  - Bull Queue para processamento assíncrono

### 5. Workers (Bull Queue)

#### RSS Feed Worker
- Busca feeds RSS configurados a cada 10 minutos
- Cria ofertas no banco de dados
- Detecta duplicatas por hash

#### Link Conversion Worker
- Converte links originais para links com afiliado
- Executa a cada 2 minutos
- Suporta Amazon, Shopee, Mercado Livre

#### Message Dispatch Worker
- Envia ofertas para os canais configurados
- Executa a cada minuto
- Aplica filtros das regras
- Rate limiting integrado

## Fluxo de Dados

```
[RSS Feed] → [RSS Worker] → [Offer (pending)]
    ↓
[Link Converter] → [Offer (processing)]
    ↓
[Rule Matcher] → [Message Dispatcher] → [Telegram/WhatsApp/Discord]
    ↓
[Offer (sent/failed/skipped)]
```

## Autenticação e Autorização

1. **Registro/Login**
   - POST /api/v1/auth/register
   - POST /api/v1/auth/login
   - Retorna JWT token

2. **Requisições Autenticadas**
   - Header: `Authorization: Bearer <token>`
   - Middleware valida token e carrega usuário

3. **Isolamento de Dados**
   - Todos os recursos são filtrados por userId
   - Usuário só acessa seus próprios dados

## Segurança

- Helmet.js para headers de segurança
- Rate limiting (100 req/15min)
- CORS configurável
- Senhas hash com bcrypt
- JWT para autenticação stateless
- Validação de entrada com Joi
- SQL injection prevention (Sequelize)

## Escalabilidade

### Horizontal
- Backend stateless (pode rodar múltiplas instâncias)
- Session compartilhada via JWT
- Cache compartilhado via Redis

### Vertical
- Bull Queue permite processamento paralelo
- PostgreSQL com pool de conexões
- Redis para cache

## Monitoramento

### Logs
- Winston com rotação de arquivos
- Níveis: error, warn, info, debug
- Armazenados em `backend/logs/`

### Health Checks
- Backend: GET /api/v1/health
- Docker health checks configurados

## Deployment

### Docker Compose
- 4 containers: postgres, redis, backend, frontend
- Networks isoladas
- Volumes persistentes
- Health checks
- Restart policies

### Ambiente de Produção
- Nginx como reverse proxy
- SSL/TLS (adicionar certificados)
- Backup automático do PostgreSQL
- Monitoramento de logs

## Integrações

### Telegram
- node-telegram-bot-api
- Suporta texto e imagens
- Rate limiting manual

### Amazon (Affiliate)
- Detecção de links amazon.com
- Adiciona tag de afiliado

### Shopee (Affiliate)
- Detecção de links shopee.com
- Adiciona af_siteid

### Mercado Livre (Affiliate)
- Detecção de links mercadolivre.com
- Adiciona pdp_source

## Extensibilidade

### Adicionar Nova Plataforma de Afiliados
1. Adicionar detecção em `affiliateService.js`
2. Criar função de conversão
3. Atualizar `convertAffiliateLink()`

### Adicionar Novo Canal
1. Criar integração em `integrations/`
2. Adicionar suporte em `messageDispatchWorker.js`
3. Atualizar enum do tipo de canal

### Adicionar Nova Fonte
1. Criar worker em `workers/`
2. Adicionar ao scheduler
3. Atualizar enum do tipo de fonte

## Performance

### Backend
- Paginação em queries com muitos resultados
- Índices no banco de dados
- Cache Redis para dados frequentes
- Pool de conexões otimizado

### Frontend
- Code splitting automático (Vite)
- Lazy loading de rotas
- React Query para cache de dados
- Otimização de imagens

## Manutenção

### Backup
```bash
./scripts/backup.sh
```
Cria backup do PostgreSQL compactado

### Deploy
```bash
./scripts/deploy.sh
```
Atualiza e reinicia serviços

### Logs
```bash
docker-compose logs -f [service]
```
