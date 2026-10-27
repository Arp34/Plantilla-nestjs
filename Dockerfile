# Stage 1: build TypeScript -> dist (Etapa 1: compila TypeScript -> dist)
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: only production deps + compiled code, smaller image (Etapa 2: solo dependencias de producción + código compilado, imagen más liviana)
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
