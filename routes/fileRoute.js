import express from "express";
import { downloadFile, upload, uploadFile } from "../controllers/fileController.js";

const fileRouter = express.Router();

// Single file upload
// 'file' should match the field name in the form-data
fileRouter.post('/upload', upload.single('file'), uploadFile);

fileRouter.get('/download/:filename', downloadFile);

export default fileRouter;