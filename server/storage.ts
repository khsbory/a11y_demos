import { type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product 메서드들
  getProducts(accessibilityLevel: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  getProductById(id: string): Promise<Product | undefined>;
  
  // 새로운 필터링, 검색, 정렬 메서드들
  getProductsByCategory(accessibilityLevel: string, category: string): Promise<Product[]>;
  getProductsByStockStatus(accessibilityLevel: string, inStock: boolean): Promise<Product[]>;
  getProductsOnSale(accessibilityLevel: string): Promise<Product[]>;
  getProductsByPriceRange(accessibilityLevel: string, minPrice: number, maxPrice: number): Promise<Product[]>;
  getProductsByRating(accessibilityLevel: string, minRating: number): Promise<Product[]>;
  searchProducts(accessibilityLevel: string, searchTerm: string): Promise<Product[]>;
  getProductsSorted(accessibilityLevel: string, sortBy: string, order: 'asc' | 'desc'): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.initializeProducts();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product 메서드들 구현
  async getProducts(accessibilityLevel: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.accessibilityLevel === accessibilityLevel
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  // 새로운 필터링, 검색, 정렬 메서드들 구현
  async getProductsByCategory(accessibilityLevel: string, category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.accessibilityLevel === accessibilityLevel && product.category === category
    );
  }

  async getProductsByStockStatus(accessibilityLevel: string, inStock: boolean): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.accessibilityLevel === accessibilityLevel && product.stock.available === inStock
    );
  }

  async getProductsOnSale(accessibilityLevel: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.accessibilityLevel === accessibilityLevel && product.pricing.discountPercentage > 0
    );
  }

  async getProductsByPriceRange(accessibilityLevel: string, minPrice: number, maxPrice: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.accessibilityLevel === accessibilityLevel && 
                   product.pricing.salePrice >= minPrice && 
                   product.pricing.salePrice <= maxPrice
    );
  }

  async getProductsByRating(accessibilityLevel: string, minRating: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.accessibilityLevel === accessibilityLevel && product.stats.rating >= minRating
    );
  }

  async searchProducts(accessibilityLevel: string, searchTerm: string): Promise<Product[]> {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => product.accessibilityLevel === accessibilityLevel && 
                   (product.productName.toLowerCase().includes(lowerSearchTerm) ||
                    product.description.toLowerCase().includes(lowerSearchTerm))
    );
  }

  async getProductsSorted(accessibilityLevel: string, sortBy: string, order: 'asc' | 'desc'): Promise<Product[]> {
    const products = Array.from(this.products.values()).filter(
      (product) => product.accessibilityLevel === accessibilityLevel
    );

    return products.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'price':
          aValue = a.pricing.salePrice;
          bValue = b.pricing.salePrice;
          break;
        case 'rating':
          aValue = a.stats.rating;
          bValue = b.stats.rating;
          break;
        case 'purchaseCount':
          aValue = a.stats.purchaseCount;
          bValue = b.stats.purchaseCount;
          break;
        case 'reviewCount':
          aValue = a.stats.reviewCount;
          bValue = b.stats.reviewCount;
          break;
        case 'discountPercentage':
          aValue = a.pricing.discountPercentage;
          bValue = b.pricing.discountPercentage;
          break;
        default:
          aValue = a.productName;
          bValue = b.productName;
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // 상품 데이터 초기화
  private initializeProducts() {
    const baseProducts = [
      {
        id: "prod_1Jqg8F2eZvKYlo2ChxKkO4eS",
        productName: "iPhone 16 Pro, 256GB, Natural Titanium",
        productUrl: "/products/iphone-16-pro-256gb-natural-titanium",
        imageUrl: "https://via.placeholder.com/300x300.png?text=iPhone+16+Pro",
        category: "Electronics",
        pricing: {
          regularPrice: 1199.00,
          salePrice: 1079.10,
          couponPrice: 1029.10,
          discountPercentage: 10,
          currency: "USD"
        },
        stock: {
          available: true,
          quantity: 150
        },
        stats: {
          purchaseCount: 18234,
          rating: 4.9,
          reviewCount: 4588
        },
        description: "The latest iPhone with the A19 Bionic chip, Pro-camera system, and a stunning ProMotion display."
      },
      {
        id: "prod_2Hqg9F2eZvKYlo2CiYKlP5fT",
        productName: "Aura QuietComfort 5 Wireless Headphones",
        productUrl: "/products/aura-quietcomfort-5-headphones",
        imageUrl: "https://via.placeholder.com/300x300.png?text=Aura+Headphones",
        category: "Audio",
        pricing: {
          regularPrice: 349.99,
          salePrice: 279.99,
          couponPrice: 264.99,
          discountPercentage: 20,
          currency: "USD"
        },
        stock: {
          available: true,
          quantity: 890
        },
        stats: {
          purchaseCount: 25430,
          rating: 4.8,
          reviewCount: 9872
        },
        description: "World-class noise cancellation, high-fidelity audio, and lightweight comfort for all-day listening."
      },
      {
        id: "prod_3IqgAF2eZvKYlo2CjZKmQ6gU",
        productName: "StarlightBook Air M4, 13-inch, 16GB RAM, 512GB SSD",
        productUrl: "/products/starlightbook-air-m4-13-inch",
        imageUrl: "https://via.placeholder.com/300x300.png?text=StarlightBook+Air",
        category: "Computers",
        pricing: {
          regularPrice: 1499.00,
          salePrice: 1424.05,
          couponPrice: 1399.00,
          discountPercentage: 5,
          currency: "USD"
        },
        stock: {
          available: true,
          quantity: 320
        },
        stats: {
          purchaseCount: 9865,
          rating: 4.9,
          reviewCount: 2341
        },
        description: "Incredibly thin and fast, the StarlightBook Air with the new M4 chip redefines performance in a portable design."
      },
      {
        id: "prod_4JqgBF2eZvKYlo2CkALmR7hV",
        productName: "BrewMaster Pro Espresso Machine",
        productUrl: "/products/brewmaster-pro-espresso",
        imageUrl: "https://via.placeholder.com/300x300.png?text=Espresso+Machine",
        category: "Home & Kitchen",
        pricing: {
          regularPrice: 499.50,
          salePrice: 424.58,
          couponPrice: 399.50,
          discountPercentage: 15,
          currency: "USD"
        },
        stock: {
          available: true,
          quantity: 450
        },
        stats: {
          purchaseCount: 7512,
          rating: 4.7,
          reviewCount: 1890
        },
        description: "Barista-quality espresso at home. Features a built-in grinder and a powerful steam wand."
      },
      {
        id: "prod_5KqgCF2eZvKYlo2ClBMnS8iW",
        productName: "VelocityRun XT Men's Running Shoes - Solar Flare",
        productUrl: "/products/velocityrun-xt-mens-solar-flare",
        imageUrl: "https://via.placeholder.com/300x300.png?text=Running+Shoes",
        category: "Apparel",
        pricing: {
          regularPrice: 129.95,
          salePrice: 97.46,
          couponPrice: 97.46,
          discountPercentage: 25,
          currency: "USD"
        },
        stock: {
          available: true,
          quantity: 1200
        },
        stats: {
          purchaseCount: 31045,
          rating: 4.6,
          reviewCount: 8812
        },
        description: "Engineered for maximum cushion and responsiveness, helping you run faster and longer."
      },
      {
        id: "prod_6LqgDF2eZvKYlo2CmCNnT9jX",
        productName: "Galaxy Watch 8 Classic, 47mm, Silver",
        productUrl: "/products/galaxy-watch-8-classic-silver",
        imageUrl: "https://via.placeholder.com/300x300.png?text=Galaxy+Watch+8",
        category: "Wearables",
        pricing: {
          regularPrice: 429.00,
          salePrice: 386.10,
          couponPrice: 375.00,
          discountPercentage: 10,
          currency: "USD"
        },
        stock: {
          available: true,
          quantity: 780
        },
        stats: {
          purchaseCount: 15239,
          rating: 4.7,
          reviewCount: 3456
        },
        description: "Timeless design meets modern tech. Track your health, workouts, and stay connected on the go."
      },
      {
        id: "prod_7MqgEF2eZvKYlo2CnDOoU0kY",
        productName: "Organic Cotton Crewneck T-Shirt - Heather Grey",
        productUrl: "/products/organic-cotton-tshirt-grey",
        imageUrl: "https://via.placeholder.com/300x300.png?text=Cotton+T-Shirt",
        category: "Apparel",
        pricing: {
          regularPrice: 25.00,
          salePrice: 20.00,
          couponPrice: 20.00,
          discountPercentage: 20,
          currency: "USD"
        },
        stock: {
          available: true,
          quantity: 5000
        },
        stats: {
          purchaseCount: 98750,
          rating: 4.9,
          reviewCount: 25102
        },
        description: "An essential, ultra-soft tee made from 100% premium organic cotton. Perfect for everyday wear."
      },
      {
        id: "prod_8NqgFF2eZvKYlo2CoEPpV1lZ",
        productName: "VortexFusion Power Blender, 1500W",
        productUrl: "/products/vortexfusion-power-blender",
        imageUrl: "https://via.placeholder.com/300x300.png?text=Power+Blender",
        category: "Home & Kitchen",
        pricing: {
          regularPrice: 149.99,
          salePrice: 119.99,
          couponPrice: 109.99,
          discountPercentage: 20,
          currency: "USD"
        },
        stock: {
          available: false,
          quantity: 0
        },
        stats: {
          purchaseCount: 6521,
          rating: 4.5,
          reviewCount: 1509
        },
        description: "Crush ice, nuts, and whole fruits in seconds. The ultimate tool for smoothies, soups, and sauces."
      },
      {
        id: "prod_9OqgGF2eZvKYlo2CpFQqW2mA",
        productName: "Nomad Traveler's Backpack, 40L, Black",
        productUrl: "/products/nomad-travelers-backpack-40l",
        imageUrl: "https://via.placeholder.com/300x300.png?text=Travel+Backpack",
        category: "Luggage & Travel",
        pricing: {
          regularPrice: 99.00,
          salePrice: 79.20,
          couponPrice: 79.20,
          discountPercentage: 20,
          currency: "USD"
        },
        stock: {
          available: true,
          quantity: 670
        },
        stats: {
          purchaseCount: 11023,
          rating: 4.8,
          reviewCount: 3011
        },
        description: "Durable, water-resistant, and feature-packed. The perfect companion for your next adventure."
      },
      {
        id: "prod_10PqgHF2eZvKYlo2CqGRrX3nB",
        productName: "4K Ultra HD Streaming Stick",
        productUrl: "/products/4k-uhd-streaming-stick",
        imageUrl: "https://via.placeholder.com/300x300.png?text=Streaming+Stick",
        category: "Electronics",
        pricing: {
          regularPrice: 49.99,
          salePrice: 39.99,
          couponPrice: 34.99,
          discountPercentage: 20,
          currency: "USD"
        },
        stock: {
          available: true,
          quantity: 3500
        },
        stats: {
          purchaseCount: 150888,
          rating: 4.7,
          reviewCount: 45021
        },
        description: "Stream your favorite movies and shows in stunning 4K resolution. Supports Dolby Vision and Atmos."
      }
    ];

    // 각 접근성 레벨별로 상품 데이터 생성
    const accessibilityLevels: ('none' | 'role-text' | 'aria-label')[] = ['none', 'role-text', 'aria-label'];
    
    accessibilityLevels.forEach(level => {
      baseProducts.forEach(baseProduct => {
        const product: Product = {
          ...baseProduct,
          accessibilityLevel: level
        };
        this.products.set(`${baseProduct.id}_${level}`, product);
      });
    });
  }
}

export const storage = new MemStorage();
