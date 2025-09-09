const mongoose = require('mongoose');



const ProductSchema = mongoose.Schema(
    {
        title : {
            type : String,
            required : [true, "please enter product title"]
        },
        description : {
            type : String,
            required : [true, "please enter product description"]
        },
        price : {
            type : Number,
            required : true,
            default : 0
        },
        image: { type: String }
        },
        {
            timestamps : true
        }
);
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;