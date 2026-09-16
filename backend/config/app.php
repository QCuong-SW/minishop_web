<?php
return [
    'env' => getenv('APP_ENV') ?: 'development',
    // APP_URL is required in production; keep a non-local placeholder for
    // environments where the variable has not been provided yet.
    'url' => getenv('APP_URL') ?: 'https://your-domain.com',
    'jwt_secret' => getenv('JWT_SECRET') ?: 'default-secret-change-in-prod'
];
