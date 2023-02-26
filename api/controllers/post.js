import {db} from "../db.js"
import jwt from "jsonwebtoken"
import fs from "fs"
export const getPosts=(req,res)=>{
    // console.log(req.query)
    const q1=req.query.cat ? "SELECT status, u.collection, p.uid, p.id, `introduction`,`tags`,`username`, `title`, `desc`, p.img ,u.img AS userImg,`cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE `cat`= ? AND `status`=1 AND `draft`=0 OR `status`=0 AND `cat`= ? AND p.uid=? AND `draft`=0"
        :"SELECT status, u.collection, p.uid, p.id, `introduction`,`tags`,`username`, `title`, `desc`, p.img ,u.img AS userImg,`cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE `cat`= ? AND `status`=1 AND `draft`=0 OR `status`=0 AND `cat`= ? AND p.uid=? AND `draft`=0"
    const q2=req.query.cat ? "SELECT status, u.collection, p.uid, p.id, `introduction`,`tags`,`username`, `title`, `desc`, p.img ,u.img AS userImg,`cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE `cat`= ? AND `status`=1 AND `draft`=0"
        :"SELECT status, u.collection, p.uid, p.id, `introduction`,`tags`,`username`, `title`, `desc`, p.img ,u.img AS userImg,`cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE `cat`= ? AND `status`=1 AND `draft`=0"
        if(req.query.id)db.query(q1,[req.query.cat,req.query.cat,req.query.id],(err,data)=>{
    if (err) return res.status(500).send(err)
        return res.status(200).json(data)
    })
    if(!req.query.id)db.query(q2,[req.query.cat],(err,data)=>{
        if (err) return res.status(500).send(err)
        return res.status(200).json(data)
    })

}
export const getPost=(req,res)=>{
    const q ="SELECT `draft`,u.collection, p.status, p.id, `introduction`,`tags`,`username`, `title`, `desc`, p.img ,u.img AS userImg,`cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id= ?"
    db.query(q,[req.params.id],(err,data)=>{
        if(err) return res.status(500).json(err)
        return res.status(200).json(data[0])
    })
}


export const addPost=(req,res)=>{
    const token = req.body.token
    if (!token) return res.status(401).json("Not authenticated!");
    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q =
            "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`,`tags`,`introduction`,`status`,`draft`) VALUES (?)";

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id,
            req.body.tags,
            req.body.intro,
            req.body.status,
            req.body.draft,
        ];
        db.query(q, [values], (err, data) => {
            if (err) {

                return res.status(500).json(err);}
            return res.json("Post has been created.");
        });
    });

}
export const deletePost=(req,res)=>{
    const token=req.body.token
    // console.log(req.cookies)
    if(!token) return res.status(401).json("没有相应权限！")
    jwt.verify(token,"jwtkey",(err,userInfo)=>{
    if(err) return res.status(403).json("身份认证不合法")
    const postId =req.params.id
        const q1="SELECT `img` FROM posts WHERE `id`=?"
        db.query(q1,[postId],(err,data)=>{
            if(err) {console.log('无法找到该图片err')
                return res.json(err)}
            fs.unlink('./img/'+data[0].img,(err)=>{
                if(err) console.log('无法删除文件'+err)
            })
        })
    const q2 ="DELETE FROM posts WHERE `id` = ? AND `uid` = ?"
         db.query(q2,[postId,userInfo.id],(err,data)=>{
             if(err) return res.status(403).json("你只能删除你自己的文章")
             return res.json("文章已被删除")
         })
    })
}
export const updatePost=(req,res)=>{
    const token = req.body.token
    if (!token) return res.status(401).json("Not authenticated!");
    // const x=Buffer.from(req.body.img, "latin1").toString(
    //     "utf8"
    // );
    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const postId = req.params.id;
        // console.log(req)
        const q1="SELECT `img` FROM posts WHERE `id`=?"
        db.query(q1,[postId],(err,data)=>{
            if(err) {console.log('无法找到该图片err')
                return res.json(err)}
            if(req.body.img!==data[0].img)fs.unlink('./img/'+data[0].img,(err)=>{
                if(err) console.log('无法删除文件'+err)
            })
        })
        const q2 =
            "UPDATE posts SET `date`=?, `title`=?,`desc`=?,`img`=?,`cat`=?,`introduction`=?,`tags`=?,`status`=?,`draft`=? WHERE `id` = ? AND `uid` = ?";

        const values = [req.body.date,req.body.title, req.body.desc, req.body.img, req.body.cat,req.body.intro,req.body.tags,req.body.status,req.body.draft];

        db.query(q2, [...values, postId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json("Post has been updated.");
        });
    });
}
