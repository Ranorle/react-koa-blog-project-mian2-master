import fs from 'fs'
import express from "express";
import multer from "multer";
const router =express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./img2");
    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + file.originalname);
    },
});

const upload2 = multer({ storage });

router.post("/", upload2.single("file"), function (req, res) {
    const file = req.file;
    let x
    if(file) x=file.filename
    if(!file) x='no files'
    console.log(req.file)
    res.status(200).json(x);
});
export default router