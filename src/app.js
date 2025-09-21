const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
 const cookieParser = require('cookie-parser');
// const connectDB = require('./config/db')
const authRoutes = require("./routes/authRoute")
const categoryRoutes = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute.js');
const db = require('./config/database')
const qr = require('qrcode');
const axios = require('axios');


const app = express()
app.use(cookieParser());

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
// Calling the DB
// connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));
app.use("/api/auth",authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/products', productRoute);
//app.use("/images", express.static('uploads'))

// ALTER TABLE products ADD CONSTRAINT fk_products_category_id FOREIGN KEY (categoryId) REFERENCES category(id)
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/api/files",express.static(path.join(__dirname, "upload")));

// Routes
app.get('',(req,res)=>{
    res.send("Hello World")
})
// qr code started
app.get('/qrcode', async (req, res) => {
  const text = "http://localhost:5000/api/dealer";

  if (!text) {
    return res.status(400).send('Missing "text" query parameter');
  }

  try {
    const qrImage = await qr.toBuffer(text);

    res.setHeader('Content-Type', 'image/png');
    res.send(qrImage);
  } catch (err) {
    res.status(500).send('Error generating QR Code :'+err.message);
  }
});
// qr code ended

// flutter wave integration started
app.post('/api/pay', async (req, res) => {
  const { email, amount, name } = req.body;

  const payload = {
    tx_ref: `tx-${Date.now()}`,
    amount,
    currency: 'NGN',
    redirect_url: 'http://localhost:5000/payment-success',
    customer: {
      email,
      name,
    },
    customizations: {
      title: 'Payment for Awesome Product',
      description: 'Flutterwave Payment Integration',
    },
  };

  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      payload,
      {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      }
    );

    res.json({ link: response.data.data.link }); // Payment link to redirect to
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Payment initiation failed'+ error.message });
  }
});

// Optional: Verify transaction
app.get('/api/verify/:tx_ref', async (req, res) => {
  const txRef = req.params.tx_ref;

  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Verification failed' });
  }
});
// flutter wave integration ended

const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})