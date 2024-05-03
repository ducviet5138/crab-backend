import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        number: {
            type: String,
        },
        exp: {
            type: String,
        },
        cvv: {
            type: String,
        },
        name: {
            type: String,
        },
    },
    {
        versionKey: false,
    }
);

export const PaymentMethod = mongoose.model("PaymentMethod", Schema, "payment_methods");
