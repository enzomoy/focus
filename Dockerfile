# Développement avec Bun
FROM oven/bun:1 AS development

WORKDIR /app

COPY package*.json bun.lock ./
RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]

# Production avec Bun
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package*.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# Runner
FROM oven/bun:1-alpine AS production

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["bun", "server.js"]