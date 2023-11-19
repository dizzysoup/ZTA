FROM node:18.12.1-buster-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./
COPY public/ public/
COPY src/ src/
RUN npm install
RUN npm ci
RUN npm run build

FROM nginx:1.23.2-alpine
RUN mkdir -p /etc/nginx/ssl
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
COPY server.crt /etc/nginx/ssl/server.crt
COPY server.key /etc/nginx/ssl/server.key
RUN chmod 600 /etc/nginx/ssl/server.key
RUN chown 600 /etc/nginx/ssl/server.crt
RUN apk update
RUN apk add openrc
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

