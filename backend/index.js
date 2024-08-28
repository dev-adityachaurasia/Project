import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
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

app.listen(PORT,()=>{
    connectDB();
    console.log("Started");
})
