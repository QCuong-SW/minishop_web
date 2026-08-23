<?php
return [
    'env' => getenv('APP_ENV') ?: 'development',
    'url' => getenv('APP_URL') ?: 'http://localhost:8000',
    'jwt_secret' => getenv('JWT_SECRET') ?: 'default-secret-change-in-prod'
];
