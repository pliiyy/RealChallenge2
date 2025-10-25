<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env("FRONTEND_URL"),'http://localhost:5173'], // Ganti sesuai URL frontend
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
