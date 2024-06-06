FROM node:20 as build
WORKDIR /usr/src/app
# Do `npm ci` separately so we can cache `node_modules`
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

FROM node:20-slim
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules node_modules
COPY --from=build /usr/src/app/dist dist
COPY package.json ./
ENV PORT=8080
# `npm run start` does not forward signals to child process
CMD ["node", "dist/main.js"]
EXPOSE 8080
# --start-period defaults to 0s, but can't be set to 0s (to be explicit) by now
#HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD node -e "fetch('http://localhost:8080/health').then((r) => {if (r.status !== 200) throw new Error(r.status)})"