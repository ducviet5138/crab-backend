import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["cash", "credit"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        versionKey: false,
    }
);

export const Wallet = mongoose.model("Wallet", Schema, "wallets");
