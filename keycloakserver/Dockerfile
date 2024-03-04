# 使用官方的 Node.js 映像，指定版本
FROM node:20.10.0

# 在容器中創建應用程式的工作目錄
WORKDIR keycloakserver

# 複製 package.json 和 package-lock.json 以便利用 Docker 的 layer caching
COPY package*.json .
# 將應用程式代碼複製到容器中
COPY . .
# 安裝應用程式的依賴項
RUN npm install

# 開放應用程式運行的端口
EXPOSE 3002


# 定義應用程式的入口點
CMD ["npm", "start"]