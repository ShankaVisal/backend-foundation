import { set } from 'mongoose';
import User from '../models/user.js';
import jwt, { decode } from 'jsonwebtoken';

export function getUser(req, res){
    User.find().then(
        (userList)=>{
            res.json({
                message : userList
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

export function postUser(req,res){
    const user = req.body;
    const newUser = new User(user);
    newUser.save().then(
        ()=>{
            res.json({
                message: "User created successfully",
            })
        }
    ).catch(
        (err)=>{
            res.json({
                message:err.message,
                
            })
        }
    )

}

export function updateUser(req, res){
    const email = req.body.email;
    const name = req.body.name
    User.updateOne({email:email},
        {$set: {name:name}}
    ).then(
        ()=>{
            res.json({
                message: "User updated successfully",
            })
        }
    ).catch(
        (err)=>{
            res.json({
                message: err.message,
            })
        }
    )
}

export function deleteUser(req,res){
    const email = req.body.email;
    User.deleteOne({email:email}).then(
        ()=>{
            res.json({
                message: "User deleted successfully",
            })
        }
    )
}

export function loginUser(req,res){
    const item = req.body;
    User.findOne({email:item.email}).then(
        (user)=>{
            if(user){

                const payload = {
                    email:user.email,
                    name:user.name,
                    role:user.role
                }

                // Access Token (short-lived)
                const token = jwt.sign(payload,"This-is-my-secrete-key",{expiresIn:"1m"});

                // Refresh Token (long-lived)
                const refreshToken = jwt.sign(payload, "This-is-my-refresh-secrete-key", {expiresIn:"30m"});

                // You should save refreshToken in DB or Redis for production
                // For demo, sending back directly

                res.cookie('refreshToken', refreshToken,{
                    httpOnly:true, // accessible only by web server
                    secure:false, // set to true if using https
                    sameSite:'strict' 
                })

                res.json({
                    message: "Login successful",
                    user: user,
                    token: token
                })
            } else{
                res.json({
                    message: "Invalid email or password"
                })
            }
        }
    )
}

export function refresh (req,ref){
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if(!refreshToken) {
        return res.status(401).json({
            message: "InvalidRefresh Token"
        });
    }

    jwt.verify(refreshToken, "This-is-my-refresh-secrete-key", (err, decoded) => {
        if(err){
            return res.status(403).json({
                message: "Invalid Refresh Token"
            });
        }
        
        const payload = {
            email:decoded.email,
            name:decoded.name,
            role:decoded.role
        };

        const newAccessToken = jwt.sign(payload, "This-is-my-refresh-secrete-key", {expiresIn: "15m"});

        res.json({
            message:"Token refreshed successfully",
            token: newAccessToken
        });

    });
}