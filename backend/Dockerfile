FROM php:8.2-fpm

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# 清理 apt 缓存
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# 安装 PHP 扩展
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# 安装 SQLite
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# 直接下载 composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/

# 设置工作目录
WORKDIR /var/www/html

# 复制项目文件
COPY . .

# 安装项目依赖
RUN composer install

# 设置权限
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache \
    /var/www/html/database

# 创建 SQLite 数据库文件并设置权限
RUN touch database/database.sqlite \
    && chown -R www-data:www-data database/database.sqlite \
    && chmod 666 database/database.sqlite

# 暴露端口
EXPOSE 8000

# 启动前运行迁移
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000 