# Frontend Dockerfile - React + Vite (Development)
FROM node:20-alpine

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Порт Vite dev server
EXPOSE 5173

# Запускаем dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
