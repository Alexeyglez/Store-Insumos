import "dotenv/config";
import "express-async-errors";
import express from "express";
const app = express();

//other modules
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";

//connectdb
import connectdb from "./db/connectdb.js";

//middlewares
import errorHandlerMiddleware from "./middlewares/error-handler.js";
import notFoundMiddleware from "./middlewares/not-found.js";

//routes
import authRouter from "./routes/authRoute.js";
import farmerRouter from "./routes/farmerRoute.js";
import insumoRouter from "./routes/insumoRoute.js";
import orderRouter from "./routes/orderRoute.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/farmers", farmerRouter);
app.use("/api/v1/insumos", insumoRouter);
app.use("/api/v1/orders", orderRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectdb(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server listene on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
