const express = require('express')
const { createCategory, getCategories, getSingleCategory,updateCategory, deleteCategory } = require('../controllers/categoryControllers')
const {protect} = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/role')

const router = express.Router()


router.post('/',createCategory)
router.get('/',getCategories)
router.get('/:id',getSingleCategory)
router.put('/:id',updateCategory)
router.delete('/:id',deleteCategory)
// router.post('/',protect,authorizeRole("admin"),createCategory)


module.exports = router