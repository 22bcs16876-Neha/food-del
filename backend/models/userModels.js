 import mongoose from "mongoose";

 const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    cartData:{type:Object,default:{}}
 },{minimize:false})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
 export default userModel;