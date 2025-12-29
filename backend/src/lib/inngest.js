import { Inngest } from 'inngest';
import { connectDB } from './db.js';
import User from '../models/User.js';

export const inngest = new Inngest({ id: "Interveasy" });


const syncUser=inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async({event})=>{
        await connectDB()
        const{id,email_addresses,first_name,last_name,profile_image_url}=event.data
        const newUser={
            clerkid:id,
            email:email_addresses[0]?.email_address,
            name:`${first_name || ""} ${last_name || ""}`,
            profileImage:profile_image_url || ""
        }
        await User.create(newUser);

        //todo something
    }
);

const deleteUserFromDB=inngest.createFunction(
    {id:"delete-user-from-db"},
    {event:"clerk/user.deleted"},
    async({event})=>{
        await connectDB()
        await User.deleteOne({clerkid:id});

        //doing something else
    }
);

export const functions = [syncUser,deleteUserFromDB];