const express = require('express')
const {register,login, resetMail, handleToken, updatePassword} = require('../controllers/authController')


const router = express.Router();


router.post("/register",register);
router.post("/login",login);
router.post('/forgot-password',resetMail);
router.get('/reset-password/:token',handleToken);
router.put('/reset-password',updatePassword);


module.exports = router