FROM node:18-alpine

WORKDIR /app

# 设置 npm 使用淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制其他源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动开发服务器
CMD ["npm", "run", "dev", "--", "-p", "3000", "--hostname", "0.0.0.0"] 