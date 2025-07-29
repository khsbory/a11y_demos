import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { type Product } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Product API 엔드포인트 - 확장된 필터링, 검색, 정렬 기능 지원
  app.get('/api/products/:accessibilityLevel', async (req, res) => {
    try {
      const { accessibilityLevel } = req.params;
      const { 
        category, 
        inStock, 
        onSale, 
        minPrice, 
        maxPrice, 
        minRating, 
        search, 
        sortBy, 
        order 
      } = req.query;

      let products: Product[] = [];

      // 검색 기능
      if (search && typeof search === 'string') {
        products = await storage.searchProducts(accessibilityLevel, search);
      }
      // 카테고리별 필터링
      else if (category && typeof category === 'string') {
        products = await storage.getProductsByCategory(accessibilityLevel, category);
      }
      // 재고 상태별 필터링
      else if (inStock !== undefined) {
        const inStockBool = inStock === 'true';
        products = await storage.getProductsByStockStatus(accessibilityLevel, inStockBool);
      }
      // 할인 상품 필터링
      else if (onSale === 'true') {
        products = await storage.getProductsOnSale(accessibilityLevel);
      }
      // 가격대별 필터링
      else if (minPrice || maxPrice) {
        const min = minPrice ? parseFloat(minPrice as string) : 0;
        const max = maxPrice ? parseFloat(maxPrice as string) : Number.MAX_SAFE_INTEGER;
        products = await storage.getProductsByPriceRange(accessibilityLevel, min, max);
      }
      // 평점별 필터링
      else if (minRating) {
        const rating = parseFloat(minRating as string);
        products = await storage.getProductsByRating(accessibilityLevel, rating);
      }
      // 정렬 기능
      else if (sortBy && typeof sortBy === 'string') {
        const sortOrder = (order === 'asc' || order === 'desc') ? order : 'desc';
        products = await storage.getProductsSorted(accessibilityLevel, sortBy, sortOrder);
      }
      // 기본 조회
      else {
        products = await storage.getProducts(accessibilityLevel);
      }

      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // 모든 상품 조회 (테스트용)
  app.get('/api/products', async (req, res) => {
    try {
      const allProducts = await storage.getProducts('none'); // 기본값으로 none 레벨 조회
      res.json(allProducts);
    } catch (error) {
      console.error('Error fetching all products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // 개별 제품 조회 API 엔드포인트
  app.get('/api/products/:accessibilityLevel/:id', async (req, res) => {
    try {
      const { accessibilityLevel, id } = req.params;
      const product = await storage.getProductById(`${id}_${accessibilityLevel}`);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  // 제품 생성 API 엔드포인트
  app.post('/api/products', async (req, res) => {
    try {
      const productData = req.body;
      
      // accessibilityLevel이 없으면 기본값 설정
      if (!productData.accessibilityLevel) {
        productData.accessibilityLevel = 'none';
      }
      
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
