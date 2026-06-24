#!/bin/bash
# Correr UNA SOLA VEZ en el EC2 para obtener los certificados SSL

EMAIL="olysancheznicolas@gmail.com"

# Levantar solo con HTTP para el challenge
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d proxy

# Cert para frontend y www
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d agrotech.chickenkiller.com \
  -d www.agrotech.chickenkiller.com \
  --email $EMAIL \
  --agree-tos \
  --non-interactive

# Cert para API
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d api.agrotech.chickenkiller.com \
  --email $EMAIL \
  --agree-tos \
  --non-interactive

echo "Certificados obtenidos. Reiniciando nginx..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml restart proxy
