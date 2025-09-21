const mongoose = require('mongoose')
const db = require('../config/database')
const Category = require("../models/categoriesModel")


// create a category
exports.createCategory = async(req,res)=>{
    const {name} = req.body
    if(!name) res.json({success:false, message:"Category name is required"})
    try {
       db.query('INSERT INTO category (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, name });
  });
    } catch (error) {
        res.status(400).jsoN({success:false, message:error.message})
    }
}
// get all categories
exports.getCategories = async(req,res) =>{
  try {
    db.query('SELECT * FROM category', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
  } catch (error) {
    res.status(404).json({message:error.message})
  }
}
// get single categories
exports.getSingleCategory = async(req,res)=>{
          db.query('SELECT * FROM category WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send({ message: 'Category not found' });
    res.send(results[0]);
  });
}
// update category by id
exports.updateCategory = async(req,res)=>{
      const { name } = req.body;
  db.query('UPDATE category SET name = ? WHERE id = ?', [name, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Category updated successfully!', result });
  });
}
// Delete category
exports.deleteCategory = async(req,res)=>{
      db.query('DELETE FROM category WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Category deleted successfully!'});
  });
}
// module.exports = {createCategory,getCategories}
// , getSingleCategory, updateCategory, deleteCategory