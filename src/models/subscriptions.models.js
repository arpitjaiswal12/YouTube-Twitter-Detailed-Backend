import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({   /// subscription schema kya hold karega ?? :: konsa channel to subscribe kra hai aur kes-user na kra hai 
    subscriber:{
        type:Schema.Types.ObjectId, // one user who subscribing
        ref:"User"
    },
    channel: { // aur channel bhe kya ek user he hai -- user bhe kya channel he hai 
        type:Schema.Types.ObjectId, //one to whom 'subscriber' is subscribing
        ref:"User"
    }

},{timestamps:true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema);
