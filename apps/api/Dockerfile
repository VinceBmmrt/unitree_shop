# Build stage
FROM node:20-alpine AS builder
RUN corepack enable pnpm && apk add --no-cache openssl
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --dir apps/api run db:generate
RUN pnpm --dir apps/api run build

# Runtime stage
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
ENV NODE_ENV=production

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/api/node_modules /app/apps/api/node_modules
COPY --from=builder /app/apps/api/dist /app/apps/api/dist
COPY --from=builder /app/apps/api/prisma /app/apps/api/prisma
COPY --from=builder /app/packages/types/dist /app/packages/types/dist

RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs

WORKDIR /app/apps/api
EXPOSE 3001
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main.js"]
