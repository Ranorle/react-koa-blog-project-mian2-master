import React, {useContext, useEffect} from "react";
import {CheckSquareOutlined, FormOutlined} from '@ant-design/icons';
import {Button, Divider, Empty, Menu, Tag, DatePicker, Segmented, Modal, message} from 'antd';
import { useState } from 'react';
import {Link} from "react-router-dom";
import {httpInfo} from "../context/https";
import dayjs from "dayjs";
import axios from "axios";
import {AuthContext} from "../context/authContext";
import {Pagination} from "tdesign-react";
import locale from "antd/es/date-picker/locale/zh_CN";
const items2 = [
    {
        label: '已发布',
        key: '0',
        icon: <CheckSquareOutlined />,
    },
    {
        label: '草稿',
        key: '1',
        icon: <FormOutlined />
    },
];
const { RangePicker } = DatePicker;
const rangePresets = [
    {
        label: '今日',
        value:[dayjs().add(0,'d'),dayjs().add(1,'d')]
    },
    {
        label: '直到昨天',
        value: [dayjs().add(-1, 'd'), dayjs()],
    },
    {
        label: '过去一周',
        value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
        label: '过去一个月',
        value: [dayjs().add(-30, 'd'), dayjs()],
    },
    {
        label: '过去三个月',
        value: [dayjs().add(-90, 'd'), dayjs()],
    },
    {
        label: '过去一年',
        value: [dayjs().add(-365, 'd'), dayjs()],
    },
    {
        label: '过去三年',
        value: [dayjs().add(-1096, 'd'), dayjs()],
    }

];

const ArticleControl=()=>{

    const handleDelete=async (postId)=>{
        try{
            const token=JSON.parse(sessionStorage.getItem('user')).token
            await axios.delete(httpInfo+`/posts/${postId}`,{data:{token:token}})
            message.success('删除成功')
            setTimeout(() => {
                setOpen(false);
                setConfirmLoading(false);
                window.location.reload()
            }, 1000);
        }catch(err){
            message.error('删除失败')
            console.log(err)
        }
    }
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('确定要删除文章吗？删除后无法恢复！');
    const [postId,setpostId]=useState(-1)
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('删除中……');
        setConfirmLoading(true);
        handleDelete(postId)
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };
    const [dateStrings,setdateStrings]=useState([])
    const [current1, setCurrent] = useState('0');
    const [postData,setpostData]=useState([])
    let {currentUser,themes} =useContext(AuthContext)
    const [page,setPage]=useState(1)
    const [value,setValue]=useState('倒序')

    const onClick2 = (e) => {
        setCurrent(e.key);
    };
    //处理出现html标签的问题
    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }
    useEffect(()=>{const fetchData=async ()=>{
        try{
            const res=await axios.get(httpInfo+`/control?id=${currentUser.id}&draft=${current1}`)
            setpostData(res.data)
        }catch(err){
            console.log(err)
        }
        // console.log(111)
    }

    fetchData()},[current1])
    console.log(111)
    let postData2=[]
    let postData3=[]
    function handlePosts2(){
        const date1=new Date(dateStrings[0])
        const date2=new Date(dateStrings[1])
        for(let p=0;p<postData.length;p++){
            let date=new Date(postData[p].date)
            if(date.getTime()>date1.getTime() &&date.getTime()<date2.getTime()){
                postData2.push(postData[p])
            }
        }
    }
    if(dateStrings) handlePosts2()
    if(dateStrings.length===0) postData2=postData
    if(dateStrings[0]==='' && dateStrings[1]==='' )postData2=postData
    function handlePosts4(){
        const pageSize=6
        const data=postData2
        let data1=[]
        if(value==="倒序") {
            let t=0;
            for(let i=data.length-1;i>=0;i--){
                data1[t]=data[i]
                t++
            }
        }
        if(value==="正序")data1=data
        for(let i=page*pageSize-pageSize;(i<page*pageSize && i!==data1.length);i++) {
            postData3[i]=data1[i]
        }
    }
    handlePosts4()
    let Cards=[]
     if(postData3.length!==0){Cards= postData3.map((post)=>{
        let t=[]
        function a(){
            let v=[]
            if(post) v=post.tags.split(',')
            t=v.map((prop)=>{
                return {name:prop,showClose:false}
            })
        }
        a()
        let tagSd
        let y=0
         let color1='#ebebeb'
         let color2='black'
         if(themes==='light'){
             color1='#ebebeb'
             color2='black'
         }
         if(themes==='dark'){
             color1='#142439'
             color2='#5e9feb'
         }
        if(post.tags && t) tagSd=t.map((prop)=>{
            y++
            return <Tag key={y} color={color1} closable={false} style={{color:color2,marginLeft:'0px',marginRight:'4.5px'}}>{prop.name}</Tag>
        })
        return<div key={post.id-9999}><div key={post.id} className='CardDivs'
                   // to={`/post/${post.id}`}
        >
            <Modal
                title="注意！"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="确认"
                cancelText="取消"
                mask={false}
            >
                <p>{modalText}</p>
            </Modal>
            <div className='CardImg'>
                {post.img &&<img className='BlogImg' src={httpInfo+`/${post.img}`} alt={post.img}></img>}
                {!post.img &&<div className='Empty'><Empty description='' image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>}
            </div>
            <div className='CardInfo'>
                <div className='CardTitle'><span>{getText(post.title)}</span></div>
                <div className='CardInfomin'>
                    <div className='CardComment'>
                        <p className='p1'>{getText(post.introduction)}</p>
                        <p className='p2'><span>标签: {tagSd}</span></p>
                    </div>
                    <div className='edit'>
                        {current1==='0' && <Link to={`/post/${post.id}`}><Button >查看</Button></Link>}
                        {current1==='1' && <Link to={`/post/${post.id}`}><Button >查看并更改</Button></Link>}
                            <Button onClick={()=>{
                                setpostId(post.id)
                                showModal()
                            }}>删除</Button>
                    </div>

                </div>
                <div className='CardInfodet'>{dayjs(post.date).format("YYYY-MM-DD HH:mm:ss")}</div>
            </div>
        </div>
        <Divider key={post.id-10000} className='divider' dashed={false}/>
        </div>
    })}
    let bordertheme=false
    if(themes==='light') bordertheme=false
    if(themes==='dark') bordertheme=true
    return<div className='outside'><div className={`PersonalContentInfo-${themes}`}>
        <div className='menu2'><Menu className='menu1' theme={themes} onClick={onClick2} selectedKeys={[current1]} mode="horizontal" items={items2} />
            <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:'20px'}}>
                <Segmented options={['正序', '倒序']} value={value} onChange={(e)=>{
                // console.log(e)
                    setValue(e)
                }
                } />
                <RangePicker className='dateRangPicker' bordered={bordertheme} locale={locale} presets={rangePresets} onChange={
                (dates, dateStrings) => {
                    setdateStrings(dateStrings)
                }
            } />
            </div>
        </div>
            <div className='controldiv'>
        {Cards}
        </div>

    </div>
    <div className='pageNationDiv'>
        <Pagination  size="medium" total={postData2.length}  defaultPageSize={6} showPageSize={false} totalContent={false} onChange={(info)=>{
            setPage(info.current)
        }
        } showJumper />
    </div></div>
}
export default ArticleControl