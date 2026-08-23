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

// Auth Routes
$router->post('/api/auth/login', [AuthController::class, 'login']);
$router->post('/api/auth/register', [AuthController::class, 'register']);
$router->get('/api/auth/me', [AuthController::class, 'me']);

// Products & Categories
$router->get('/api/categories', [CategoryController::class, 'index']);
$router->get('/api/products', [ProductController::class, 'index']);
$router->get('/api/products/{slug}', [ProductController::class, 'show']);
$router->post('/api/products', [ProductController::class, 'store']);

// Cart
$router->get('/api/cart', [CartController::class, 'getCart']);
$router->post('/api/cart/items', [CartController::class, 'addItem']);
$router->put('/api/cart/items/{id}', [CartController::class, 'updateItem']);
$router->delete('/api/cart/items/{id}', [CartController::class, 'removeItem']);

// Checkout & Orders
$router->post('/api/coupons/validate', [CouponController::class, 'validate']);
$router->get('/api/orders', [OrderController::class, 'index']);
$router->get('/api/orders/{id}', [OrderController::class, 'show']);
$router->post('/api/orders', [OrderController::class, 'create']);

// Reviews, Wishlist, Appointments
$router->get('/api/products/{id}/reviews', [ReviewController::class, 'getByProduct']);
$router->post('/api/reviews', [ReviewController::class, 'store']);
$router->get('/api/wishlist', [WishlistController::class, 'index']);
$router->post('/api/wishlist/{id}', [WishlistController::class, 'toggle']);
$router->get('/api/appointments', [AppointmentController::class, 'index']);
$router->post('/api/appointments', [AppointmentController::class, 'create']);

// Admin
$router->get('/api/admin/dashboard', [AdminDashboardController::class, 'stats']);

return $router;
