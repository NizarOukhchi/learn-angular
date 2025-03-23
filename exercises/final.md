# Angular E-Commerce Project - Final Take-Home Assignment

## Project Description

For your final project, you'll build a small e-commerce application that puts together everything you've learned in this course. This project will challenge you to apply Angular's core concepts including components, services, routing, reactive forms, and state management with signals.

## Project Goals

- Create a responsive e-commerce application with Angular and Tailwind CSS
- Implement product listing, filtering, and pagination
- Create detailed product views with related products
- Build a functional shopping cart with persistent state
- Apply form validation for checkout
- Practice component composition and state management

## Requirements

### Core Features

1. **Product Listing**

   - Display products with images, names, prices, and ratings
   - Implement pagination (6-8 products per page)
   - Create filtering by category, price range, and ratings
   - Add sorting options (price low to high, price high to low, popularity)

2. **Product Detail Page**

   - Show comprehensive product information
   - Display product images, description, specifications
   - Include customer ratings and reviews
   - Show related products
   - Add to cart functionality

3. **Shopping Cart**

   - Add products to cart
   - Update product quantities
   - Remove products from cart
   - Calculate subtotals and totals
   - Persist cart between sessions (localStorage)

4. **Checkout Process**
   - Multi-step checkout form with validation
   - Shipping information collection
   - Order summary
   - Mock payment method selection (no actual payment processing)

### Technical Requirements

1. **State Management**

   - Use Angular signals for reactive state management
   - Implement services to manage application state
   - Ensure proper data flow between components

2. **Routing & Navigation**

   - Create a logical route structure
   - Implement route parameters for product details
   - Add route guards where applicable
   - Include breadcrumb navigation

3. **Styling & Responsiveness**

   - Use Tailwind CSS for styling
   - Ensure responsive design for mobile, tablet, and desktop
   - Create a consistent and appealing visual design

4. **Code Organization**
   - Follow Angular best practices for component structure
   - Use proper service abstraction
   - Implement reusable components
   - Add proper documentation and comments

## Suggested JSON Server Data Structure

Create a `db.json` file with the following structure:

