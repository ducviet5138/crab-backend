import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        plate: {
            type: String,
        },
        type: {
            type: String,
            enum: ["car", "motorbike"],
            default: "motorbike",
        },
        description: {
            type: String,
        },
    },
    {
        versionKey: false,
    }
);

export const Vehicle = mongoose.model("Vehicle", Schema, "vehicles");
