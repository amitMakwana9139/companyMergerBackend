import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let local_url = process.env.LOCAL_URL as string;
mongoose.connect(local_url).then(() => {
    console.log('Connection succesfull!');
}).catch((error) => {
    console.log("not connect", error);
}) 