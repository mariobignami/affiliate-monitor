# Deployment Guide - Affiliate Monitor

## Production Deployment

### Prerequisites
- Server with Docker and Docker Compose
- Domain name (optional)
- SSL certificate (recommended)

### Step 1: Server Setup

1. **Update system**
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Install Docker**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

3. **Install Docker Compose**
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Application Deployment

1. **Clone repository**
```bash
git clone https://github.com/mariobignami/affiliate-monitor.git
cd affiliate-monitor
```

2. **Configure environment**
```bash
cp .env.example .env
nano .env
```

Essential variables:
```bash
NODE_ENV=production
JWT_SECRET=<generate-strong-random-string>
DB_PASSWORD=<secure-database-password>
TELEGRAM_BOT_TOKEN=<your-bot-token>
CORS_ORIGIN=https://yourdomain.com
```

3. **Deploy**
```bash
chmod +x scripts/*.sh
./scripts/deploy.sh
```

### Step 3: Configure Nginx Reverse Proxy (Optional)

1. **Install Nginx**
```bash
sudo apt install nginx -y
```

2. **Create configuration**
```bash
sudo nano /etc/nginx/sites-available/affiliate-monitor
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
    }
}
```

3. **Enable site**
```bash
sudo ln -s /etc/nginx/sites-available/affiliate-monitor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: SSL with Let's Encrypt

1. **Install Certbot**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

2. **Obtain certificate**
```bash
sudo certbot --nginx -d yourdomain.com
```

3. **Auto-renewal**
```bash
sudo systemctl enable certbot.timer
```

## Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Check Service Status
```bash
docker-compose ps
```

### Resource Usage
```bash
docker stats
```

## Backup Strategy

### Automated Backups

1. **Create cron job**
```bash
crontab -e
```

2. **Add daily backup at 2 AM**
```cron
0 2 * * * cd /path/to/affiliate-monitor && ./scripts/backup.sh >> /var/log/backup.log 2>&1
```

### Manual Backup
```bash
./scripts/backup.sh
```

### Restore from Backup
```bash
# Stop services
docker-compose down

# Restore database
gunzip < backups/affiliate_monitor_backup_20240101_020000.sql.gz | \
  docker-compose exec -T postgres psql -U postgres -d affiliate_monitor

# Start services
docker-compose up -d
```

## Scaling

### Horizontal Scaling

To run multiple backend instances:

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
    # ... rest of config
```

Add load balancer (Nginx):
```nginx
upstream backend {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}
```

### Vertical Scaling

Adjust resources in docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Security Checklist

- [ ] Strong JWT_SECRET set
- [ ] Strong database passwords
- [ ] Firewall configured (only 80, 443, 22 open)
- [ ] SSL/TLS enabled
- [ ] Regular security updates
- [ ] Backup encryption enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Log rotation enabled

## Maintenance

### Update Application
```bash
cd /path/to/affiliate-monitor
git pull origin main
./scripts/deploy.sh
```

### Database Maintenance
```bash
# Vacuum database
docker-compose exec postgres psql -U postgres -d affiliate_monitor -c "VACUUM ANALYZE;"

# Check database size
docker-compose exec postgres psql -U postgres -d affiliate_monitor -c "SELECT pg_size_pretty(pg_database_size('affiliate_monitor'));"
```

### Clean Old Data
```bash
# Clean offers older than 90 days
docker-compose exec postgres psql -U postgres -d affiliate_monitor -c "DELETE FROM offers WHERE created_at < NOW() - INTERVAL '90 days';"
```

## Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check memory
free -h
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U postgres -c "SELECT 1;"
```

### High CPU/Memory Usage
```bash
# Check resource usage
docker stats

# Scale down workers if needed (edit docker-compose.yml)
# Reduce concurrent jobs in backend config
```

## Performance Optimization

### PostgreSQL Tuning
```bash
# Edit postgresql.conf in volume or container
docker-compose exec postgres nano /var/lib/postgresql/data/postgresql.conf
```

Key settings:
```
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB
```

### Redis Tuning
```bash
# Set max memory
docker-compose exec redis redis-cli CONFIG SET maxmemory 512mb
docker-compose exec redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## Disaster Recovery

### Full System Restore

1. Install Docker and Docker Compose
2. Clone repository
3. Configure .env
4. Restore database from backup
5. Start services

```bash
git clone https://github.com/mariobignami/affiliate-monitor.git
cd affiliate-monitor
cp .env.production .env
gunzip < backup.sql.gz | docker-compose exec -T postgres psql -U postgres -d affiliate_monitor
docker-compose up -d
```
