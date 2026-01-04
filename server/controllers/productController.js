import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        const { name, description, category, price, offerPrice } = req.body;
        const files = req.files;

        if(!name || !description || !category || !price || !offerPrice) {
            return res.json({success: false, message: "All fields are required"});
        }

        if(!files || files.length === 0) {
            return res.json({success: false, message: "At least one image is required"});
        }

        // Upload images to Cloudinary
        const imageUrls = [];
        for(const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "greenCart/products",
            });
            imageUrls.push(result.secure_url);
            // Delete file from server
            fs.unlinkSync(file.path);
        }

        const product = await Product.create({
            name,
            description: JSON.parse(description),
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            image: imageUrls,
        });

        return res.json({success: true, message: "Product added successfully", product});
    } catch (error) {
        console.error("Error in adding product:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

// Get All Products : /api/product/all
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        return res.json({success: true, products});
    } catch (error) {
        console.error("Error in fetching products:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

// Get Product by ID : /api/product/:id
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if(!product) {
            return res.json({success: false, message: "Product not found"});
        }
        return res.json({success: true, product});
    } catch (error) {
        console.error("Error in fetching product:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};