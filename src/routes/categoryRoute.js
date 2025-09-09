const express = require('express')
const { createCategory } = require('../controllers/categoryControllers')
const {protect} = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/role')

const router = express.Router()


router.post('/',protect,authorizeRole("admin"),createCategory)


module.exports = router