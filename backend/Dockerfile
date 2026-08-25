FROM php:8.2-cli-alpine

# Install PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

# Copy backend files into the container
COPY . /var/www/html

# Render dynamically sets $PORT (e.g. 10000), fallback to 8000 for local Docker
EXPOSE 8000 10000

# Start PHP built-in server pointing to public/
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8000} -t public"]
