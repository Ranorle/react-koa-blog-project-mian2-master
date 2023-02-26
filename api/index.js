import express from "express"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import uploadRoutes from "./routes/upload.js"
import uploadRoutes2 from "./routes/upload2.js"
import uploadRoutes3 from "./routes/upload3.js"
import collectionRoutes from "./routes/collection.js";
import controlRoutes from "./routes/controlgets.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import path from 'node:path'
import compression from 'compression'
import helmet from "helmet";
// import fs from 'fs'

const app =express()
app.use(cors())
//压缩发送回客户端的 HTTP 响应，从而显着减少客户端获取和加载页面所需的时间。
app.use(compression())
//解决跨域

app.use('/api/avatar',express.static(path.resolve('./avatar')))
app.use('/api',express.static(path.resolve('./img')))
app.use('/api',express.static(path.resolve('./img2')))
app.use('/',express.static(path.resolve('./build')))

app.use(express.json())

app.use(cookieParser())

app.use("/api/upload",uploadRoutes)
app.use("/api/upload2",uploadRoutes2)
app.use("/api/upload3",uploadRoutes3)
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/collection",collectionRoutes)
app.use("/api/control",controlRoutes)

app.use('*',(req,res)=>{
    res.redirect('/')
})

app.listen(8800,()=>{
    console.log("connected!")
})