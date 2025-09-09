const mongoose =  require('mongoose')

/**
 * User Schema
 */


const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "name not provided "],
    },
    email: {
      type: String,
      required: [true, "please add an email"],
      unique: true,
      
    },
    phone: {
      type: Number,
      required: [true, "please add a phone number"],
    },
    password: {
      type: String,
      required: [true, 'please add a password']
    },
 role: { 
  type: String, 
  enum: ["user", "admin"], 
  default: "user" },
  resetToken:{
    type:String,
  }
  },
  {
    timestamps:true,
  }
);

  
const user = mongoose.model("User", userSchema)
module.exports = user
// const userModel = mongoose.models.user || mongoose.model("user", userSchema )
// module.exports = userModel
// module.exports = mongoose.model("User", userSchema);