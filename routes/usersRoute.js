import express from "express";
import { deleteUser, getUser, loginUser, postUser, updateUser, refresh} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/', getUser);

userRouter.post('/',postUser);

userRouter.put('/',updateUser);

userRouter.delete('/',deleteUser)

userRouter.post('/login',loginUser)

userRouter.post('/refresh',refresh)

export default userRouter;