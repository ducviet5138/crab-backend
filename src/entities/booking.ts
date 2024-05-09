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
            enum: ["pending", "accepted", "arrived-at-pick-up", "pick-up","canceled", "completed"],
            default: "pending",
        },
        vehicle: {
            type: String,
            enum: ["car", "motorbike"],
        },
        service: {
            type: String,
            enum: ["Car Economy", "Car", "Bike Economy", "Bike"],
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

Schema.pre("find", function () {
    this.populate("info").populate("driver").populate("orderedBy");
});

Schema.pre("findOne", function () {
    this.populate("info").populate("driver").populate("orderedBy");
});

export const Booking = mongoose.model("Booking", Schema, "bookings");
