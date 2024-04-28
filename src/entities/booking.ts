import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        info: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BookingInfo",
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        orderedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "canceled", "completed"],
            default: "pending",
        },
        vehicle: {
            type: String,
            enum: ["car", "motorbike"],
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const Booking = mongoose.model("Booking", Schema, "bookings");
