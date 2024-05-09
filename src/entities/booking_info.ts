import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        pickup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LocationRecord",
        },
        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LocationRecord",
        },
        phone: {
            type: String,
        },
        name: {
            type: String,
        },
        distance: {
            type: Number,
        },
        fee: {
            type: Number,
        },
        transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
        },
        customer_rating: {
            type: mongoose.Schema.Types.ObjectId,
        },
        driver_rating: {
            type: mongoose.Schema.Types.ObjectId,
        },
        payment_method: {
            type: String,
            enum: ["cash", "card"],
            default: "cash",
        },
    },
    {
        versionKey: false,
    }
);

Schema.pre("find", function () {
    this.populate("pickup").populate("destination");
});

Schema.pre("findOne", function () {
    this.populate("pickup").populate("destination");
});

export const BookingInfo = mongoose.model("BookingInfo", Schema, "booking_infos");