```json
{
  "products": [
    {
      "id": 1,
      "name": "Smartphone Pro Max",
      "description": "The latest flagship smartphone with advanced camera system and all-day battery life.",
      "longDescription": "Experience the next generation of mobile technology with the Smartphone Pro Max. Featuring a stunning 6.7-inch Super Retina XDR display, an advanced triple-camera system that takes your photography to the professional level, and a powerful A15 chip that delivers lightning-fast performance for gaming and augmented reality experiences. With all-day battery life and 5G capabilities, this smartphone keeps you connected and productive throughout your day.",
      "price": 999.99,
      "discountPrice": 899.99,
      "imageUrl": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
      "images": ["https://images.unsplash.com/photo-1592899677977-9c10ca588bbd", "https://images.unsplash.com/photo-1580910051074-3eb694886505", "https://images.unsplash.com/photo-1598327105666-5b89351aff97"],
      "category": "electronics",
      "rating": 4.8,
      "reviews": 325,
      "stockCount": 45,
      "specs": {
        "display": "6.7-inch Super Retina XDR",
        "processor": "A15 Bionic Chip",
        "storage": "256GB",
        "camera": "Triple 12MP camera system",
        "battery": "4000mAh"
      },
      "featured": true
    },
    {
      "id": 2,
      "name": "Wireless Noise-Cancelling Headphones",
      "description": "Premium wireless headphones with adaptive noise cancellation and high-fidelity audio.",
      "longDescription": "Immerse yourself in your favorite music with these premium wireless headphones. Featuring adaptive noise cancellation technology that adjusts to your environment, these headphones deliver crystal-clear audio without distractions. With up to 30 hours of battery life, comfortable over-ear design, and intuitive touch controls, these headphones are perfect for long listening sessions, travel, or working from home.",
      "price": 349.99,
      "discountPrice": null,
      "imageUrl": "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
      "images": ["https://images.unsplash.com/photo-1546435770-a3e426bf472b", "https://images.unsplash.com/photo-1583394838336-acd977736f90", "https://images.unsplash.com/photo-1584670747417-594a9412fba5"],
      "category": "electronics",
      "rating": 4.7,
      "reviews": 182,
      "stockCount": 32,
      "specs": {
        "type": "Over-ear",
        "batteryLife": "30 hours",
        "connectivity": "Bluetooth 5.0",
        "noiseCancellation": "Adaptive",
        "color": "Black"
      },
      "featured": true
    },
    {
      "id": 3,
      "name": "Ultra HD Smart TV 55\"",
      "description": "55-inch 4K Ultra HD Smart TV with HDR and built-in streaming apps.",
      "longDescription": "Transform your home entertainment experience with this 55-inch Ultra HD Smart TV. Featuring 4K resolution, HDR technology, and a wide color gamut, this TV delivers stunning picture quality with vivid colors and deep blacks. The smart platform gives you access to thousands of streaming apps, and the voice-enabled remote makes finding content easier than ever. With multiple HDMI and USB ports, you can connect all your devices for a complete entertainment setup.",
      "price": 699.99,
      "discountPrice": 599.99,
      "imageUrl": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
      "images": ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1", "https://images.unsplash.com/photo-1601944177325-f8867652837f", "https://images.unsplash.com/photo-1509281373149-e957c6296406"],
      "category": "electronics",
      "rating": 4.5,
      "reviews": 208,
      "stockCount": 18,
      "specs": {
        "resolution": "4K Ultra HD (3840 x 2160)",
        "displayType": "LED",
        "refreshRate": "60Hz",
        "smartPlatform": "WebOS",
        "hdmiPorts": 3
      },
      "featured": false
    },
    {
      "id": 4,
      "name": "Classic Cotton T-Shirt",
      "description": "Comfortable 100% cotton t-shirt with a modern fit, perfect for everyday wear.",
      "longDescription": "Add a versatile staple to your wardrobe with this classic cotton t-shirt. Made from premium 100% combed cotton for exceptional softness and durability, this t-shirt features a modern fit that's flattering without being too tight. The reinforced collar and double-stitched seams ensure it maintains its shape wash after wash. Available in multiple colors, this t-shirt is perfect for layering or wearing on its own year-round.",
      "price": 19.99,
      "discountPrice": null,
      "imageUrl": "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
      "images": ["https://images.unsplash.com/photo-1581655353564-df123a1eb820", "https://images.unsplash.com/photo-1622445275576-721325763afe", "https://images.unsplash.com/photo-1598033129183-c4f50c736f10"],
      "category": "clothing",
      "rating": 4.3,
      "reviews": 412,
      "stockCount": 150,
      "specs": {
        "material": "100% Cotton",
        "fit": "Regular",
        "careInstructions": "Machine wash cold",
        "origin": "Made in USA",
        "availableSizes": ["S", "M", "L", "XL", "XXL"]
      },
      "featured": false
    },
    {
      "id": 5,
      "name": "Stainless Steel Water Bottle",
      "description": "Double-walled insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
      "longDescription": "Stay hydrated in style with this premium stainless steel water bottle. The double-walled vacuum insulation keeps your drinks cold for up to 24 hours or hot for up to 12 hours, making it perfect for hiking, office use, or everyday hydration. Made from high-quality 18/8 stainless steel that's both durable and BPA-free, this bottle features a leak-proof lid with a convenient carrying handle. Its sleek design fits most cup holders and bag side pockets for easy transport.",
      "price": 34.99,
      "discountPrice": 29.99,
      "imageUrl": "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
      "images": ["https://images.unsplash.com/photo-1602143407151-7111542de6e8", "https://images.unsplash.com/photo-1610847244057-02a5d33e2f83", "https://images.unsplash.com/photo-1589365278144-c9e705f843ba"],
      "category": "home",
      "rating": 4.6,
      "reviews": 275,
      "stockCount": 85,
      "specs": {
        "capacity": "750ml",
        "material": "18/8 Stainless Steel",
        "insulation": "Double-walled vacuum",
        "lidType": "Screw top with handle",
        "color": "Brushed Steel"
      },
      "featured": true
    },
    {
      "id": 6,
      "name": "Wireless Gaming Mouse",
      "description": "High-precision wireless gaming mouse with RGB lighting and customizable buttons.",
      "longDescription": "Elevate your gaming experience with this high-performance wireless gaming mouse. Featuring a high-precision 16,000 DPI optical sensor for pixel-perfect accuracy and ultra-low latency wireless connectivity, this mouse gives you the competitive edge in any game. The customizable RGB lighting with 16.8 million color options lets you personalize your setup, while the 6 programmable buttons can be configured to your play style. With up to 60 hours of battery life and a comfortable ergonomic design, you can game for hours in comfort.",
      "price": 69.99,
      "discountPrice": 59.99,
      "imageUrl": "https://images.unsplash.com/photo-1563297007-0686b7003af7",
      "images": ["https://images.unsplash.com/photo-1563297007-0686b7003af7", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7", "https://images.unsplash.com/photo-1527814050087-3793815479db"],
      "category": "electronics",
      "rating": 4.4,
      "reviews": 198,
      "stockCount": 42,
      "specs": {
        "sensor": "16,000 DPI optical",
        "connectivity": "2.4GHz wireless / USB",
        "buttons": "6 programmable buttons",
        "batteryLife": "Up to 60 hours",
        "weight": "95g"
      },
      "featured": false
    },
    {
      "id": 7,
      "name": "Handcrafted Ceramic Mug Set",
      "description": "Set of 4 handcrafted ceramic mugs, each with a unique glaze pattern and comfortable handle.",
      "longDescription": "Add a touch of artisanal charm to your morning routine with this set of 4 handcrafted ceramic mugs. Each mug is individually thrown on a potter's wheel and features a unique glaze pattern, ensuring no two are exactly alike. With a generous 12oz capacity and a comfortable ergonomic handle, these mugs are perfect for coffee, tea, or hot chocolate. The stoneware ceramic construction retains heat well and is both microwave and dishwasher safe for everyday convenience.",
      "price": 49.99,
      "discountPrice": null,
      "imageUrl": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
      "images": ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d", "https://images.unsplash.com/photo-1578081827575-7c5e66dc5c14", "https://images.unsplash.com/photo-1563826904577-6b72c5d75e53"],
      "category": "home",
      "rating": 4.9,
      "reviews": 87,
      "stockCount": 24,
      "specs": {
        "material": "Stoneware ceramic",
        "capacity": "12oz",
        "dimensions": "4\"H x 3.5\"D",
        "care": "Dishwasher and microwave safe",
        "includes": "Set of 4 mugs"
      },
      "featured": false
    },
    {
      "id": 8,
      "name": "Slim Leather Wallet",
      "description": "Minimalist leather wallet with RFID blocking technology and space for essential cards and cash.",
      "longDescription": "Streamline your everyday carry with this slim leather wallet. Crafted from full-grain leather that develops a beautiful patina over time, this wallet combines classic style with modern functionality. The thoughtful design includes space for up to 8 cards, a convenient ID window, and a slim pocket for folded cash, all while maintaining a compact profile that fits comfortably in your front pocket. Built-in RFID blocking technology protects your credit cards from unauthorized scanning.",
      "price": 39.99,
      "discountPrice": 34.99,
      "imageUrl": "https://images.unsplash.com/photo-1627123424574-724758594e93",
      "images": ["https://images.unsplash.com/photo-1627123424574-724758594e93", "https://images.unsplash.com/photo-1606816877038-d9a50a56609f", "https://images.unsplash.com/photo-1630508269166-3c9aea8833b3"],
      "category": "accessories",
      "rating": 4.6,
      "reviews": 132,
      "stockCount": 67,
      "specs": {
        "material": "Full-grain leather",
        "dimensions": "4\"W x 3\"H x 0.4\"D",
        "cardSlots": 8,
        "features": "RFID blocking, ID window",
        "color": "Brown"
      },
      "featured": true
    },
    {
      "id": 9,
      "name": "Smart Fitness Tracker",
      "description": "Advanced fitness tracker with heart rate monitoring, sleep tracking, and 7-day battery life.",
      "longDescription": "Take control of your health and fitness with this advanced smart fitness tracker. Track your daily activity including steps, distance, calories burned, and active minutes. The 24/7 heart rate monitoring provides insights into your cardio health, workout intensity, and calorie burn. Advanced sleep tracking analyzes your sleep stages to help you understand and improve your sleep quality. With a water-resistant design and up to 7 days of battery life, this tracker keeps up with your active lifestyle. The companion app provides detailed analytics and personalized insights to help you reach your health goals.",
      "price": 89.99,
      "discountPrice": 79.99,
      "imageUrl": "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6",
      "images": ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6", "https://images.unsplash.com/photo-1510771463146-e89e6e86560e", "https://images.unsplash.com/photo-1509233725247-49e657c54213"],
      "category": "electronics",
      "rating": 4.5,
      "reviews": 246,
      "stockCount": 53,
      "specs": {
        "display": "OLED touchscreen",
        "batteryLife": "Up to 7 days",
        "waterResistance": "5 ATM",
        "sensors": "Heart rate, accelerometer, gyroscope",
        "compatibility": "iOS and Android"
      },
      "featured": true
    },
    {
      "id": 10,
      "name": "Cast Iron Skillet",
      "description": "Pre-seasoned 10.25-inch cast iron skillet, perfect for searing, baking, broiling, and more.",
      "longDescription": "Experience the versatility and durability of this classic 10.25-inch cast iron skillet. Pre-seasoned with vegetable oil for a natural, easy-release finish that improves with use, this skillet is ready to use right out of the box. The unparalleled heat retention and even heating of cast iron makes it perfect for searing, sautéing, baking, broiling, and frying. The helper handle provides added support when moving between stovetop and oven. This heirloom-quality piece can last for generations with proper care and becomes naturally non-stick the more you use it.",
      "price": 29.99,
      "discountPrice": null,
      "imageUrl": "https://images.unsplash.com/photo-1574181609941-50c9722f2e49",
      "images": ["https://images.unsplash.com/photo-1574181609941-50c9722f2e49", "https://images.unsplash.com/photo-1620809876622-3c9a8555359a", "https://images.unsplash.com/photo-1626251376203-230f5f4620a3"],
      "category": "home",
      "rating": 4.8,
      "reviews": 372,
      "stockCount": 96,
      "specs": {
        "diameter": "10.25 inches",
        "material": "Cast iron",
        "weight": "5.2 lbs",
        "preSeasoned": "Yes",
        "compatible": "Stovetop, oven, grill, campfire"
      },
      "featured": false
    },
    {
      "id": 11,
      "name": "Leather Crossbody Bag",
      "description": "Stylish genuine leather crossbody bag with adjustable strap and multiple compartments.",
      "longDescription": "Combine style and practicality with this genuine leather crossbody bag. Crafted from high-quality leather that gets better with age, this bag features a spacious main compartment with a zip closure for security, plus additional interior and exterior pockets to keep your essentials organized. The adjustable strap allows for comfortable carrying at your preferred length, while the sleek, minimalist design transitions seamlessly from day to night. Perfect for travel, shopping, or everyday use, this versatile bag adds a touch of sophistication to any outfit.",
      "price": 79.99,
      "discountPrice": null,
      "imageUrl": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
      "images": ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7", "https://images.unsplash.com/photo-1614179689702-66d01a81de15", "https://images.unsplash.com/photo-1601912262338-74a0308f37d0"],
      "category": "accessories",
      "rating": 4.7,
      "reviews": 154,
      "stockCount": 39,
      "specs": {
        "material": "Genuine leather",
        "dimensions": "9\"W x 7\"H x 3\"D",
        "pockets": "1 main, 2 interior, 1 exterior",
        "closure": "Zipper",
        "strap": "Adjustable, 48\" max"
      },
      "featured": true
    },
    {
      "id": 12,
      "name": "Portable Bluetooth Speaker",
      "description": "Waterproof portable Bluetooth speaker with 20 hours of playtime and rich, immersive sound.",
      "longDescription": "Take your music anywhere with this rugged, waterproof Bluetooth speaker. Delivering powerful, immersive sound with deep bass and clear highs, this speaker transforms any location into your personal concert venue. The IPX7 waterproof rating means it can handle splashes, rain, and even brief submersion, making it perfect for pool parties or beach days. With up to 20 hours of playtime on a single charge and built-in power bank functionality to charge your devices, you'll never have to cut the music short. The durable fabric cover and rubber housing protect against drops and bumps for worry-free portability.",
      "price": 129.99,
      "discountPrice": 99.99,
      "imageUrl": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      "images": ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1", "https://images.unsplash.com/photo-1563330232-57114bb0823c", "https://images.unsplash.com/photo-1574435298396-f3be6023c832"],
      "category": "electronics",
      "rating": 4.6,
      "reviews": 285,
      "stockCount": 48,
      "specs": {
        "waterproofRating": "IPX7",
        "batteryLife": "20 hours",
        "connectivity": "Bluetooth 5.1",
        "range": "Up to 100 feet",
        "power": "30 watts"
      },
      "featured": false
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "electronics",
      "displayName": "Electronics",
      "description": "Latest gadgets and electronic devices"
    },
    {
      "id": 2,
      "name": "clothing",
      "displayName": "Clothing",
      "description": "Stylish and comfortable apparel"
    },
    {
      "id": 3,
      "name": "home",
      "displayName": "Home & Kitchen",
      "description": "Essentials for your home"
    },
    {
      "id": 4,
      "name": "accessories",
      "displayName": "Accessories",
      "description": "Fashionable accessories to complete your look"
    }
  ],
  "orders": []
}
```

