import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        ref: {
            type: String,
            required: true,
        },
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet",
            required: true,
        },
        type: {
            type: String,
            enum: ["DEPOSIT", "WITHDRAWAL", "PAYMENT"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const Transaction = mongoose.model("Transaction", Schema, "transactions");
