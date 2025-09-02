import express from "express";
import { upload, uploadFile } from "../controllers/fileController.js";

const fileRouter = express.Router();

fileRouter.post('/upload',upload, uploadFile);

export default fileRouter;