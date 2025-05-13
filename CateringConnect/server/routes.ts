import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import { configureAuth } from "./auth";
import { 
  insertCategorySchema, 
  insertProductSchema, 
  insertUserSchema, 
  insertOrderSchema,
  insertContactSubmissionSchema,
  insertTestimonialSchema,
  CartItem
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure authentication
  const { isAuthenticated, isAdmin } = configureAuth(app);
  
  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info.message || "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json({ user });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Error logging out" });
      res.json({ success: true });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json({ user: req.user });
    }
    res.status(401).json({ message: "Not authenticated" });
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.post("/api/categories", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.insertCategory(validatedData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Error creating category" });
    }
  });

  app.patch("/api/categories/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateCategory(id, validatedData);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Error updating category" });
    }
  });

  app.delete("/api/categories/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.status(204).end();
    } catch (error) {
      if (error instanceof Error && error.message.includes("Cannot delete category")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error deleting category" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const categoryId = req.query.categoryId 
        ? parseInt(req.query.categoryId as string) 
        : undefined;
        
      let products;
      if (categoryId) {
        products = await storage.getProductsByCategory(categoryId);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  app.post("/api/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Validate and transform price from string to number if needed
      const validatedData = insertProductSchema.parse({
        ...req.body,
        price: typeof req.body.price === 'string' 
          ? parseFloat(req.body.price) 
          : req.body.price,
        categoryId: typeof req.body.categoryId === 'string'
          ? parseInt(req.body.categoryId)
          : req.body.categoryId
      });
      
      const newProduct = await storage.insertProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating product:', error);
      res.status(500).json({ message: "Error creating product" });
    }
  });

  app.patch("/api/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Handle potential string values for numeric fields
      const productData = {
        ...req.body,
        price: req.body.price !== undefined 
          ? (typeof req.body.price === 'string' 
              ? parseFloat(req.body.price) 
              : req.body.price)
          : undefined,
        categoryId: req.body.categoryId !== undefined
          ? (typeof req.body.categoryId === 'string'
              ? parseInt(req.body.categoryId)
              : req.body.categoryId)
          : undefined
      };
      
      const validatedData = insertProductSchema.partial().parse(productData);
      const updatedProduct = await storage.updateProduct(id, validatedData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Error updating product" });
    }
  });

  app.delete("/api/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, customerInfo } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order must contain items" });
      }
      
      // Calculate total amount from items
      const totalAmount = items.reduce(
        (sum: number, item: CartItem) => sum + (item.price * item.quantity), 
        0
      );
      
      // Validate order data
      const orderData = {
        customerName: customerInfo?.name || "Guest",
        customerEmail: customerInfo?.email || "guest@example.com",
        customerPhone: customerInfo?.phone || "0000000000",
        totalAmount,
        status: "pending"
      };
      
      const validatedOrderData = insertOrderSchema.parse(orderData);
      
      // Create order items data
      // The final order ID will be provided by the insertOrder function after order creation
      // Storage layer handles adding the orderId to each item internally
      const orderItemsData = items.map((item: CartItem) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price.toString(),
        orderId: 0 // This will be set in the storage layer with the real order ID
      }));
      
      const newOrder = await storage.insertOrder(validatedOrderData, orderItemsData);
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating order:', error);
      res.status(500).json({ message: "Error creating order" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const newSubmission = await storage.insertContactSubmission(validatedData);
      res.status(201).json(newSubmission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Error submitting contact form" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const visibleOnly = req.query.admin !== 'true';
      const testimonials = await storage.getAllTestimonials(visibleOnly);
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
