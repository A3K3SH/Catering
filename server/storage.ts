import { db } from "@db";
import { 
  users, 
  categories, 
  products, 
  orders, 
  orderItems, 
  contactSubmissions,
  testimonials,
  InsertCategory,
  InsertProduct,
  InsertUser,
  InsertOrder,
  InsertOrderItem,
  InsertContactSubmission,
  InsertTestimonial
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { compare, hash } from "./auth";

// User operations
export const storage = {
  // User operations
  async getUserByUsername(username: string) {
    const result = await db.query.users.findFirst({
      where: eq(users.username, username)
    });
    return result;
  },

  async insertUser(userData: InsertUser) {
    // Hash the password before storing
    const hashedPassword = await hash(userData.password);
    const newUser = { ...userData, password: hashedPassword };
    
    const result = await db.insert(users).values(newUser).returning();
    return result[0];
  },

  // Category operations
  async getAllCategories() {
    return db.query.categories.findMany({
      orderBy: categories.name
    });
  },

  async getCategoryById(id: number) {
    return db.query.categories.findFirst({
      where: eq(categories.id, id)
    });
  },

  async insertCategory(categoryData: InsertCategory) {
    const result = await db.insert(categories).values(categoryData).returning();
    return result[0];
  },

  async updateCategory(id: number, categoryData: Partial<InsertCategory>) {
    const result = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  },

  async deleteCategory(id: number) {
    // First check if there are any products in this category
    const productsInCategory = await db.query.products.findMany({
      where: eq(products.categoryId, id)
    });

    if (productsInCategory.length > 0) {
      throw new Error("Cannot delete category with existing products");
    }

    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result[0];
  },

  // Product operations
  async getAllProducts() {
    return db.query.products.findMany({
      orderBy: desc(products.createdAt),
      with: {
        category: true
      }
    });
  },

  async getProductsByCategory(categoryId: number) {
    return db.query.products.findMany({
      where: eq(products.categoryId, categoryId),
      orderBy: products.name,
      with: {
        category: true
      }
    });
  },

  async getProductById(id: number) {
    return db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true
      }
    });
  },

  async insertProduct(productData: InsertProduct) {
    const result = await db.insert(products).values(productData).returning();
    return result[0];
  },

  async updateProduct(id: number, productData: Partial<InsertProduct>) {
    const result = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  },

  async deleteProduct(id: number) {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result[0];
  },

  // Order operations
  async getAllOrders() {
    return db.query.orders.findMany({
      orderBy: desc(orders.createdAt),
      with: {
        orderItems: {
          with: {
            product: true
          }
        }
      }
    });
  },

  async getOrderById(id: number) {
    return db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        orderItems: {
          with: {
            product: true
          }
        }
      }
    });
  },

  async insertOrder(orderData: InsertOrder, orderItemsData: InsertOrderItem[]) {
    // Start a transaction to ensure both order and items are saved
    const result = await db.transaction(async (tx) => {
      const [newOrder] = await tx.insert(orders).values(orderData).returning();
      
      if (orderItemsData.length > 0) {
        // Add orderId to each order item
        const itemsWithOrderId = orderItemsData.map(item => ({
          ...item,
          orderId: newOrder.id
        }));
        
        await tx.insert(orderItems).values(itemsWithOrderId);
      }
      
      return newOrder;
    });

    return result;
  },

  async updateOrderStatus(id: number, status: string) {
    const result = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  },

  // Contact submission operations
  async insertContactSubmission(data: InsertContactSubmission) {
    const result = await db.insert(contactSubmissions).values(data).returning();
    return result[0];
  },

  async getAllContactSubmissions() {
    return db.query.contactSubmissions.findMany({
      orderBy: desc(contactSubmissions.createdAt)
    });
  },

  // Testimonial operations
  async getAllTestimonials(visibleOnly = true) {
    if (visibleOnly) {
      return db.query.testimonials.findMany({
        where: eq(testimonials.isVisible, true),
        orderBy: desc(testimonials.createdAt)
      });
    } else {
      return db.query.testimonials.findMany({
        orderBy: desc(testimonials.createdAt)
      });
    }
  },

  async insertTestimonial(data: InsertTestimonial) {
    const result = await db.insert(testimonials).values(data).returning();
    return result[0];
  },

  async updateTestimonialVisibility(id: number, isVisible: boolean) {
    const result = await db
      .update(testimonials)
      .set({ isVisible })
      .where(eq(testimonials.id, id))
      .returning();
    return result[0];
  }
};
