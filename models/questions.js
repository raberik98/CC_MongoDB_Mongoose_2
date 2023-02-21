const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const questionsSchema = new Schema({
    userName:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answers",
            default: []
        }
    ]
})

module.exports = mongoose.model('Qustions', questionsSchema, "questions")