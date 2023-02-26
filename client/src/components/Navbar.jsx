import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Logo1 from "../img/logo1.png"
import Logo2 from "../img/logo2.png"
import {AuthContext} from "../context/authContext";
import {Button, message, notification, Space, Popover, Input, Empty,Dropdown} from "antd";
import {EditOutlined, SearchOutlined, UserOutlined,DownOutlined} from "@ant-design/icons";
import axios from "axios";
import {httpInfo} from "../context/https";
import SunSvg from '../icons/sun.svg';
import MoonSvg from '../icons/moon.svg';
const color='#1677ff'
const items = [
    {
        key: 'light',
        label: (
            <div className={`ThemeDiv`}>
            <span>白天模式</span><img height='15px' src={SunSvg} alt='sun'/>
            </div>
                ),
    },
    {
        key: 'dark',
        label: (
            <div className={`ThemeDiv`}>
                <span>黑夜模式</span><img height='13px' src={MoonSvg} alt='moon'/>
            </div>
        ),
    },]

const Navbar =()=>{
    const [messageApi, contextHolder2] = message.useMessage();
    const [api, contextHolder] = notification.useNotification();
    const {currentUser,logout,setThemes,themes} = useContext(AuthContext)
    const [posts,setPosts] = useState([])
    const [value,setValue]=useState('')
    const cat = useLocation().search
    const navigate=useNavigate()
    const onClick = ({ key }) => {
        setThemes(key)
    };

    useEffect(()=>{
        const fetchData=async ()=>{
            try{
                let res
                if(currentUser && cat){res=await axios.get(httpInfo+`/posts${cat}&id=${currentUser.id}`)}
                if(currentUser && !cat){res=await axios.get(httpInfo+`/posts?cat=blogs&id=${currentUser.id}`)}
                if(!currentUser && cat){res=await axios.get(httpInfo+`/posts${cat}`)}
                if(!currentUser && !cat){res=await axios.get(httpInfo+`/posts?cat=blogs`)}
                setPosts(res.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchData()
    },[cat])
    const searchPosts=[]
    if(posts.length!==0){
        for(let i=0;i<posts.length;i++){
           const patt=new RegExp(value)
            if(patt.test(posts[i].title) || patt.test(posts[i].introduction)){
                searchPosts.push({id:posts[i].id,title:posts[i].title,introduction:posts[i].introduction})
            }
        }
    }
    const content = ()=>{
        let singleResults
        if(searchPosts.length!==0) singleResults=searchPosts.map((prop)=>{
            return(<div key={prop.id-10000}><Link key={prop.id} to={`/post/${prop.id}`}><div className='SingleResult' key={prop.id}><h3>{prop.title}</h3><p>{prop.introduction}</p> </div>
            </Link></div>
            )
        })
        if(!singleResults) singleResults=<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='未找到相关数据' />
        return<div className={`searchContent-${themes}`}>
            {/*<div className='SingleResult'></div>*/}
            {singleResults}
        </div>
    }

    const openNotification =  () => {
        const key = `open${Date.now()}`;
        const btn = (
            <Space>
                <Button type="link" size="small" onClick={() => api.destroy()}>
                    取消
                </Button>
                <Button type="primary" size="small" onClick={async () => {
                    await logout()
                    setstyle1({color:""})
                    setstyle2({color:""})
                    setstyle3({color:""})
                    setstyle4({color:""})
                        logout()
                    api.destroy(key)
                    navigate('/')
                    messageApi.success('登出成功')
                }}>
                    确定
                </Button>
            </Space>
        );
        api.open({
            message: '注意',
            description:
                '你真的要注销登录吗？',
            btn,
            key,
        });
    };

    const [style1,setstyle1]=useState({color:color,fontWeight:"800",})
    const [style2,setstyle2]=useState({})
    const [style3,setstyle3]=useState({})
    const [style4,setstyle4]=useState({})
    let color1="white"
    if(themes==='light') color1="white"
    if(themes==='dark') color1='#171a22'
    // console.log(currentUser)
    // console.log(style)
    return<div className='navbar'>
        {contextHolder}
        {contextHolder2}
        <div className='container1'>
            <div className='logo'>
                <Link to="/" onClick={()=>{
                    setstyle1({color:color,fontWeight:"800",})
                    setstyle2({color:""})
                    setstyle3({color:""})
                    setstyle4({color:""})
                }}>
                    <img src={Logo1} />
                    <img src={Logo2}/>
                </Link>
                <div className='searchInput'><Popover color={color1} trigger='focus' content={content}><Input className='searchinput'
                    placeholder="输入关键字搜索..."
                    prefix={<SearchOutlined style={{color:'#999'}}/>}
                    bordered={false}
                    onChange={(e)=>{setValue(e.target.value)}}
                /></Popover></div>
            </div>
            <div className='links'>
                <div className='linksDiv'>
                <Link className='link' to='/?cat=blogs'><div className='linkDiv' tabIndex="1"  onClick={()=>{
                    setstyle1({color:color,fontWeight:"800",})
                    setstyle2({color:""})
                    setstyle3({color:""})
                    setstyle4({color:""})
                }}><h6 style={style1}>博客</h6></div></Link>
                <Link className='link' to='/?cat=writes'><div className='linkDiv' tabIndex="2" onClick={()=>{
                    setstyle1({color:""})
                    setstyle2({color:color,fontWeight:"800"})
                    setstyle3({color:""})
                    setstyle4({color:""})
                }}><h6 style={style2}>笔记</h6></div></Link>
                <Link className='link' to='/?cat=readings'><div className='linkDiv' tabIndex="3" onClick={()=>{
                    setstyle1({color:""})
                    setstyle2({color:""})
                    setstyle3({color:color,fontWeight:"800"})
                    setstyle4({color:""})
                }}><h6 style={style3}>阅读</h6></div></Link>
                <Link className='link' to='/?cat=games'><div className='linkDiv' tabIndex="4" onClick={()=>{
                    setstyle1({color:""})
                    setstyle2({color:""})
                    setstyle3({color:""})
                    setstyle4({color:color,fontWeight:"800"})
                }}><h6 style={style4}>游戏</h6></div></Link>
                </div>
                {currentUser && <div className='navuserinfo'>
                    <Link to='/personal'>
                    <img src={currentUser.img} alt='User'/>
                    </Link>
                    <Link to='/personal'>
                    <div><p>{currentUser?.username}</p></div>
                    </Link>
                    <Link to='/personal'>
                    <Button style={{border:0}} size='middle' type="link" icon={<UserOutlined />} onClick={()=>{
                        setstyle1({color:""})
                        setstyle2({color:""})
                        setstyle3({color:""})
                        setstyle4({color:""})
                    }
                    }>进入个人主页</Button>
                    </Link>
                </div>}
                <Dropdown menu={{items,selectable: true,defaultSelectedKeys: [themes],onClick}} trigger={["hover","click"]}  placement="bottom">
                    <Button className='darkButton' icon={<DownOutlined />} >更改主题</Button>
                </Dropdown>
                {currentUser ? <Button className='darkButton' onClick={openNotification}>登出</Button> :<Link className='link' to="/login"><Button shape="round">登录</Button></Link>}
                {currentUser && <Link className='link' to="/write"><Button style={{border:0}} size='large' shape="primary" icon={<EditOutlined /> } onClick={()=>{
                    setstyle1({color:""})
                    setstyle2({color:""})
                    setstyle3({color:""})
                    setstyle4({color:""})
                }
                }>Write</Button></Link>}
            </div>
        </div>
    </div>
}
export default Navbar