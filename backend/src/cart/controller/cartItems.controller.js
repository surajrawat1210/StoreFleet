import { addToCartRepo, deleteFromRepo, getcartfromRepos } from '../model/cartItems.repository.js';


  export const addToCart = async(req, res) =>{
    try{
      const { productId, quantity } = req.body;
      const userId = req.user._id;
      var cart = await addToCartRepo(productId, userId, quantity);
      res.status(201).send('Cart is updated');
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
      }
    }

  export const getCartItems =async(req, res) =>{
      try{
      const userID = req.userID;
      var cartItems = await getcartfromRepos(userID);
      return res.status(200).send(items);
    }catch(err){
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  export const deletecartItem = async(req, res)=> {
    const userId = req.userID;
    const cartItemId = req.params.id;
    const isDeleted = await deleteFromRepo(
      userId,
      cartItemId
    );
    if (!isDeleted) {
      return res.status(404).send("Item not found");
    }
    return res
      .status(200)
      .send('Cart Item is removed');
  }

