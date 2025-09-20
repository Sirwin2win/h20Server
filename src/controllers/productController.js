const Product = require('../models/productModel.js');
const fs = require("fs");
const path = require("path");
const pool = require('../config/database');



// Get all Products
const getProducts = async (req, res)=>{
    try {
        const [rows] = await pool.query('SELECT * FROM products');
            res.json(rows);
    } catch (error) {
        res.status(500).json({message:error.message}); 
    }   
};

// Get a single Product

const getProduct = async(req, res)=>{
    try {
        const {id} = req.params;
       const [rows] = await pool.query("SELECT * FROM products WHERE id = 'id'");
            res.json(rows);
    } catch (error) {
        res.status(500).json({message:error.message}); 
    }
};
// Create New Product
const createProduct = async (req, res)=>{
    try {
        const { title, description, price,image } = req.body;
    //const imagePaths = req.files.map(file => file.path); // Get paths of uploaded files
    let image_filename = `${req.file.filename}`;
    const newModel = new Product({
      title,
      description,
      price,
      image:image_filename,
    });
    await newModel.save();
    res.status(201).json({ message: 'Images uploaded successfully', data: newModel });
        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

// Update a Product

const updatedProduct = async (req, res) => {
  try {
    // Get id from the request
    const { id } = req.params;

    // Find the item by ID
    const item = await Product.findById(id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    // Delete associated image file
    if (item.image) {
      const imagePath = path.join(__dirname, "../../upload", item.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err.message);
        }
      });
    }

    // Save detail on the database
    req.body = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: req.file.filename,
    };
    console.log(req.file.filename);
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Product

const deleteProduct = async (req, res)=>{
    try {
        // Get id from the request
     const {id} = req.params;

       // Find the item by ID
    const item = await Product.findById(id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    // Delete associated image file
    if (item.image) {
      const imagePath = path.join(__dirname, "../../upload", item.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }

     // Delete from the database
     const product = await Product.findByIdAndDelete(id);
     if(!product){
         return res.status(404).json({message: "Product not found"}); 
     }
     res.status(200).json(({message: "Product deleted successfully"}));
    } catch (error) {
     res.status(500).json({message:error.message}); 
    }
 };

 module.exports = {
    getProduct,
    getProducts,
    createProduct,
    updatedProduct,
    deleteProduct
 };