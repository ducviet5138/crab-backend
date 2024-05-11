import mongoose from "mongoose";

export const TRANSACTION_TYPES = [
    "DEPOSIT",
    "WITHDRAWAL",
    "PAYMENT",
    "REFUND",
    "REVERSAL",
    "BONUS",
    "PENALTY",
    "FEE",
    "OTHERS",
];

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
            enum: TRANSACTION_TYPES,
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

Schema.pre("save", function (next) {
    if (this.type === "WITHDRAWAL" || this.type === "FEE") {
        this.amount = -Math.abs(this.amount);
    }
    next();
});

export const Transaction = mongoose.model("Transaction", Schema, "transactions");
