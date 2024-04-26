import mongoose from 'mongoose';

const BucketSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
        },
    },
    {
        versionKey: false,
    }
);

export const Bucket = mongoose.model('Bucket', BucketSchema, 'buckets');
