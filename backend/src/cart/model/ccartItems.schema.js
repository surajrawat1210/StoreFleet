
import mongoose, { Schema } from "mongoose";

 const cartSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    quantity: Number
})
const  cartModel=   mongoose.model("cart",cartSchema);
export default cartModel;