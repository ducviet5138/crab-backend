import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Point"],
        default: "Point",
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});

const Schema = new mongoose.Schema(
    {
        address: {
            type: String,
        },
        location: {
            type: pointSchema,
            index: "2dsphere",
        },
    },
    {
        versionKey: false,
    }
);

export const LocationRecord = mongoose.model("LocationRecord", Schema, "location_records");
