import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        fileName: {
            type: String,
        },
    },
    {
        versionKey: false,
    }
);

export const Bucket = mongoose.model("Bucket", Schema, "buckets");
