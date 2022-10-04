import mongoose from "mongoose";

const schema = new mongoose.Schema({
    groups: [String],
    name: String,
    date: Date,
    evTime: String,
    note: {
        type: String,
        default: null
    }
}, { collection: "events" });

export default mongoose.model("events", schema);