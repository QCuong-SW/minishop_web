FROM php:8.2-cli-alpine

# Install PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

# Expose port 8000
EXPOSE 8000

# Start PHP built-in server pointing to public/
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
