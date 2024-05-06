import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        ref: {
            type: String,
        },

    },
    {
        versionKey: false,
    }
);

export const Transaction = mongoose.model("Transaction", Schema, "transactions");
