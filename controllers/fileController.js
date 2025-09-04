import multer from 'multer';
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url); // this fileURLTOPath is used to get the regular current file path from import.meta.url
const __dirname = dirname(__filename); // this dirname is used to get the directory part of a file path (everything before the filename).

console.log(import.meta.url);
console.log(__filename);
console.log(__dirname);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads")); // make sure 'uploads' file exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)); 
    }
});

export const upload = multer({ storage });

export function uploadFile(req, res) {
    if(!req.file){
        return res.status(400).json({
            message: "No file uploaded"
        })
    }

    res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
    });

}

export function downloadFile(req, res){
    const filename = req.params.filename;
    const filepath = path.join(__dirname, "../uploads", filename);
    res.download(filepath, (err) => {
        if(err){
            res.status(500).json({
                message: "File download failed",
                error: err.message
            })
        }   
    })
}


