import mongoose from "mongoose";

export default async function databaseInitialize() {
    const uri = "mongodb+srv://ngwx:1@csc13008.kl92ifp.mongodb.net/?retryWrites=true&w=majority&appName=CSC13008";
    console.log("[Database] Connecting to database...");
    try {
        await mongoose.connect(uri);
        console.log("[Database] Database has been initialized!");
    } catch (err: any) {
        console.error("[Database] Error: ", err);
    }
}
