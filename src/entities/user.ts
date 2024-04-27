import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "customer", "driver", "staff"],
            default: "customer",
        },
        avatar: {
            type: String,
        },
    },
    {
        versionKey: false,
    }
);

export const User = mongoose.model("User", Schema, "users");
