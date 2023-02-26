import express from "express";
import {db} from "../db.js";
import jwt from "jsonwebtoken";
const router =express.Router()
router.post('/',(req,res)=>{
    const q="UPDATE users SET `collection`=? WHERE `id` = ?";
    const q2 = "SELECT * FROM users WHERE id = ?"

    db.query(q, [req.body.x,req.body.currentUser.id], (err, data) => {
        if (err) return res.status(500).json(err);
        db.query(q2,[req.query.id],(err,data)=>{
            const token=jwt.sign({id:data[0].id},"jwtkey")
            const {password,...other} =data[0] //过滤数据库密码c
            other.token=token
            // console.log(other)
            res.status(200).json(other)
        })
    });


})
router.get('/getcollection',(req,res)=>{
    const q="SELECT collection FROM users WHERE id=?"
    let collection=[]
    db.query(q, [req.query.id], (err, data) => {
        if (err) return res.status(500).json(err);
       collection=data[0].collection.split(',')
        res.json(collection)
    })

})
router.get('/getposts',(req,res)=>{
    const collection=req.query.collection.replace(/,/g, "|")

    const q1="SELECT p.id, `introduction`,`tags`,`username`, `title`, `desc`, p.img ,u.img AS userImg,`cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id regexp ? AND `draft`=0"
    db.query(q1,[collection],(err,data)=>{
        if(err) return res.status(500).json(err)
        res.json(data)
    })

})

export default router