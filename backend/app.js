import express from "express";
import dotenv from "dotenv";
import path from "path";
import productRoutes from "./src/product/routes/product.routes.js";
import {
  errorHandlerMiddleware,
  handleUncaughtError,
} from "./middlewares/errorHandlerMiddleware.js";
import userRoutes from "./src/user/routes/user.routes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./src/order/routes/order.routes.js";
import activateroutes from "./src/activate/routes/activate.route.js";
import Router from "./src/cart/routes/cartItems.routes.js";
const configPath = path.resolve("backend", "config", "uat.env");
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from  './docs/swagger.json'  assert { type: 'json' };
dotenv.config({ path: configPath });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// configure routes
app.use("/api/storefleet/product", productRoutes);
app.use("/api/storefleet/user", userRoutes);
app.use("/api/storefleet/order", orderRoutes);
app.use("/api/storefleet/cart", Router);

app.use("/activationLink",activateroutes)
// errorHandlerMiddleware
app.use(errorHandlerMiddleware);

export default app;
