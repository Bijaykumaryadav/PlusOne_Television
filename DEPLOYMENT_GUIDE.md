# 🚀 Hostinger Deployment Guide - PlusOne Television

## ✅ Pre-Deployment Checklist

- [x] Docker setup complete
- [x] Database (MongoDB) configured
- [x] Backend environment variables set
- [x] Frontend build configured
- [ ] Update CORS for production domain
- [ ] Update frontend API URL
- [ ] Test production build locally
- [ ] Get SSH access to Hostinger

---

## 📋 Prerequisites

1. **Hostinger Account** with SSH access enabled
2. **Domain Name** (yours should be ready)
3. **Docker & Docker Compose** installed on Hostinger server
4. **GitHub/Git** account (for code deployment)

---

## 🔧 Step 1: Prepare Your Application for Production

### 1.1 Update Backend CORS Configuration

Your backend has hardcoded IPs. Update [backend/index.js](backend/index.js) with your actual Hostinger domain:

**Replace this:**
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://72.60.223.137:5173",  // ❌ Remove this
      "http://72.60.223.137:3000"   // ❌ Remove this
    ];
```

**With this:**
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "https://yourdomain.com",        // ✅ Your Hostinger domain
      "https://www.yourdomain.com",    // ✅ With www
      "http://localhost:5173",         // For local testing
      "http://localhost:3000"
    ];
```

### 1.2 Create Frontend Production Environment File

Create [frontend/.env.production](frontend/.env.production):

```env
VITE_API_URL=https://api.yourdomain.com/apis/v1/
```

Or if hosting both on same domain:
```env
VITE_API_URL=https://yourdomain.com/apis/v1/
```

---

## 🐳 Step 2: Update Docker Configuration for Production

### 2.1 Update docker-compose.yml

```yaml
version: '3.8'

services:
  server:
    build: ./backend
    container_name: express-server
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
    networks:
      - fullstack-network
    restart: unless-stopped
    env_file:
      - ./backend/.env
    volumes:
      - ./backend/logs:/usr/src/app/logs  # Optional: for logging

  client:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: react-client
    ports:
      - "5173:3000"
    networks:
      - fullstack-network
    depends_on:
      - server
    restart: unless-stopped
    environment:
      - NODE_ENV=production

networks:
  fullstack-network:
    driver: bridge
```

### 2.2 Update Dockerfiles

**Backend Dockerfile** - Ensure `.env` is included:

```dockerfile
FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
COPY .env .env
EXPOSE 8000
RUN chown -R node /usr/src/app
USER node
CMD ["node", "index.js"]
```

**Frontend Dockerfile** - Ensure production build:

```dockerfile
FROM node:22-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine as production
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

---

## 🌐 Step 3: Push Code to GitHub (Recommended for Hostinger)

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Production deployment ready"

# Push to GitHub (replace with your repo)
git push origin main
```

---

## 🖥️ Step 4: Deploy on Hostinger Server

### 4.1 SSH into Hostinger

```bash
ssh user@your-hostinger-ip
# Or use your domain
ssh user@yourdomain.com
```

### 4.2 Clone Repository

```bash
cd /home/yourusername
git clone https://github.com/yourusername/plusone-television.git
cd plusone-television
```

### 4.3 Copy Production .env File

Copy your `.env` file to the server:

```bash
# From your local machine
scp backend/.env user@your-hostinger-ip:/home/yourusername/plusone-television/backend/

# Verify permissions
ssh user@your-hostinger-ip "chmod 600 /home/yourusername/plusone-television/backend/.env"
```

### 4.4 Install Docker (if not installed)

```bash
# SSH into Hostinger
ssh user@your-hostinger-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 4.5 Build and Run Containers

```bash
cd /home/yourusername/plusone-television

# Build images
docker-compose build

# Start containers
docker-compose up -d

# Check status
docker ps
docker-compose logs -f
```

---

## 🔗 Step 5: Setup Reverse Proxy (Nginx)

Hostinger typically runs Nginx. Configure it to forward requests to your Docker containers.

### 5.1 Create Nginx Configuration

SSH into Hostinger and create:

```bash
sudo nano /etc/nginx/sites-available/yourdomain.com
```

Add this configuration:

```nginx
server {
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /apis/ {
        proxy_pass http://localhost:8000/apis/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 80;
}
```

### 5.2 Enable Site and Test

```bash
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/yourdomain.com

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### 5.3 Setup SSL Certificate (HTTPS)

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🧪 Step 6: Testing & Verification

### 6.1 Check Container Status

```bash
docker ps
docker logs express-server
docker logs react-client
```

### 6.2 Test API Endpoint

```bash
curl https://yourdomain.com/apis/v1/health  # (if you have a health endpoint)
```

### 6.3 Access Your App

- **Frontend**: https://yourdomain.com
- **API**: https://yourdomain.com/apis/v1/

---

## 🔄 Step 7: Continuous Updates & Maintenance

### Update Code

```bash
cd /home/yourusername/plusone-television
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f express-server  # Backend logs
docker-compose logs -f react-client    # Frontend logs
```

### Restart Services

```bash
docker-compose restart
docker-compose restart express-server  # Restart backend only
```

---

## ⚠️ Important Production Considerations

1. **Environment Variables**: Keep `.env` secure, never commit to git
2. **Database**: Ensure MongoDB connection is from production URL
3. **CORS**: Update allowed origins to production domain
4. **SSL/HTTPS**: Enable HTTPS certificate
5. **Session Secret**: Change `SESSION_SECRET` in production `.env`
6. **Password Storage**: Verify bcrypt is used for passwords
7. **API Keys**: Update Cloudinary, Khalti, eSewa keys for production
8. **FRONTEND_URL**: Set correct frontend URL in `.env`

---

## 📞 Troubleshooting

### Containers not starting?
```bash
docker-compose logs -f
docker-compose down
docker-compose up -d --build
```

### Connection refused error?
- Check firewall settings on Hostinger
- Verify port mappings in docker-compose.yml
- Check Nginx configuration

### CORS errors?
- Verify `FRONTEND_URL` in backend `.env`
- Update allowed origins in [backend/index.js](backend/index.js)

### Database connection errors?
- Verify `MONGO_URL` in `.env`
- Check MongoDB credentials
- Ensure IP whitelist on MongoDB Atlas (if using)

---

## ✅ Deployment Checklist Summary

- [ ] Backend CORS updated for production domain
- [ ] Frontend API URL set in `.env.production`
- [ ] docker-compose.yml updated for production
- [ ] Code pushed to GitHub
- [ ] SSH access to Hostinger confirmed
- [ ] Docker installed on Hostinger
- [ ] Repository cloned on Hostinger
- [ ] `.env` file copied to Hostinger
- [ ] Containers built and running
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Domain DNS points to Hostinger
- [ ] API endpoints tested
- [ ] Frontend accessible at domain

---

**Your application is ready for deployment! 🎉**

