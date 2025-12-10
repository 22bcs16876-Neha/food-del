import express from "express";
import { addFood,listFood,removeFood } from "../controllers/foodController.js"
import multer from "multer";

const foodRouter = express.Router() //using thius we can create get , post etc methods

// foodRouter.Post("/add",addFood)  //post is used to send data on server, data gets processed and a response is received
foodRouter.get("/list",listFood)
foodRouter.post("/remove", removeFood)
//Image Storage engine

const Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: Storage });
foodRouter.post("/add", upload.single("image"), addFood);



export default foodRouter; 