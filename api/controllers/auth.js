import {db} from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "fs";
export const register=(req,res)=>{
//check existing user
    const q ="SELECT * FROM users WHERE email = ? OR username = ?"
    db.query(q,[req.body.email,req.body.name],(err,data)=>{
        if(err) return res.json(err)
        if(data.length) return res.status(409).json("与用户已经存在!")
        //哈希加密密码
        const salt=bcrypt.genSaltSync(10)
        const hash=bcrypt.hashSync(req.body.password,salt);

        const q="INSERT INTO users(`username`,`email`,`password`,`collection`) VALUES (?)"
        const values =[
            req.body.username,
            req.body.email,
            hash,
            -1,
        ]
        db.query(q,[values],(err,data)=>{
            if(err) return res.json(err);
            return  res.status(200).json("User has been created.")
        })

    })
}
export const login=(req,res)=>{
//检查是否存在用户
    const q = "SELECT * FROM users WHERE username = ?"
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length ===0) return res.status(404).json("未找到用户")
        //检查密码
        const isPasswordCorrect=bcrypt.compareSync(req.body.password,data[0].password)
        if(!isPasswordCorrect) return res.status(400).json("密码错误或用户名不正确")

    const token=jwt.sign({id:data[0].id},"jwtkey")
    const {password,...other} =data[0] //过滤数据库密码c
        other.token=token
        console.log(other)
        res.status(200).json(other)
    })

}
export const logout=(req,res)=>{
res
    .status(200).json("用户注销成功")

}
export const updateinfo=(req,res)=>{
    const token = req.body.token
    if (!token) return res.status(401).json("Not authenticated!");
    jwt.verify(token,"jwtkey",(err,userInfo)=>{
        if(err) return res.status(403).json("身份认证不合法")
        const q="UPDATE users SET `username`=? ,`signal`=?,`email`=? WHERE `id` = ?";
        db.query(q,[req.body.values.username,req.body.values.signal,req.body.values.email,userInfo.id],(err,data)=>{
            if(err)res.send(err)
        })
        // console.log(req.body.values)
        const q2 = "SELECT * FROM users WHERE id = ?"
        db.query(q2,[userInfo.id],(err,data)=>{
            if(err)res.send(err)
            const {password,...other} =data[0] //过滤数据库密码c
            other.token=token
            // console.log(other)
            res.status(200).json(other)
        })
    })
}
export const passwordchange=(req,res)=>{
    const token = req.body.token
    if (!token) return res.status(401).json("Not authenticated!");
    jwt.verify(token,"jwtkey",(err,userInfo)=>{
        if(err) return res.status(403).json("身份认证不合法")
        const q = "SELECT password FROM users WHERE id = ?"
        const q2="UPDATE users SET `password`=? WHERE `id` = ?";
        const salt=bcrypt.genSaltSync(10)
        // const hash=bcrypt.hashSync(req.body.values.original,salt);
        const hash2=bcrypt.hashSync(req.body.values.new,salt);
        db.query(q,[userInfo.id],(err,data)=>{
            const isPasswordCorrect=bcrypt.compareSync(req.body.values.original,data[0].password)
            // console.log(isPasswordCorrect)
            if(!isPasswordCorrect) return res.status(400).json("原密码不正确")
            if(isPasswordCorrect){
                db.query(q2,[hash2,userInfo.id],(err)=>{
                    if(err)return res.send(err)
                })
                res.send('change successful')
            }
            if(err)console.log(err)
        })
    })
}