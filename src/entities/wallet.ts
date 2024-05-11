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
        // amount: {
        //     type: Number,
        //     required: true,
        //     default: 0,
        // },
    },
    {
        versionKey: false,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

Schema.virtual("transactions", {
    ref: "Transaction",
    localField: "_id",
    foreignField: "wallet",
    justOne: false,
});

Schema.virtual("balance").get(function (this: any) {
    return this.transactions.reduce((acc: number, cur: any) => acc + cur.amount, 0);
});

export const Wallet = mongoose.model("Wallet", Schema, "wallets");
