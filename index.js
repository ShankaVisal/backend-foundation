import bodyParser from 'body-parser';
import express from 'express';
import userRouter from './routes/usersRoute.js';
import mongoose from 'mongoose';
import galleryItem from './routes/galleryItemRoute.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from "url";
import path, { dirname } from "path";


dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(cookieParser());

const connectionString = process.env.mongoDB_URL;

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

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads")); // make sure 'uploads' exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
    });
});


app.get('/download/:filename', (req,res) => {
    const filename = req.params.filename;
    const filepath = '/uploads/' + filename;
    res.download(filepath, (err) => {
        if(err){
            res.status(500).json({
                message: "File download failed",
                error: err.message
            })
        }
    })
})