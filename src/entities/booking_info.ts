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
        fare: {
            type: Number,
        }
    },
    {
        versionKey: false,
    }
);

export const BookingInfo = mongoose.model("BookingInfo", Schema, "booking_infos");