## Suggested TypeScript Interfaces

For your application, you should create TypeScript interfaces to model your data. Here's a suggested Order interface:

```typescript
// Product interface
export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  stockCount: number;
  specs: Record<string, string | number | string[]>;
  featured: boolean;
}

// Category interface
export interface Category {
  id: number;
  name: string;
  displayName: string;
  description: string;
}

// Cart Item interface
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order Item interface
export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Address interface
export interface Address {
  fullName: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  isDefault?: boolean;
}

// Payment Method interface
export interface PaymentMethod {
  type: "creditCard" | "paypal" | "applePay" | "googlePay";
  cardNumber?: string;
  nameOnCard?: string;
  expirationDate?: string;
  cvv?: string;
}

// Order interface
export interface Order {
  id: number;
  customerId?: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  notes?: string;
}
```

These interfaces will help you maintain type safety throughout your application and ensure consistent data structure.

## Project Structure Suggestion

Consider organizing your application with the following structure:

```
src/
├── app/
│   ├── components/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── home/
│   │   ├── navbar/
│   │   ├── product-card/
│   │   ├── product-detail/
│   │   ├── product-list/
│   │   ├── filter/
│   │   └── pagination/
│   ├── services/
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   └── order.service.ts
│   ├── models/
│   │   ├── product.type.ts
│   │   ├── cart.type.ts
│   │   └── order.type.ts
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.routes.ts
```

## Evaluation Criteria

Your project will be evaluated based on:

1. **Functionality**: Does the application work as expected? Are all requirements implemented?
2. **Code Quality**: Is the code well-organized, documented, and following best practices?
3. **User Experience**: Is the interface intuitive and responsive across devices?
4. **Visual Design**: Is the application visually appealing and consistent?
5. **Technical Choices**: Are appropriate Angular features used for each part of the application?

## Submission Requirements

- GitHub repository link with your code
- Running instance of the application (deploy to Vercel, Netlify, or a similar service if possible)
- Brief documentation explaining:
  - How to run the application locally
  - Any notable features or implementation details
  - Any challenges you faced and how you solved them
  - Future improvements you would make with more time

Good luck, and we look forward to seeing your e-commerce application!
