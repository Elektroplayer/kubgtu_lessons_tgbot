import mongoose from "mongoose";

const schema = new mongoose.Schema({
    group: String,
    updateDate: Date,
    data: [
        {
            daynum: Number,
            even: Boolean,
            schedule: [
                {
                    number: Number,
                    time: String,
                    name: String,
                    paraType: String,
                    teacher: String,
                    auditory: String,
                    remark: String,
                    percent: String
                }
            ]
        }
    ]
}, { collection: "schedule" });

export default mongoose.model("schedule", schema);