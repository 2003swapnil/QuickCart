import { Inngest } from "inngest";
import connectDB from "./db";
import user from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// inngest function to save user data to database

export const syncUserCreation = inngest.createfunction(
    {
        id:'sync-user-from-clerk'
    },
    { event: 'clerk/user.created' },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            name: first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url,
        };
        await connectDB();
        await user.create(userData)
    }

)
// inngest function to update user data in database

export const syncUserUpdate = inngest.createfunction(
    {
        id: 'user-update-from-clerk'
    },
    { event: 'clerk/user.updated' },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            name: first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url,
        };
        await connectDB();
        await user.updateOne({ _id: id }, { $set: userData });
    }
);
// inngest function to delete user data from database
export const syncUserDeletion = inngest.createfunction(
    {
        id: 'user-deletion-from-clerk'
    },
    { event: 'clerk/user.deleted' },

    async ({ event }) => {
        const { id } = event.data;
        await connectDB();
        await user.deleteOne({ _id: id });
    }
);
