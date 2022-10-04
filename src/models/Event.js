import mongoose from "mongoose";

const schema = new mongoose.Schema({
    groups: [String],
    kurses: [String],
    inst_ids: [String],
    name: String,
    date: Date,
    evTime: String,
    note: {
        type: String,
        default: null
    }
}, { collection: "events" });

export default mongoose.model("events", schema);