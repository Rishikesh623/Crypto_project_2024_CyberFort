const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes.js');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(cookieParser());


app.listen(5000,(err)=>{
    if(err){
        console.log(err);
        return ;
    }
    console.log("Listening at port 5000");
});

//mongoDB connection established
mongoose.connect("mongodb://localhost:27017/QuizDB")
    .then(() => console.log("MonogDB connected .. ") )
    .catch((error) => console.log("Mongo connection failed !!! ",error.message));
