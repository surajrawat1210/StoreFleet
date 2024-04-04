import { ObjectId } from "mongodb";
import cartModel from "./ccartItems.schema.js";
 
   export  const addToCartRepo= async (productId, userId, quantity)=>{
            console.log(productId);
            console.log(userId);
            console.log(quantity);
            var cartItem =  new cartModel({productId,userId,quantity});
            await cartItem.save();
    }

    export  const getcartfromRepos= async(userID)=>{
        try{
            const db = getDB();
            const collection = db.collection(this.collection)
            return await collection.find({userID:new ObjectId(userID)}).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }

    export  const  deleteFromRepo =async(userID, cartItemID)=>{
        try{
            const db = getDB();
            const collection = db.collection(this.collection)
            const result = await collection.deleteOne({_id: new ObjectId(cartItemID), userID: new ObjectId(userID)});
            return result.deletedCount>0;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }

    // export  const getNextCounter = async(db){

    //     const resultDocument = await db.collection("counters").findOneAndUpdate(
    //         {_id:'cartItemId'},
    //         {$inc:{value: 1}},
    //         {returnDocument:'after'}
    //     )  
    //     console.log(resultDocument);
    //     return resultDocument.value.value;
    // }
