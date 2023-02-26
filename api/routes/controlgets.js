import express from "express";
import {db} from "../db.js";
const router =express.Router()
router.get('/',(req,res)=>{
    const q1="SELECT p.id, `introduction`,`tags`,`username`, `title`, `desc`, p.img ,u.img AS userImg,`cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE u.id= ? AND `draft`=?"
    // console.log(req.query.id)
    db.query(q1,[req.query.id,req.query.draft],(err,data)=>{
        if (err) return res.status(500).send(err)
        return res.status(200).json(data)
    })
})

export default router