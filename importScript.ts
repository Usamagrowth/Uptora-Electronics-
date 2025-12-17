import { createClient } from '@sanity/client';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: '3xi6v4kc',
  dataset: 'production',
  apiVersion: '2025-12-17',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function uploadImage(imageFilename: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'images', 'products', imageFilename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return null;
    }

    const asset = await client.assets.upload('image', fs.createReadStream(filePath));
    return asset._id;
  } catch (error) {
    console.error(`❌ Image upload failed for ${imageFilename}:`, error);
    return null;
  }
}

async function importData() {
  console.log('🚀 Starting import...');

  const products = [
    { "name": "Flagship 5G Smartphone", "price": 899.99, "description": "High-end 5G smartphone...", "imageFilename": "product_1.png" },
    { "name": "Ultra-Portable Laptop (13-inch)", "price": 1199.00, "description": "Lightweight and powerful laptop...", "imageFilename": "product_2.jpg" },
    { "name": "Smart Inverter Washing Machine (8kg)", "price": 649.50, "description": "Energy-efficient washing machine...", "imageFilename": "product_3.png" },
    { "name": "High-Velocity Pedestal Fan", "price": 79.99, "description": "Powerful 3-speed pedestal fan...", "imageFilename": "product_4.png" },
    { "name": "Noise-Cancelling Wireless Headphones", "price": 199.00, "description": "Over-ear headphones...", "imageFilename": "product_5.png" },
    { "name": "4K Ultra HD Smart TV (55-inch)", "price": 799.00, "description": "Vibrant 4K UHD display...", "imageFilename": "product_6.png" },
    { "name": "Gaming Desktop PC (RTX 4070)", "price": 1899.99, "description": "Ready-to-go gaming rig...", "imageFilename": "product_7.png" },
    { "name": "Compact Microwave Oven (700W)", "price": 59.99, "description": "Essential compact microwave...", "imageFilename": "product_8.png" },
    { "name": "Ergonomic Wireless Mouse", "price": 35.50, "description": "Contoured wireless mouse...", "imageFilename": "product_9.png" },
    { "name": " Portable Bluetooth Speaker", "price": 89.00, "description": "Waterproof and rugged speaker...", "imageFilename": "product_10.png" },
    { "name": "Electric Kettle (1.7 Litre)", "price": 45.00, "description": "Fast-boiling electric kettle...", "imageFilename": "product_11.png" },
    { "name": "Smart Home Hub", "price": 149.00, "description": "Central device to control smart lights...", "imageFilename": "product_12.png" },
    { "name": " Mesh Wi-Fi System (3-Pack)", "price": 229.00, "description": "Eliminate dead zones...", "imageFilename": "product_13.png" },
    { "name": "Digital Camera (Mirrorless)", "price": 999.00, "description": "Compact mirrorless camera...", "imageFilename": "product_14.png" },
    { "name": "Air Purifier (HEPA Filter)", "price": 185.00, "description": "Removes 99.97% of airborne particles...", "imageFilename": "product_15.png" },
    { "name": "Gaming Keyboard (Mechanical)", "price": 119.99, "description": "Tactile mechanical keyboard...", "imageFilename": "product_16.png" },
    { "name": "Cordless Stick Vacuum", "price": 299.00, "description": "Lightweight, powerful cordless vacuum...", "imageFilename": "product_17.png" },
    { "name": "Portable Power Bank (20000mAh)", "price": 49.00, "description": "High-capacity power bank...", "imageFilename": "product_18.png" },
    { "name": "Wireless Charging Pad (Dual)", "price": 39.99, "description": "Dual wireless charging pad...", "imageFilename": "product_19.png" }
  ];

  for (const product of products) {
    console.log(`📦 Processing: ${product.name}`);
    const imageAssetId = await uploadImage(product.imageFilename);

    const document = {
      _type: 'product',
      name: product.name,
      price: product.price,
      description: product.description,
      slug: { 
        _type: 'slug', 
        current: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') 
      },
      images: imageAssetId ? [{
        _type: 'image',
        _key: Math.random().toString(36).substring(2, 9),
        asset: { _ref: imageAssetId, _type: 'reference' }
      }] : [],
    };

    try {
      await client.create(document);
      console.log(`✅ Uploaded: ${product.name}`);
    } catch (err) {
      console.error(`❌ Failed: ${product.name}`, err);
    }
  }
  console.log('🏁 Import Complete!');
}

// Ensure the function is called and handle top-level errors
importData().catch((err) => {
  console.error('💥 Global Error:', err);
});