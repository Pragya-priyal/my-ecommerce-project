import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch"; // to fetch data from API
import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1️⃣ Fetch products from FakeStoreAPI
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    // 2️⃣ Extract categories
    const categories = [
      ...new Set(products.map((p) => p.category)),
    ];

    // 3️⃣ Clear existing collections (optional)
    await Product.deleteMany();
    await Category.deleteMany();

    // 4️⃣ Insert categories into DB
    const categoryDocs = await Category.insertMany(
      categories.map((name) => ({ name }))
    );

    // 5️⃣ Map category names to their MongoDB IDs
    const categoryMap = {};
    categoryDocs.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // 6️⃣ Insert products with category references
    const productDocs = products.map((p) => ({
      name: p.title,
      image: p.image,
      brand: "FakeStore",
      quantity: 100, // default quantity
      category: categoryMap[p.category],
      description: p.description,
      price: p.price,
      countInStock: 50,
      reviews: [],
    }));

    await Product.insertMany(productDocs);

    console.log("Data imported successfully ✅");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
