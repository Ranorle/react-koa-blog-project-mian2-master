import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../context/authContext";
import { Carousel,Input,message } from 'antd';
import Logo2 from "../img/logo2.png"
import Footer from "../components/Footer";
import beianimg from "../img/beianimg.png";
import login_1 from "../img/login_1.png"
import login_2 from "../img/Login_2.png"
import login_3 from "../img/Login_3.png"
const Login =()=>{
    const [inputs,setInputs]=useState({
        username:"",
        password:"",
    })

//这是顶部通知组件
    const [messageApi, contextHolder] = message.useMessage();

    const [err,setError]=useState(null)

    const navigate=useNavigate()

    const {login}=useContext(AuthContext)

     // console.log(currentUser)

    const handleChange=(e)=>{
        setInputs((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit=async e=> {
        e.preventDefault()
        try {
             await login(inputs)

            messageApi.open({
                type: 'loading',
                content: '正在登录',
                duration: 1.2,
            })
                .then(() => {message.success('登录成功', 2.5)
                    navigate("/")
                })
            // console.log(res)
        }catch (err){
            setError(err.response.data);
            messageApi.open({
                type: 'loading',
                content: '正在登录',
                duration: 0.4,
            })
                .then(() => {message.info(err.response.data, 2.5)})
        }

    }
    // console.log(inputs)
    return<div className='auth'>
        {contextHolder}
        <div className='authDiv'>
            <div className='carouselDiv'>
                <Carousel autoplay>
                    <div>
                        <img src={login_1} className='carousel'/>
                    </div>
                    <div>
                        <img src={login_2} className='carousel'/>
                    </div>
                    <div>
                        <img src={login_3} className='carousel'/>
                    </div>
                </Carousel>
            </div>
        <div className='inputDiv'>
           <Link to="/"> <img src={Logo2}/></Link>
        <h1>Welcome to Ranorle's Blog!</h1>
            <h2>欢 迎 登 录</h2>
        <form>
            <Input required  type="text" placeholder='username' name='username' onChange={handleChange}/>
            <Input.Password required size="large" type="text" placeholder='password' name='password' onChange={handleChange}/>
            <button onClick={handleSubmit}>Login</button>
            {/*{err && <p>{err}</p>}*/}
            <span>没有账户？<Link to="/register">注册一个（未开放）</Link></span>
        </form>
        </div>
    </div>
        <div className='pagefootinfo2'>
            <div className='beian2'>
                <p>Ranorle (●'◡'●)</p><a href="https://beian.miit.gov.cn/#/Integrated/index"><p>| 京ICP备2022029720号-1 | </p></a><a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802040838"><img src={beianimg}/><p>京公网安备 11010802040838号</p></a>
            </div>
        </div>
    </div>
}
export default Login