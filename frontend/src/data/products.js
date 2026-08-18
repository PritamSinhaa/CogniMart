export const products = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    category: "Electronics",
    brand: "Sony",
    price: 24990,
    originalPrice: 29990,
    discount: 17,
    rating: 4.8,
    reviews: 1240,
    stock: 12,
    description:
      "Experience exceptional sound with industry-leading noise cancellation, premium comfort, and intelligent listening features designed for everyday use.",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=85",
    ],
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    features: [
      "Industry-leading noise cancellation",
      "Up to 30 hours of battery life",
      "High-quality wireless audio",
      "Comfortable lightweight design",
      "Multipoint Bluetooth connection",
    ],
  },

  {
    id: 2,
    name: "Apple AirPods Pro 2nd Generation",
    category: "Electronics",
    brand: "Apple",
    price: 18990,
    originalPrice: 24900,
    discount: 24,
    rating: 4.7,
    reviews: 2180,
    stock: 20,
    description:
      "Immersive audio with advanced noise cancellation, transparency mode and a comfortable wireless design.",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1588423771073-b8903fbb2c0c?auto=format&fit=crop&w=1200&q=85",
    ],
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    features: [
      "Active noise cancellation",
      "Transparency mode",
      "Wireless charging case",
      "Spatial audio",
      "Long battery life",
    ],
  },

  {
    id: 3,
    name: "Samsung Galaxy Watch",
    category: "Wearables",
    brand: "Samsung",
    price: 14999,
    originalPrice: 18999,
    discount: 21,
    rating: 4.6,
    reviews: 842,
    stock: 8,
    description:
      "A modern smartwatch combining fitness tracking, notifications and everyday health features in a premium design.",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
    ],
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    features: [
      "Fitness tracking",
      "Heart rate monitoring",
      "Smart notifications",
      "Premium AMOLED display",
      "Water resistance",
    ],
  },

  {
    id: 4,
    name: "Nike Air Max Running Shoes",
    category: "Sports",
    brand: "Nike",
    price: 8499,
    originalPrice: 10999,
    discount: 23,
    rating: 4.5,
    reviews: 631,
    stock: 15,
    description:
      "Comfortable running shoes designed with responsive cushioning and a lightweight construction for everyday movement.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=85",
    ],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    features: [
      "Responsive cushioning",
      "Lightweight construction",
      "Breathable upper",
      "Durable outsole",
      "Everyday running comfort",
    ],
  },

  {
    id: 5,
    name: "Premium Wireless Bluetooth Speaker",
    category: "Electronics",
    brand: "JBL",
    price: 4499,
    originalPrice: 5999,
    discount: 25,
    rating: 4.4,
    reviews: 492,
    stock: 25,
    description:
      "Portable wireless speaker delivering powerful sound with a compact design for indoor and outdoor listening.",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1200&q=85",
    ],
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    features: [
      "Powerful wireless audio",
      "Portable design",
      "Long battery life",
      "Bluetooth connectivity",
      "Compact build",
    ],
  },

  {
    id: 6,
    name: "Modern Smart Backpack",
    category: "Accessories",
    brand: "UrbanGear",
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    rating: 4.5,
    reviews: 318,
    stock: 18,
    description:
      "A modern everyday backpack designed with multiple compartments, laptop protection and a clean minimal look.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=1200&q=85",
    ],
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    features: [
      "Laptop compartment",
      "Multiple storage pockets",
      "Water-resistant material",
      "Comfortable shoulder straps",
      "Minimal modern design",
    ],
  },
];

export const getProductById = (id) => {
  return products.find((product) => product.id === Number(id));
};