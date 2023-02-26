import express from "express";
import multer from "multer";
import {db} from "../db.js";
import {httpInfo} from "../https.js";
import jwt from "jsonwebtoken";
const router =express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./avatar");
    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + file.originalname);
    },
});

const upload2 = multer({ storage });

router.post("/", upload2.single("file"), function (req, res) {
    const q1="UPDATE users SET `img`=? WHERE `id` = ?"
    const q2 = "SELECT * FROM users WHERE id = ?"
    db.query(q1,[httpInfo+`/avatar/`+req.file.filename,req.query.id],(err,data)=>{
        if(err) return res.status(500).json(err)
        db.query(q2,[req.query.id],(err,data)=>{
            if(err) return res.status(500).json(err)
            const token=jwt.sign({id:data[0].id},"jwtkey")
            const {password,...other} =data[0] //过滤数据库密码c
            other.token=token
            // console.log(other)
            res.status(200).json(other)
        })
    })
    // console.log(req.file.filename)
});
export default router