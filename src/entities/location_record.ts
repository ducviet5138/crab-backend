import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        address: {
            type: String,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                lat: {
                    type: Number,
                },
                long: {
                    type: Number,
                },
            },
        },
    },
    {
        versionKey: false,
    }
);

export const LocationRecord = mongoose.model("LocationRecord", Schema, "location_records");
