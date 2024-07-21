import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import {exec} from "child_process"
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
    }
})

const uploads = multer({
    storage: storage
});

app.post("/upload",uploads.single("file"), (req, res) => {
    const lessonId=uuidv4();
    const videoPath = req.file.path;
    const outputPath=`./uploads/courses/${ lessonId }`;
    const hlsPath = `${outputPath}/index.m3u8`;
    console.log({hlsPath});
    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath,{recursive: true});
    }
    //ffmpeg
    
    res.json({
        message: "File uploaded successfully",
    });
});



app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, X-Requested-By, Content-Type, Accept, Authorization"
    )
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.json({
        message: "Hello World",
    });
})

app.listen(3000, (req, res) => {
    console.log("Server is running on port 3000");
})