# 🚀 DEPLOYMENT GUIDE

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Render/Railway (Backend)

#### Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Add environment variables in Vercel dashboard:
DATABASE_URL=your-neondb-url
NEXTAUTH_SECRET=your-secret
```

#### Deploy Backend to Render
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables

### Option 2: Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env
    depends_on:
      - backend
```

### Option 3: Manual VPS (Ubuntu)

```bash
# SSH to server
ssh user@your-server.com

# Install dependencies
sudo apt update
sudo apt install python3-pip nodejs npm nginx

# Clone repo
git clone your-repo.git
cd your-repo

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup frontend
cd ../frontend
npm install
npm run build

# Use PM2 for process management
npm install -g pm2

# Start backend
cd backend
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name backend

# Start frontend
cd frontend
pm2 start "npm start" --name frontend

# Configure nginx as reverse proxy
# ...
```

---

## Environment Variables Checklist

### Backend (.env)
```env
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://your-frontend.com
```

### Frontend (.env)
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-frontend.com
NEXT_PUBLIC_API_URL=https://your-backend.com
```

---

## Production Checklist

- [ ] Update CORS origins
- [ ] Set strong SECRET_KEY
- [ ] Enable HTTPS
- [ ] Setup database backups
- [ ] Configure logging
- [ ] Setup monitoring (Sentry, etc.)
- [ ] Optimize images
- [ ] Enable caching
- [ ] Setup CDN (optional)
- [ ] Test thoroughly

---

Ready to deploy! 🚀
