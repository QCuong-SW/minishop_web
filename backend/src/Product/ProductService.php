<?php
namespace App\Product;

class ProductService {
    private ProductRepository $repository;

    public function __construct() {
        $this->repository = new ProductRepository();
    }

    public function getProducts(array $params): array {
        return $this->repository->findAll($params);
    }

    public function getProductBySlug(string $slug): ?array {
        return $this->repository->findBySlug($slug);
    }

    public function createProduct(array $data): array {
        return $this->repository->create($data);
    }
}
