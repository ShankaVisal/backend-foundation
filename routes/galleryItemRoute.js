import express from "express";
import { getGalleryItems, createGalleryItem } from "../controllers/galleryItemController.js";
import GalleryItem from "../models/galleryEvent.js";

const galleryItem = express.Router();

galleryItem.get('/', getGalleryItems);

galleryItem.post('/', createGalleryItem);

export default galleryItem;