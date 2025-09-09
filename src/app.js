const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
 const cookieParser = require('cookie-parser');
const connectDB = require('./config/db')
const authRoutes = require("./routes/authRoute")
const categoryRoutes = require('./controllers/categoryControllers')
const productRoute = require('./routes/productRoute.js');


const app = express()
app.use(cookieParser());


// Calling the DB
connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));
app.use("/api/auth",authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/products', productRoute);
//app.use("/images", express.static('uploads'))


// app.use(express.static(path.join(__dirname, "public")));
// app.use("/api/files",express.static(path.join(__dirname, "upload")));

// Routes
app.get('',(req,res)=>{
    res.send("Hello World")
})
const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})