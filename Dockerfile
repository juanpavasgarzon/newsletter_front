FROM node:22-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_APP_API_URL
ARG NEXT_PUBLIC_ENABLE_ANALYTICS
ARG NEXT_PUBLIC_APP_ADMIN_SESSION_KEY
ARG NEXT_PUBLIC_APP_THEME_STORAGE_KEY
ENV NEXT_PUBLIC_APP_API_URL=$NEXT_PUBLIC_APP_API_URL
ENV NEXT_PUBLIC_APP_ADMIN_SESSION_KEY=$NEXT_PUBLIC_APP_ADMIN_SESSION_KEY
ENV NEXT_PUBLIC_APP_THEME_STORAGE_KEY=$NEXT_PUBLIC_APP_THEME_STORAGE_KEY
ENV NEXT_PUBLIC_ENABLE_ANALYTICS=$NEXT_PUBLIC_ENABLE_ANALYTICS

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
