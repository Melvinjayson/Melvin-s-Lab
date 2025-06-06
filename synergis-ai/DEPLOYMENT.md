# Synergis AI Deployment Guide

This guide covers the deployment process for Synergis AI in both development and production environments.

## Development Environment

### Local Setup

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/synergis-ai.git
cd synergis-ai
```

2. **Set Up Environment Variables**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your local configurations
```

3. **Start Development Servers**

Using Docker:
```bash
docker-compose up --build
```

Manually:
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Production Environment

### Prerequisites

- Domain name
- SSL certificate
- Production-grade PostgreSQL database
- Redis instance (optional)
- ChromaDB instance
- Monitoring solution (e.g., Prometheus + Grafana)

### Deployment Steps

1. **Server Preparation**

- Set up a Linux server (Ubuntu 20.04+ recommended)
- Install Docker and Docker Compose
- Configure firewall rules
- Set up SSL certificates (Let's Encrypt recommended)

2. **Environment Configuration**

```bash
# Create production environment files
cp backend/.env.example backend/.env.prod
cp frontend/.env.example frontend/.env.prod

# Edit the files with production values
vim backend/.env.prod
vim frontend/.env.prod
```

3. **Database Setup**

```bash
# Run database migrations
cd backend
alembic upgrade head
```

4. **Docker Deployment**

```bash
# Build and start containers
docker-compose -f docker-compose.prod.yml up -d
```

5. **Nginx Configuration**

```nginx
# /etc/nginx/sites-available/synergis-ai
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Monitoring Setup**

- Configure Prometheus for metrics collection
- Set up Grafana dashboards
- Configure log aggregation (e.g., ELK Stack)

### Security Considerations

1. **API Security**
- Enable rate limiting
- Configure CORS properly
- Use secure headers
- Implement API key authentication

2. **Database Security**
- Use strong passwords
- Enable SSL connections
- Regular backups
- Implement connection pooling

3. **Application Security**
- Regular dependency updates
- Security audits
- Input validation
- XSS protection

### Maintenance

1. **Backup Strategy**
```bash
# Database backup
pg_dump -U postgres synergis > backup.sql

# Application data backup
tar -czf app_data.tar.gz /path/to/app/data
```

2. **Updates**
```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose -f docker-compose.prod.yml build

# Restart services
docker-compose -f docker-compose.prod.yml up -d
```

3. **Monitoring**
- Regular log review
- Performance monitoring
- Error tracking
- User analytics

### Troubleshooting

1. **Common Issues**
- Database connection errors
- Memory issues
- CPU usage spikes
- Network connectivity

2. **Debugging**
```bash
# View logs
docker-compose logs -f

# Check container status
docker-compose ps

# Monitor resources
docker stats
```

3. **Recovery**
```bash
# Restore database
psql -U postgres synergis < backup.sql

# Restore application data
tar -xzf app_data.tar.gz -C /path/to/app/data
```