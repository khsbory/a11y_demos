import { describe, it, expect, beforeEach } from "vitest";
import { MemStorage } from "./storage";

describe("MemStorage", () => {
    let storage: MemStorage;

    beforeEach(() => {
        storage = new MemStorage();
    });

    it("should create and retrieve a user", async () => {
        const insertUser = {
            username: "testuser",
            password: "password123",
        };
        const user = await storage.createUser(insertUser);
        expect(user.id).toBeDefined();
        expect(user.username).toBe(insertUser.username);

        const retrievedUser = await storage.getUser(user.id);
        expect(retrievedUser).toEqual(user);
    });

    it("should retrieve products by accessibility level", async () => {
        const products = await storage.getProducts("aria-label");
        expect(products.length).toBeGreaterThan(0);
        products.forEach(p => {
            expect(p.accessibilityLevel).toBe("aria-label");
        });
    });

    it("should filter products by category", async () => {
        const electronics = await storage.getProductsByCategory("none", "Electronics");
        expect(electronics.length).toBeGreaterThan(0);
        electronics.forEach(p => {
            expect(p.category).toBe("Electronics");
        });
    });

    it("should search products by name", async () => {
        const results = await storage.searchProducts("none", "iPhone");
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].productName).toContain("iPhone");
    });
});
