import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        },
        token: {
            type: String,
        }
    },
    {
        versionKey: false,
    }
);

export const NotificationToken = mongoose.model("NotificationToken", Schema, "notification_tokens");
