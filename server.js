const express = require("express")
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose")
const Questions = require('./models/questions.js')
const Answers = require('./models/answers.js');
const Users = require('./models/users.js');


//Here we would like to request data from another collection, in our Questions Schema we made a reference,
//suggesting that although we only store the _id in our answers array, when we are requesting data from our database
//we would like to also get the referenced data from the referenced collection.
//Do do this we will use the populate method. In this first example we would like to get all the data from the referenced record of the referenced collection.
//To achive this, we must pass the name of the property in our collection that holds this reference and has it's _id as it's value. Which in this case is the answer property.
app.get('/api/getQuestions', async (req,res) =>{
    try {
        const data = await Questions.find({userName: {$ne: "Tesztt Elek"}}).populate({path:"answer",select:["answeringText"]})
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})


//This second example is very similar to the first one, but what if we have bigger and more complex records, and don't want to get all of the proprties
//but only a selected few. In this case we will use the populate method again, but we will pass a different argument.
//We will pass an object which has two values. The path references the property that holds the reference to the other collection and has it's _id as it's value.
//The second value will be an array, which includes all the properties from the other collection we would like to get.
app.get('/api/getAnswers', async (req,res) =>{
    try {
        const data = await Answers.find().populate({path:"answer",select:["answeringText"]})
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get('/api/getQuestion', async (req,res) =>{
    try {
        const data = await Questions.findOne({"_id":"63c91fa581b8e207b05447cb"})
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.post('/api/postQuestion', (req,res) => {
    let newQuestion = new Questions()

    newQuestion.userName = "Teszt Elek"
    newQuestion.title = "testTitle"
    newQuestion.question = "testQuestion"

    newQuestion.save().then(()=>{
        res.status(200).json({"message":"Question added."})
    }).catch(() => {
        res.status(500).json({"message":"Error"})
    })
})

app.post('/api/editQuestion/:_id', (req,res) => {
    const body = req.body

    Questions.findOne({"_id":req.params._id}).then((data) => {

        data.userName = body.newUserName
        data.save().then(() => {
            res.status(200).json({"message":"Quetion edited."})
        })

    }).catch((error) => {
        res.status(500).json(error)
    })
})

app.post('/api/deleteQuestion/:_id', (req,res) => {
    
    try {
        Questions.findOneAndDelete({"_id":req.params._id}).then(() => {
            res.status(200).json({"message":"Delete was successful"})
        })
    } catch (error) {
        res.status(500).json({"message":error})
    }
})

app.post('/api/addToAnswers/:_id', (req,res) => {
        const body = req.body
        console.log(body);
        Questions.findOne({"_id":req.params._id}).then((resp)=>{
            let newAnswer = new Answers(body)
            newAnswer.save()
            resp.answer = [...resp.answer, newAnswer._id]
            resp.save().then(() => {res.status(200).json({"message":"Answer added."})})
            
        }).catch((err) =>{
            res.status(500).json({"message":error})
        })
})


mongoose.connect("mongodb://localhost:27017/test").then(()=>{
    console.log("Connection successful.");
    app.listen(3000)
}).catch((err)=>{
    console.log(err);
})
