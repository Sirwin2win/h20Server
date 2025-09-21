const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')
const db = require('../config/database')


exports.register = async (req, res) =>{
   
          const  {name,email,phone,address,role} = req.body
   // Simple validation
    if (!name || !email  ||!phone || !address ||!role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Check if user already exists
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
  
        if (results.length > 0) {
          return res.status(409).json({ message: 'User already exists' });
        }
  
        // Hash password
        const password= await bcrypt.hash(req.body.password, 10);
     
        // Insert new user
        db.query(
          'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?,?,?,?)',
          [name, email, password, phone, address, role],
          (err, result) => {
            if (err) return res.status(500).json({ message: 'Error creating user' });
  
            res.status(201).json({ message: 'User registered successfully' });
          }
        );
      }
    );

};

exports.login = async(req, res)=>{
const {email,password} = req.body

    // Check user
     db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
       if (err) return res.status(500).json({ message: 'Database error' });
   
       if (results.length === 0) {
         return res.status(401).json({ message: 'Invalid email or password' });
       }
   
       const user = results[0];

         // Compare password
           const match = await bcrypt.compare(password, user.password);
           if (!match) {
             return res.status(401).json({ message: 'Invalid email or password' });
           }
    
    const token = jwt.sign({id:user._id, role:user.role, email:user.email},process.env.JWT_SECRET, {expiresIn:"1h"})
    res.cookie('token', token,{httpOnly:true,secure:false}).json({
        success:true,
        message:"Logged in successfully",
        email:user.email,
        role:user.role,
        id:user._d,
        token
    })
  })


};
// Route to initiate password reset
exports.resetMail = async(req, res) => {
  const { email } = req.body;
  // Check if the email exists in your user database
  const user = await User.findOne({email})
  if (user) {
    // Generate a reset token
    // const token = crypto.randomBytes(20).toString('hex');
    const token = Math.floor(Math.random()*1000000).toString()
    // Store the token with the user's email in a database or in-memory store
    // user.resetToken = token;
   await User.findByIdAndUpdate(user.id, {resetToken:token}, { new: true })
          .then(updatedItem => {
            res.json({success:true,message:"Check your email for a reset link"});
          })
          .catch(err => {
            res.status(500).send(err);
          });
    // Send the reset token to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:${process.env.PORT}/api/auth/reset-password/${token}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log(`Email sent: ${info.response}`);
        res.status(200).send('Check your email for instructions on resetting your password');
      }
    });
  } else {
    res.status(404).send('Email not found');
  }
}
// Route to handle the reset token
exports.handleToken = async(req, res) => {
  const { resetToken } = req.params;
  // Check if the token exists and is still valid
//   const resetToken = token
  const user = await User.findOne({resetToken})
  if (user) {
    // Render a form for the user to enter a new password
    res.send('<form method="post" action="/reset-password"><input type="password" name="password" required><input type="submit" value="Reset Password"></form>');
  } else {
    res.status(404).send(`Invalid or expired token ${token}`);
  }
}
exports.updatePassword = async(req, res) => {
  const { resetToken, password } = req.body;
  // Find the user with the given token and update their password
  const user = User.find({resetToken});
  if (user) {
    //user.password = password;
    //delete user.resetToken; // Remove the reset token after the password is updated
       await User.findByIdAndUpdate(user.id, {password:password}, { new: true })
         
    res.status(200).send('Password updated successfully');
  } else {
    res.status(404).send('Invalid or expired token');
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
// module.exports = {register,login}