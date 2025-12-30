import {StreamChat} from "stream-chat"
import { StreamClient } from "@stream-io/node-sdk";
import {ENV} from "./env.js" 

const apiKey= ENV.STREAM_API_KEY
const apiSecret= ENV.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("❌ Stream API key or secret is not defined in environment variables")
}
export const chatClient= StreamChat.getInstance(apiKey, apiSecret)//for chat features
export const streamClient = new StreamClient(apiKey, apiSecret); // will be used for video calls

export const upsertStreamUser= async(userData)=>{
    try{
        await chatClient.upsertUser(userData)
        return userData
    }catch(error){  
        console.error("❌ Error upserting Stream user", error)
    }
}

export const deleteStreamUser= async(userId)=>{
    try{
        await chatClient.deleteUser(userId)
        return { success: true }
    }catch(error){  
        console.error("❌ Error deleting Stream user", error)
    }
}