import mongoose from "mongoose";

const schema = new mongoose.Schema({
    group: String,
    leader: {
        type: String,
        default: undefined
    },
    updateDate: Date,
    days: [
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
                    percent: String,
                    flow: Boolean
                }
            ]
        }
    ]
}, { collection: "schedule" });

export default mongoose.model("schedule", schema);