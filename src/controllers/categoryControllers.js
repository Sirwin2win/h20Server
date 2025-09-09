const mongoose = require('mongoose')

const Category = require("../models/categoriesModel")


// create a category
const createCategory = async(req,res)=>{
    const {name} = req.body
    if(!name) res.json({success:false, message:"Category name is required"})

  
    try {
          const category = new Category({
        name:req.body.name
    })
        await  category.save()
        res.json({success:true, message:"Category create successfully"})
    } catch (error) {
        res.status(400).jsoN({success:false, message:error.message})
    }

  
  
}

module.exports = createCategory