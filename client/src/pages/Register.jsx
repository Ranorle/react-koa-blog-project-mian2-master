import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {Carousel, Input,Modal} from "antd";
import login_1 from "../img/login_1.png";
import login_2 from "../img/Login_2.png";
import login_3 from "../img/Login_3.png";
import Logo2 from "../img/logo2.png";
import beianimg from "../img/beianimg.png";
import {httpInfo} from "../context/https";
const Register =()=>{
    const [inputs,setInputs]=useState({
        username:"",
        email:"",
        password:"",
    })
    //拦截注册
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [err,setError]=useState(null)

    const navigate=useNavigate()

    const handleChange=(e)=>{
        setInputs(prev=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit=async e=> {
        e.preventDefault()
        try {
            await axios.post(httpInfo+"/auth/register", inputs)
            // console.log(res)
            navigate("/login")
        }catch (err){
        setError(err.response.data);
        }
    }
    // console.log(inputs)

    return<div className='auth'>
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
        <h2>欢 迎 注 册</h2>
        <form>
            <Input required type="text" placeholder='username' name="username" onChange={handleChange}/>
            <Input required type="email" placeholder='email' name='email' onChange={handleChange}/>
            <Input.Password size="large" required type="password" placeholder='password' name='password' onChange={handleChange}/>
            {/*<button onClick={handleSubmit}>Register</button>*/}
            <button onClick={showModal}>Register</button>
            <Modal title="肥肠抱歉" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>注册功能未开放，请与管理者联系</p>
            </Modal>
            {err && <p>{err}</p>}
            <span>如果你有一个账户，请前往<Link to="/login">登陆界面</Link></span>
        </form>
            </div>
        </div>
        <div className='pagefootinfo2'>
            <div className='beian2'>
                <a href="https://beian.miit.gov.cn/#/Integrated/index"><p>京ICP备2022029720号-1 | </p></a><a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802040838"><img src={beianimg}/><p>京公网安备 11010802040838号</p></a>
            </div>
        </div>
    </div>
}
export default Register