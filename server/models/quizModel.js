const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    _id : {
        type:Number,
        required: true
    },
    question: { 
        type: String, 
        required: true 
    },
    options: [{ 
        type: String,  
    }],
    correct_option: { 
        type: String, 
        required: true 
    },
    
});

const quizSchema = new mongoose.Schema({
    _id : {
        type:String,
        required: true
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String ,
        required: true
    },
    questions: {
        type: String,
        required: true
    },
    created_by: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    start_time:{
        type: Date,
        required:true
    },
    end_time:{
        type: Date,
        required:true
    }
    ,
    participants: [{ type: String, ref: 'User', default: [] }]
},
{
    timestamps: true
}
);

quizModel = mongoose.model("Quiz", quizSchema);
module.exports = quizModel;