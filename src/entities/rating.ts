import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        value: {
            type: Number,
        },
        comment: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        versionKey: false,
    }
);

export const Rating = mongoose.model("Rating", Schema, "ratings");
