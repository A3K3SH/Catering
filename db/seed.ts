import { db } from "./index";
import * as schema from "@shared/schema";
import { hash } from "../server/auth";

async function seed() {
  try {
    console.log("Starting database seeding...");
    
    // Seed admin user
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, "admin")
    });
    
    if (!existingAdmin) {
      console.log("Creating admin user...");
      const hashedPassword = await hash("admin123");
      await db.insert(schema.users).values({
        username: "admin",
        password: hashedPassword,
        isAdmin: true
      });
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists, skipping");
    }
    
    // Seed categories
    const categories = [
      { name: "Main Course", description: "Hearty and filling dishes that form the core of traditional Indian meals" },
      { name: "Appetizers", description: "Small, flavorful dishes to start your meal" },
      { name: "Desserts", description: "Sweet treats to complete your Indian dining experience" },
      { name: "Vegan Options", description: "Plant-based dishes full of traditional Indian flavors" },
      { name: "Beverages", description: "Traditional and refreshing Indian drinks" },
      { name: "Party Platters", description: "Large sharing portions perfect for celebrations and events" }
    ];
    
    console.log("Seeding categories...");
    for (const category of categories) {
      const existingCategory = await db.query.categories.findFirst({
        where: (categories, { eq }) => eq(categories.name, category.name)
      });
      
      if (!existingCategory) {
        await db.insert(schema.categories).values(category);
        console.log(`Category '${category.name}' added`);
      } else {
        console.log(`Category '${category.name}' already exists, skipping`);
      }
    }
    
    // Retrieve created categories for reference
    const createdCategories = await db.query.categories.findMany();
    const categoryMap = new Map(createdCategories.map(c => [c.name, c.id]));
    
    // Seed products
    const products = [
      {
        name: "Butter Chicken",
        description: "Tender chicken pieces marinated and cooked in a creamy tomato sauce with aromatic spices.",
        price: 450,
        imageUrl: "https://pixabay.com/get/g263ddf4fb3203fb92103dd6aa29bf7b60110ce452dd523a1fe9fac9710fcebd34d4428aa12661d3a44c7f65e78da330e9b27b184b17ac984d914df8409d59759_1280.jpg",
        servingSize: "2-3",
        categoryId: categoryMap.get("Main Course")
      },
      {
        name: "Paneer Tikka",
        description: "Marinated cottage cheese cubes grilled with bell peppers, onions, and traditional spices.",
        price: 380,
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        servingSize: "2-3",
        categoryId: categoryMap.get("Appetizers")
      },
      {
        name: "Vegetable Biryani",
        description: "Fragrant basmati rice cooked with mixed vegetables and aromatic spices, garnished with fried onions.",
        price: 320,
        imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        servingSize: "3-4",
        categoryId: categoryMap.get("Main Course")
      },
      {
        name: "Assorted Naan Bread",
        description: "Freshly baked naan bread in various flavors: plain, garlic, butter, and cheese.",
        price: 180,
        imageUrl: "https://pixabay.com/get/g074195a6bad18aed1083d8bb4cfc00c4ef7dc32794ae16f5759035ebc4d05819bb5ae8dc940c5597716aa55e818916d8eb1a4ce7498eb0fa6b859750b267e112_1280.jpg",
        servingSize: "2-3",
        categoryId: categoryMap.get("Appetizers")
      },
      {
        name: "Dal Makhani",
        description: "Black lentils and kidney beans slow-cooked with butter, cream, and a blend of traditional spices.",
        price: 280,
        imageUrl: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        servingSize: "2-3",
        categoryId: categoryMap.get("Main Course")
      },
      {
        name: "Vegetable Samosas",
        description: "Crispy pastry triangles filled with spiced potatoes, peas, and served with mint and tamarind chutneys.",
        price: 220,
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        servingSize: "4-6",
        categoryId: categoryMap.get("Appetizers")
      },
      {
        name: "Gulab Jamun",
        description: "Soft, spongy milk solids balls soaked in rose and cardamom flavored sugar syrup.",
        price: 180,
        imageUrl: "https://images.unsplash.com/photo-1594149634696-e8c3365a0e2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        servingSize: "4-5",
        categoryId: categoryMap.get("Desserts")
      },
      {
        name: "Chana Masala",
        description: "Chickpeas cooked in a spicy tomato-based sauce with traditional spices and herbs.",
        price: 260,
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        servingSize: "2-3",
        categoryId: categoryMap.get("Vegan Options")
      },
      {
        name: "Mango Lassi",
        description: "A refreshing yogurt-based drink blended with sweet mango pulp and a hint of cardamom.",
        price: 120,
        imageUrl: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        servingSize: "1",
        categoryId: categoryMap.get("Beverages")
      },
      {
        name: "Family Feast Platter",
        description: "An assortment of popular dishes including butter chicken, paneer tikka, vegetable biryani, and naan bread.",
        price: 1200,
        imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        servingSize: "5-6",
        categoryId: categoryMap.get("Party Platters")
      }
    ];
    
    console.log("Seeding products...");
    for (const product of products) {
      const existingProduct = await db.query.products.findFirst({
        where: (products, { eq }) => eq(products.name, product.name)
      });
      
      if (!existingProduct) {
        // Convert number price to string to match schema expectations
        const productToInsert = {
          ...product,
          price: product.price.toString()
        };
        await db.insert(schema.products).values(productToInsert);
        console.log(`Product '${product.name}' added`);
      } else {
        console.log(`Product '${product.name}' already exists, skipping`);
      }
    }
    
    // Seed testimonials
    const testimonials = [
      {
        name: "Priya Sharma",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5.0,
        comment: "The food was absolutely amazing! Everything was fresh and flavorful. Our guests couldn't stop talking about how delicious the butter chicken and naan were.",
        eventType: "Wedding Reception",
        isVisible: true
      },
      {
        name: "Rajiv Patel",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5.0,
        comment: "Taste of India catered our corporate event, and the service was impeccable. The food presentation was beautiful, and they accommodated all our dietary requirements.",
        eventType: "Corporate Event",
        isVisible: true
      },
      {
        name: "Anita Desai",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 4.5,
        comment: "We ordered for a family gathering, and everyone was impressed with the variety and quality. The vegetarian options were particularly outstanding, with authentic flavors.",
        eventType: "Family Gathering",
        isVisible: true
      }
    ];
    
    console.log("Seeding testimonials...");
    for (const testimonial of testimonials) {
      const existingTestimonial = await db.query.testimonials.findFirst({
        where: (testimonials, { and, eq }) => 
          and(
            eq(testimonials.name, testimonial.name),
            eq(testimonials.eventType, testimonial.eventType)
          )
      });
      
      if (!existingTestimonial) {
        // Convert number rating to string to match schema expectations
        const testimonialToInsert = {
          ...testimonial,
          rating: testimonial.rating.toString()
        };
        await db.insert(schema.testimonials).values(testimonialToInsert);
        console.log(`Testimonial from '${testimonial.name}' added`);
      } else {
        console.log(`Testimonial from '${testimonial.name}' already exists, skipping`);
      }
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

seed();
