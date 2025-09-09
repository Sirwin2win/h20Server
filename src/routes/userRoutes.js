const express = require('express')

const {register, login}  = require("../controllers/authController")

const {
    registerUser,
    loginUser,
    getMe,
} = require('../controllers/usersController')

const { protect } = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/role')


const router = express.Router()

router.post('/',registerUser)
router.post('/login',loginUser)
router.get('/me', protect,authorizeRole("user"), getMe)
module.exports = router