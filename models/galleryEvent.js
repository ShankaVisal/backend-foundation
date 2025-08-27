import mongoose from "mongoose";

const galleryItem = mongoose.Schema(
    {
        id : {
            type : String,
            required: true,
            unique:true
        },
        title:{
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },

    }
)

const GalleryItem = mongoose.model('galleryItems', galleryItem);

export default GalleryItem;