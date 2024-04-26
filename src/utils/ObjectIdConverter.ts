import mongoose from 'mongoose';

export default function objectIdConverter(id: string) {
    return new mongoose.Types.ObjectId(id);
}
