import GalleryItem from "../models/galleryEvent.js";

export function getGalleryItems(req,res){
    GalleryItem.find().then(
        (itemlist)=>{
            res.json({
                message:itemlist
            })
        }
    ).catch(
        (err)=>{
            res.json({
                message:err
            })
        }
    )
}

export function createGalleryItem (req, res){
const user = req.body.user;

    if(user==null){
        res.json({
            message: "Pleaser login to the system"
        })
        return
    } 

    if(user.role != "admin"){
        res.json({
            message: "You are not authorized to create gallery items",
            message:user
        })
        return
    }
        
        
    

    const item = req.body.item;
    const newGalleyItem = new GalleryItem(item);
    newGalleyItem.save().then(
        (result)=>{
            res.json({
                message: "Gallery item created successfully",
                item: result
            })
        }
    ).catch(
        (err)=>{
            res.json({
                message:err.message
            });
        }
    )

}