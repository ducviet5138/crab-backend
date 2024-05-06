import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        ref: {
            type: String,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const Transaction = mongoose.model("Transaction", Schema, "transactions");
