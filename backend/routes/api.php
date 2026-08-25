<?php
use App\Shared\Http\Router;
use App\Auth\AuthController;
use App\Product\ProductController;
use App\Category\CategoryController;
use App\Cart\CartController;
use App\Order\OrderController;
use App\Coupon\CouponController;
use App\Review\ReviewController;
use App\Wishlist\WishlistController;
use App\Appointment\AppointmentController;
use App\Admin\AdminDashboardController;

$router = new Router();

// Auth & Users
$router->post('/api/auth/login', [AuthController::class, 'login']);
$router->post('/api/auth/register', [AuthController::class, 'register']);
$router->get('/api/auth/me', [AuthController::class, 'me']);
$router->get('/api/users', [AuthController::class, 'getUsers']);
$router->put('/api/users/{id}/status', [AuthController::class, 'toggleUserStatus']);

// Categories
$router->get('/api/categories', [CategoryController::class, 'index']);
$router->post('/api/categories', [CategoryController::class, 'store']);
$router->put('/api/categories/{id}', [CategoryController::class, 'update']);
$router->delete('/api/categories/{id}', [CategoryController::class, 'delete']);

// Products
$router->get('/api/products', [ProductController::class, 'index']);
$router->get('/api/products/{slug}', [ProductController::class, 'show']);
$router->post('/api/products', [ProductController::class, 'store']);
$router->put('/api/products/{id}', [ProductController::class, 'update']);
$router->delete('/api/products/{id}', [ProductController::class, 'delete']);

// Cart
$router->get('/api/cart', [CartController::class, 'getCart']);
$router->post('/api/cart/items', [CartController::class, 'addItem']);
$router->put('/api/cart/items/{id}', [CartController::class, 'updateItem']);
$router->delete('/api/cart/items/{id}', [CartController::class, 'removeItem']);

// Coupons
$router->get('/api/coupons', [CouponController::class, 'index']);
$router->post('/api/coupons/validate', [CouponController::class, 'validate']);
$router->post('/api/coupons', [CouponController::class, 'store']);

// Orders
$router->get('/api/orders', [OrderController::class, 'index']);
$router->get('/api/orders/{id}', [OrderController::class, 'show']);
$router->post('/api/orders', [OrderController::class, 'create']);
$router->put('/api/orders/{id}/status', [OrderController::class, 'updateStatus']);
$router->put('/api/orders/{id}/cancel', [OrderController::class, 'cancel']);

// Reviews, Wishlist, Appointments
$router->get('/api/products/{id}/reviews', [ReviewController::class, 'getByProduct']);
$router->post('/api/reviews', [ReviewController::class, 'store']);
$router->get('/api/wishlist', [WishlistController::class, 'index']);
$router->post('/api/wishlist/{id}', [WishlistController::class, 'toggle']);
$router->get('/api/appointments', [AppointmentController::class, 'index']);
$router->post('/api/appointments', [AppointmentController::class, 'create']);
$router->put('/api/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);

// Admin Dashboard
$router->get('/api/admin/dashboard', [AdminDashboardController::class, 'stats']);

return $router;
