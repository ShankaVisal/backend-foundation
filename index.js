import bodyParser from 'body-parser';
import express from 'express';
import userRouter from './routes/usersRoute.js';
import mongoose from 'mongoose';
import galleryItem from './routes/galleryItemRoute.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(bodyParser.json());

app.use(cookieParser());

const connectionString = "mongodb+srv://shankavisal:shankavisal@cluster0.jgxuh9e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


app.use((req,res, next)=>{
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if(token != null){
        jwt.verify(token,"This-is-my-secrete-key", 
            (err, decode) => {
                if(err){
                    res.status(401).json({
                        message: "Unauthorized Access",
                        error:err.message
                    })
                }
                if(decode != null){
                    req.body.user = decode;
                    next();
                    console.log(decode);
                }
                else{
                    next();
                }
            }
        )
    }
    else{
        next()
    }
})


mongoose.connect(connectionString).then(
    ()=>{
        console.log("connected to the database successfully");
    }
).catch(
    (err)=>{
        console.log("Error connecting to the database: ", err);
    }
)

app.use('/api/users/', userRouter);
app.use('/api/gallery/', galleryItem);

app.post('/', (req,res)=>{
    const name = req.body.name;
    const message = 'Hello'+' ' + name
    res.status(200).json({
        message: message
    })
})



app.listen(3000,(req,res) => {
    console.log('server is running on port 3000');
})