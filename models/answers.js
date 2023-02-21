const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    
            answeringUserName: {
                type: String
            },
            answeringText: {
                type: String
            }
        
})

module.exports = mongoose.model('Answers', answerSchema, "answers")