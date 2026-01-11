import Product from "../models/Product.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        const { name, description, category, price, offerPrice } = req.body;
        const images = req.files;

        if(!name || !description || !category || !price || !offerPrice) {
            return res.json({success: false, message: "All fields are required"});
        }        

        // Upload images to Cloudinary
        let imageUrls = [];
        for(const item of images) {
            const result = await cloudinary.uploader.upload(item.path, {
                folder: "greenCart/products",
                resource_type: 'image'
            });
            imageUrls.push(result.secure_url);
            fs.unlinkSync(item.path);
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

// Update Product : /api/product/update/:id
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, offerPrice } = req.body;
        const files = req.files;

        const product = await Product.findById(id);
        if(!product) {
            return res.json({success: false, message: "Product not found"});
        }

        let imageUrls = product.image;
        
        // If new images are uploaded
        if(files && files.length > 0) {
            // Upload new images
            for(const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "greenCart/products",
                    resource_type: 'image'
                });
                imageUrls.push(result.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        const updateData = {};
        if(name) updateData.name = name;
        if(description) updateData.description = JSON.parse(description);
        if(category) updateData.category = category;
        if(price) updateData.price = Number(price);
        if(offerPrice) updateData.offerPrice = Number(offerPrice);
        if(files && files.length > 0) updateData.image = imageUrls;

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        return res.json({success: true, message: "Product updated successfully", product: updatedProduct});
    } catch (error) {
        console.error("Error in updating product:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

// Delete Product : /api/product/delete/:id
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if(!product) {
            return res.json({success: false, message: "Product not found"});
        }

        // Delete images from Cloudinary
        for(const imageUrl of product.image) {
            const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
            await cloudinary.uploader.destroy(`greenCart/products/${publicId}`);
        }

        await Product.findByIdAndDelete(id);
        return res.json({success: true, message: "Product deleted successfully"});
    } catch (error) {
        console.error("Error in deleting product:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

// Update Product Stock : /api/product/update-stock/:id
export const updateProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { inStock } = req.body;

        const product = await Product.findById(id);
        if(!product) {
            return res.json({success: false, message: "Product not found"});
        }

        product.inStock = inStock;
        await product.save();

        return res.json({success: true, message: "Product stock updated successfully", product});
    } catch (error) {
        console.error("Error in updating product stock:", error);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

