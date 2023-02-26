import React, {createContext, useEffect, useState} from "react";
import axios from "axios";
import {httpInfo} from "./https";
import {message} from "antd";
import {StarFilled, StarOutlined} from "@ant-design/icons";

export const AuthContext=createContext(undefined)

export const AuthContextProvider=({children})=>{
    //这个是读取sessionStorage里的user数据
    const [currentUser,setCurrentUser] = useState(JSON.parse(sessionStorage.getItem("user")) || null)
    const login =async (inputs)=>{
        const res =await axios.post(httpInfo+"/auth/login",inputs)
    setCurrentUser(res.data)
    }
    const logout =async (inputs)=>{
       await axios.post(httpInfo+"/auth/logout")
        setCurrentUser(null)
    }
    const changeinfo=async (inputs)=>{
        try{const res=await axios.post(httpInfo+`/auth/updateinfo/`,inputs)
        setCurrentUser(res.data)
        message.success('修改成功！')}catch(err){
            console.log(err)
            message.error('修改失败')}
    }
    const changepassword=async (inputs)=>{
        try{await axios.post(httpInfo+`/auth/passwordchange`,inputs)
        message.success('修改成功！')
        }catch (err){
            console.log(err.response.data)
            message.error(`修改失败,${err.response.data}`)
        }
    }
    const changecollectionyes=async (inputs,setIcon,seticonbool)=>{
        try {
            const res=await axios.post(httpInfo + `/collection?id=${currentUser.id}`, inputs)
            setIcon(<StarFilled style={{color: '#ffd700'}}/>)
            seticonbool(true)
            message.success('收藏成功！')
            console.log(res.data)
            setCurrentUser(res.data)
        } catch (err) {
            if (err) console.log(err)
            message.error('收藏失败')
        }
    }
    const changecollectionno=async (inputs,setIcon,seticonbool)=>{
        try {
            const res=await axios.post(httpInfo + `/collection?id=${currentUser.id}`, inputs)
            setIcon(<StarOutlined style={{color: '#777'}}/>)
            seticonbool(false)
            message.info('取消收藏')
            console.log(res.data)
            setCurrentUser(res.data)
        } catch (err) {
            if (err) console.log(err)
            message.error('取消收藏失败')
        }
    }
    const changecollectionno2=async (inputs)=>{
        try {
            const res=await axios.post(httpInfo + `/collection?id=${currentUser.id}`, inputs)
            setCurrentUser(res.data)
            message.success('取消收藏成功')
            setTimeout(()=>{window.location.reload()},500)
        } catch (err) {
            if (err) console.log(err)
            message.error('取消收藏失败')
        }

    }
    const postavatar=async (inputs,setFileList,setUploading)=>{
        try{
            const res=await axios.post(httpInfo+`/upload3?id=${currentUser.id}`,inputs)
            setFileList([])
            message.success('更改成功');
            setCurrentUser(res.data)
        }catch(err){
            message.error('更改失败'+err);
        }finally {
            setUploading(false);
        }

    }

    useEffect(()=>{
        sessionStorage.setItem("user",JSON.stringify(currentUser))
    },[currentUser])

    const [themes,setThemes]=useState('light')

    return <AuthContext.Provider value={{themes,setThemes,currentUser,postavatar,changeinfo, changepassword,changecollectionyes,changecollectionno,changecollectionno2,login, logout}}>
        {children}
    </AuthContext.Provider>
}
