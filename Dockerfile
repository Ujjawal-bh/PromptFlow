# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV AUTH_SECRET="build-time-placeholder"
ENV NEXTAUTH_SECRET="build-time-placeholder"
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dummy?schema=public"

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat openssl

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy bin ONCE, with correct ownership, after npm ci
COPY --chown=nextjs:nodejs bin ./bin
RUN chmod +x bin/start.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "bin/start.sh"]