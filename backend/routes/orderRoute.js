import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder, userOrders, getAllOrders,updateOrderStatus,
  deleteOrder,payForOrder} from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.put("/pay/:id", authMiddleware, payForOrder);
orderRouter.get("/all", getAllOrders);
orderRouter.put("/update/:id", authMiddleware, updateOrderStatus);
orderRouter.delete("/delete/:id", deleteOrder);


export default orderRouter;