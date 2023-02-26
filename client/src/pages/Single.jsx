import React, {useContext, useEffect, useState} from "react";
import {DeleteOutlined, EditOutlined, StarFilled, StarOutlined} from "@ant-design/icons";
import {Button,Tag,Divider,FloatButton,Affix,Modal,message,Watermark } from "antd";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {AuthContext} from "../context/authContext";
import DOMPurify from "dompurify";
import ReactMarkdown from 'react-markdown';
import MarkNav from 'markdown-navbar';
import remarkGfm from "remark-gfm";
import '../css/github-markdown-light.scss'
import '../css/github-markdown-dark.scss'
import '../css/navbar.css';
import {httpInfo} from "../context/https";
import dayjs from "dayjs";
//获取元素在数组的下标
// console.log(css1)
Array.prototype.indexOf = function(val) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === val) {
            return i;
        };
    }
    return -1;
};

//根据数组的下标，删除该下标的元素
Array.prototype.remove = function(val) {
    const index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
const Single =()=>{
    const [icon,setIcon]=useState(<StarOutlined style={{color:'#777'}}/>)
    const [iconbool,seticonbool]=useState(false)
    const [post,setPost] = useState({tags:'',collection: ''})
    const location = useLocation()
    const navigate=useNavigate()
    const postId =location.pathname.split("/")[2]
    let {currentUser,changecollectionyes,changecollectionno,themes} =useContext(AuthContext)
    if(currentUser===null) currentUser={ //为解决currentUser不存在会导致single页面无法显示的bug
        "id": -1,
        "username": "",
        "email": "",
        "img": ""
    }
//解决收藏问题
//    if(post.collection.split(',').includes(`${post.id}`)) setIcon(<StarFilled>)

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const res = await axios.get(httpInfo+`/posts/${postId}`);
                setPost(res.data);
                if(currentUser.collection.split(',').includes(`${res.data.id}`)){
                    setIcon(<StarFilled style={{color:'#ffd700'}}/>)
                    seticonbool(true)
                    // console.log('设置收藏成功')
                    // console.log('yes')
                }
            } catch (err) {
                console.log(err);
            }

        };
        fetchData()
    },[postId])

    const handleDelete=async ()=>{
        try{
            const token=JSON.parse(sessionStorage.getItem('user')).token
            await axios.delete(httpInfo+`/posts/${postId}`,{data:{token:token}})
            setTimeout(() => {
                setOpen(false);
                setConfirmLoading(false);
                message.success('删除成功')
                navigate("/")
            }, 1000);
        }catch(err){
            message.error('删除失败')
            console.log(err)
        }
    }
    //--------------------------------------对话框处理
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('确定要删除文章吗？删除后无法恢复！');
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('删除中……');
        setConfirmLoading(true);
        handleDelete()
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };
    //----------------------------------------对话框处理
    let color='#ebebeb'
    if(themes==='light'){
        color='#ebebeb'
    }
    if(themes==='dark'){
        color='#142439'
    }
    const tagsDiv=post.tags.split(',').map((prop)=>{
        return<Tag key={prop} className={`tagsd2-${themes}`} color={color} closable={false} style={{minWidth:'30px',color:'black',marginLeft:'4.5px',marginRight:'4.5px'}}><span>{prop}</span></Tag>
    })
    if(!post.draft)return<div className='single'>
        <Modal
            title="注意！"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
        >
            <p>{modalText}</p>
        </Modal>
        <div className={`singlecontent-${themes}`}>
            {post.img && <img src={httpInfo+`/${post?.img}`}/>}
            <div className='titled'>
            <h1 className='hh' dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.title),
            }}
            ></h1>
                {currentUser.id!==-1 && <Button className='darkButton' icon={icon} onClick={async () => {
                    if (!iconbool) {
                        let x = currentUser.collection.split(',')
                        x.push(`${post.id}`)
                        x = Array.from(new Set(x))
                        x = x.toString();
                        changecollectionyes({x, currentUser},setIcon,seticonbool)
                    }
                    if (iconbool) {
                        let x = currentUser.collection.split(',')
                        x.remove(`${post.id}`)
                        x = Array.from(new Set(x))
                        x = x.toString();
                        changecollectionno({x, currentUser},setIcon,seticonbool)
                    }
                }}>收藏</Button>}
            </div>
            <div className='user'>
                {post.userImg &&<img src={post.userImg}/>}
            <div className="info">
                <span>{post.username}</span>
                <p>{dayjs(post.date).format("YYYY-MM-DD HH:MM")}</p>
            </div>
                { currentUser.username=== post.username &&
                    <div className="edit">
                    <Link to={`/write?edit=2`} state={post}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
                            message.info('正在编辑文章')
                        }} size='large' ghost/>
                    </Link>
                        <Button onClick={showModal} type="primary" shape="circle" icon={<DeleteOutlined />} size='large' ghost/>
                </div>
                }
        </div>
            <div className='introAndTags'>
                {post.tags && <div><span className='tagSpan'>标签:</span> {tagsDiv}</div>}
            <span className='introSpan'>简介:<span className='y'>{post.introduction}</span></span>
            </div>
            <Divider/>
            <div className={`markdown-body-${themes}`}>
             <div className='markdown-body'>
                <ReactMarkdown  className='MarkdownContent' remarkPlugins={[remarkGfm]} children={post.desc}/>
                </div>
                </div>
        </div>
        <div className={`rightdiv-${themes}`}>
            <Affix >
        <div className="nav-container">
            <MarkNav className="article-menu" updateHashAuto={true}  source={post.desc} headingTopOffset={80} ordered={false} />
        </div>
            </Affix>
        {/*<Menu cat={post.cat}/>*/}
            </div>
        <FloatButton.BackTop />

    </div>
    if(post.draft)return<Watermark content={['草稿','编辑中']}><div className='single'>
        <Modal
            title="注意！"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
        >
            <p>{modalText}</p>
        </Modal>
        <div className={`singlecontent-${themes}`}>
            {post.img && <img src={httpInfo+`/${post?.img}`}/>}
            <div className='titled'>
                <h1 className='hh' dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.title),
                }}
                ></h1>
            </div>
            <div className='user'>
                {post.userImg &&<img src={post.userImg}/>}
                <div className="info">
                    <span>{post.username}</span>
                    <p>Posted {moment(post.date).fromNow()}</p>
                </div>
                { currentUser.username=== post.username &&
                    <div className="edit">
                        <Link to={`/write?edit=2`} state={post}>
                            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
                                message.info('正在编辑文章')
                            }} size='large' ghost/>
                        </Link>
                        <Button onClick={showModal} type="primary" shape="circle" icon={<DeleteOutlined />} size='large' ghost/>
                    </div>
                }
            </div>
            <div className='introAndTags'>
                {post.tags && <div><span className='tagSpan'>标签:</span> {tagsDiv}</div>}
                <span className='introSpan'>简介:<span className='y'>{post.introduction}</span></span>
            </div>
            <Divider/>
            <div className={`markdown-body-${themes}`}>
            <div className='markdown-body'>
                <ReactMarkdown  className='MarkdownContent' remarkPlugins={[remarkGfm]} children={post.desc}/>
            </div>
                </div>
        </div>
        <div className={`rightdiv-${themes}`}>
            <Affix >
                <div className="nav-container">
                    <MarkNav className="article-menu" updateHashAuto={true}  source={post.desc} headingTopOffset={80} ordered={false} />
                </div>
            </Affix>
            {/*<Menu cat={post.cat}/>*/}
        </div>
        <FloatButton.BackTop />

    </div></Watermark>
}
export default Single