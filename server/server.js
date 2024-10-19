const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes.js');
const quizRoutes = require('./routes/quizRoutes.js');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // allow requests only from this origin
    credentials: true,               // allow cookies and credentials
})); 
app.use(express.json());
app.use(userRoutes);
app.use(quizRoutes);
app.use(cookieParser());


app.listen(process.env.PORT,(err)=>{
    if(err){
        console.log(err);
        return ;
    }
    console.log(`Listening at port ${process.env.PORT}`);
});

//mongoDB connection established
mongoose.connect("mongodb://localhost:27017/QuizDB")
    .then(() => console.log("MonogDB connected .. ") )
    .catch((error) => console.log("Mongo connection failed !!! ",error.message));
