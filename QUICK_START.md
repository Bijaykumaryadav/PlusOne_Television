# 🚀 Quick Start: Hostinger Deployment Guide for sidhareporting.com

## ✅ What's Ready

Your application is **95% ready** for production deployment! Here's what I've done:

✅ Updated Backend CORS for production domain  
✅ Updated Frontend API URLs  
✅ Created production environment templates  
✅ Created Docker Compose production setup  
✅ Created Nginx configuration template  
✅ Created automated deployment script  
✅ Created comprehensive deployment documentation

---

## 🎯 Quick 5-Step Deployment

### Step 1: Prepare Your Local Setup

```bash
# Commit and push all changes to GitHub
cd PlusOne_Television
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Get SSH Access to Hostinger

Log in to Hostinger and enable SSH access:
1. Go to **hPanel** → **Advanced** → **SSH/Shell Access**
2. Make note of your SSH credentials
3. Open terminal and connect:

```bash
ssh user@your-hostinger-ip
# Or
ssh user@sidhareporting.com
```

### Step 3: Clone & Setup on Hostinger

```bash
# SSH into Hostinger
ssh user@your-hostinger-ip

# Clone your repository
git clone https://github.com/yourusername/plusone-television.git
cd plusone-television

# Copy your production .env file (from your local machine)
# scp backend/.env user@your-hostinger-ip:~/plusone-television/backend/
```

**Important:** Upload your actual `.env` file to the server (NOT from GitHub!)

### Step 4: Install Docker (if not installed)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

### Step 5: Deploy & Configure

```bash
# Build and start containers
docker-compose build
docker-compose up -d

# Check status
docker ps
docker logs express-server

# Setup Nginx (see nginx.conf.example)
sudo nano /etc/nginx/sites-available/sidhareporting.com
# Paste content from nginx.conf.example

# Enable Nginx site
sudo ln -s /etc/nginx/sites-available/sidhareporting.com /etc/nginx/sites-enabled/

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL Certificate
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d sidhareporting.com -d www.sidhareporting.com
```

---

## 📁 Important Files Created

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Complete step-by-step guide |
| `docker-compose.prod.yml` | Production Docker setup |
| `backend/.env.production.example` | Production .env template |
| `frontend/.env.production` | Production frontend config |
| `nginx.conf.example` | Nginx configuration template |
| `deploy.sh` | Automated deployment script |

---

## 🔑 Key Configuration for sidhareporting.com

**Backend CORS Updated:**
- ✅ https://sidhareporting.com
- ✅ https://www.sidhareporting.com
- ✅ http://localhost:5173 (dev)

**Frontend API URL:**
- ✅ https://sidhareporting.com/apis/v1/

**Nginx Proxy:**
- ✅ Frontend: /
- ✅ Backend: /apis/

---

## ⚠️ Before Deployment - Final Checklist

- [ ] All code changes committed to GitHub
- [ ] Production .env file ready with all credentials:
  - [ ] MongoDB URL (production)
  - [ ] JWT_SECRET_KEY
  - [ ] SESSION_SECRET
  - [ ] Google OAuth credentials
  - [ ] Cloudinary credentials
  - [ ] Khalti/eSewa keys
  - [ ] Email credentials
- [ ] Domain DNS points to Hostinger
- [ ] SSH access confirmed
- [ ] Backup of current .env file

---

## 🚀 Deployment Day Steps

### On Your Local Machine:
```bash
git add .
git commit -m "Production deployment"
git push origin main
```

### On Hostinger Server:
```bash
cd ~/plusone-television
git pull origin main
# Copy .env file to backend/
docker-compose build
docker-compose up -d
# Configure Nginx (see above)
```

---

## 📊 Post-Deployment Verification

After deployment, verify everything works:

```bash
# Check container status
docker ps

# View logs
docker logs express-server
docker logs react-client

# Test API endpoint
curl https://sidhareporting.com/apis/v1/

# Test frontend
# Open https://sidhareporting.com in browser
```

---

## 🔄 Future Updates (One-Line Deployment)

After first deployment, use:
```bash
bash deploy.sh
```

This script automatically:
1. Pulls latest code
2. Stops containers
3. Rebuilds images
4. Starts containers
5. Shows logs

---

## 📞 Troubleshooting

### Containers won't start?
```bash
docker-compose logs -f
docker-compose down
docker-compose up -d --build
```

### CORS errors?
Check that backend `.env` has correct `FRONTEND_URL`

### API not responding?
```bash
docker logs express-server  # Check backend logs
curl http://localhost:8000/apis/v1/  # Test locally
```

### Nginx 502 Bad Gateway?
```bash
# Ensure containers are running
docker ps

# Test connection
curl http://localhost:8000
curl http://localhost:5173
```

---

## ✨ Your Application is Ready!

**Status: 95% Complete**

All that's left is:
1. Upload production `.env` file
2. Run deployment on Hostinger
3. Configure SSL (automated with Certbot)
4. Point domain DNS to Hostinger

**Estimated deployment time: 15-20 minutes** ⏱️

---

**Happy deploying! 🎉**

For detailed information, see **DEPLOYMENT_GUIDE.md**

