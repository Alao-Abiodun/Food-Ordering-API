import mongoose from "mongoose";
import { MONGO_URI } from '../configs';

export default async() => {

   try {
    mongoose.connect(String(MONGO_URI)).then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.log(err);
    })

   } catch (error) {
    console.log(error);
    process.exit(1);    
   }
}