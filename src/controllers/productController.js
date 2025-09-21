const Product = require('../models/productModel.js');
const fs = require("fs");
const path = require("path");
const db = require('../config/database')



// Get all Products
exports.getProducts = async (req, res)=>{
try {
    db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
  } catch (error) {
    res.status(404).json({message:error.message})
  } 
};


// Get all Products
exports.getSixProducts = async (req, res)=>{
try {
    db.query('SELECT * FROM products ORDER BY ID DESC LIMIT 6', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
  } catch (error) {
    res.status(404).json({message:error.message})
  } 
};
// Get a single Product
exports.getProduct = async(req, res)=>{
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send({ message: 'Product not found' });
    res.send(results[0]);
  });
};
// Create New Product
exports.createProduct = async (req, res)=>{
        const { title, description, price ,categoryId} = req.body;
    //const imagePaths = req.files.map(file => file.path); // Get paths of uploaded files
    // let image_filename = `${req.file.filename}`;
    // const product = new Product({
    //   title,
    //   description,
    //   price,
    //   image:image_filename,
    // });
    let image=req.file.filename
   try {
       db.query('INSERT INTO products (title,description,price,image,categoryId) VALUES (?,?,?,?,?)', [title,description,price,image,categoryId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId,title,description,price,image,categoryId});
  });
    } catch (error) {
        res.status(400).json({success:false, message:error.message})
    }
};
// Update a Product
exports.updatedProduct = async (req, res) => {

    // Get id from the request
    const { id } = req.params;
    // Find the item by ID
 // Step 1: Get existing image path
  const getProductSql = 'SELECT image FROM products WHERE id = ?';

  db.query(getProductSql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const oldImage = results[0].image;
    // Step 2: Delete old image from disk if new one is uploaded
    if (oldImage) {
      const oldImagePath = path.join(__dirname, "../../upload", oldImage);
      // console.log(oldImagePath)
      fs.unlink(oldImagePath, err => {
        if (err) {
          res.send('Failed to delete old image (may not exist):', oldImagePath);
        } else {
          res.send('Deleted old image:', oldImagePath);
        }
      });
    }
})
  // });
    // Save detail on the database
  const {title, description,price, categoryId} = req.body
  let image=req.file.filename
      db.query('UPDATE products SET title = ?, description=?,price=?, image=?, categoryId=? WHERE id = ?', [title,description,price,image,categoryId, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Product updated successfully!', result });
  });
}

  
// Delete a Product
exports.deleteProduct = async (req, res)=>{
    const { id } = req.params;
    // Find the item by ID
 // Step 1: Get existing image path
  const getProductSql = 'SELECT image FROM products WHERE id = ?';
  db.query(getProductSql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const oldImage = results[0].image;
    // Step 2: Delete old image from disk if new one is uploaded
    if (oldImage) {
      const oldImagePath = path.join(__dirname, "../../upload", oldImage);
      console.log(oldImagePath)
      fs.unlink(oldImagePath, err => {
        if (err) {
          res.send('Failed to delete old image (may not exist):', oldImagePath);
        } else {
          res.send('Deleted old image:', oldImagePath);
        }
      });
    }
})
// Delete from the database
      db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Product deleted successfully!'});
  });
}
