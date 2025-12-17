# Guia de Instalação - Affiliate Monitor

## Instalação com Docker (Recomendado)

### Pré-requisitos
- Docker 20.10+
- Docker Compose 2.0+

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/mariobignami/affiliate-monitor.git
cd affiliate-monitor
```

2. **Configure variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
- `JWT_SECRET`: Chave secreta para JWT (gere uma aleatória)
- `TELEGRAM_BOT_TOKEN`: Token do seu bot do Telegram
- `AMAZON_AFFILIATE_ID`: Seu ID de afiliado da Amazon
- `SHOPEE_AFFILIATE_ID`: Seu ID de afiliado da Shopee
- `MERCADOLIVRE_AFFILIATE_ID`: Seu ID de afiliado do Mercado Livre

3. **Execute o script de setup**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

4. **Acesse a aplicação**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api/v1

5. **Crie sua primeira conta**
Acesse http://localhost:3001/register e crie uma conta.

## Instalação Manual (Desenvolvimento)

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Backend

1. **Instalar dependências**
```bash
cd backend
npm install
```

2. **Configurar ambiente**
```bash
cp .env.example .env
# Edite .env com suas configurações
```

3. **Iniciar PostgreSQL e Redis**
```bash
# PostgreSQL
sudo systemctl start postgresql

# Redis
sudo systemctl start redis
```

4. **Iniciar servidor**
```bash
npm run dev
```

### Frontend

1. **Instalar dependências**
```bash
cd frontend
npm install
```

2. **Configurar ambiente**
```bash
cp .env.example .env
```

3. **Iniciar servidor de desenvolvimento**
```bash
npm run dev
```

## Configuração do Telegram Bot

1. **Criar bot**
   - Fale com [@BotFather](https://t.me/botfather) no Telegram
   - Use `/newbot` e siga as instruções
   - Copie o token fornecido

2. **Obter Chat ID**
   - Envie uma mensagem para seu bot
   - Acesse: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Localize o `chat.id` na resposta

3. **Configurar no sistema**
   - Adicione o token e chat ID no arquivo `.env`
   - Ou configure através da interface web em "Canais"

## Verificação da Instalação

1. **Backend Health Check**
```bash
curl http://localhost:3000/api/v1/health
```

Deve retornar:
```json
{
  "success": true,
  "message": "API is running"
}
```

2. **Frontend**
Acesse http://localhost:3001 - deve exibir a tela de login

## Solução de Problemas

### Erro de conexão com banco de dados
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Ver logs
docker-compose logs postgres
```

### Erro de conexão com Redis
```bash
# Verificar se Redis está rodando
docker-compose ps redis

# Ver logs
docker-compose logs redis
```

### Frontend não carrega
```bash
# Verificar build do frontend
docker-compose logs frontend

# Rebuild se necessário
docker-compose up -d --build frontend
```

## Próximos Passos

1. Acesse a aplicação e crie uma conta
2. Configure suas fontes RSS em "Fontes"
3. Configure seus canais em "Canais"
4. Crie regras para conectar fontes aos canais
5. Aguarde as ofertas serem capturadas e enviadas!

## Comandos Úteis

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs apenas do backend
docker-compose logs -f backend

# Reiniciar serviços
docker-compose restart

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (cuidado: apaga dados!)
docker-compose down -v

# Backup do banco de dados
./scripts/backup.sh
```
