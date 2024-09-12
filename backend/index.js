import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import messageRouter from "./routes/message.routes.js";
import adminRouter from "./routes/admin.routes.js"

dotenv.config({})
const app = express();
const PORT = process.env.PORT || 3000

const corsOption ={
    origin: "http://localhost:5173",
    credentials:true
}

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
app.use(cors(corsOption))

app.use('/',userRouter)
app.use('/',postRouter)
app.use('/',messageRouter)
app.use('/',adminRouter)

app.listen(PORT,()=>{
    connectDB();
    console.log("Started");
})
