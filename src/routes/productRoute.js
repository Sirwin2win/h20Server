const express = require('express');
const router = express.Router();
const fs = require('fs')
const {
    getProducts,
    getSixProducts,
    getProduct,
    createProduct,
    updatedProduct,
    deleteProduct
}= require('../controllers/productController.js');
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({
    destination: "upload",
    filename:(req, file, cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
});
const upload = multer({ storage: storage });
router.get('/', getProducts);
router.get('/six', getProducts);
router.get('/:id', getProduct);
router.post('/',upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updatedProduct);
router.delete('/:id', deleteProduct);
module.exports = router;