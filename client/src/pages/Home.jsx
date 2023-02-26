import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import axios  from "axios";
import {Empty, Tag, Card, Checkbox, Row, Col, Divider, DatePicker,} from "antd"
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { Pagination } from 'tdesign-react';
import 'tdesign-react/es/style/index.css';
import {httpInfo} from "../context/https";
import {AuthContext} from "../context/authContext";
const { RangePicker } = DatePicker;
//时间筛选设置
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
const Home =()=>{
    let f=[]
    const [posts,setPosts] = useState([])
    const cat = useLocation().search
    const {currentUser,themes} = useContext(AuthContext)
    const [dateStrings,setdateStrings]=useState([])
    const [other,setOther]=useState([])

    useEffect(()=>{
        const fetchData=async ()=>{
            try{
                let res
                if(currentUser && cat){res=await axios.get(httpInfo+`/posts${cat}&id=${currentUser.id}`)}
                if(currentUser && !cat){res=await axios.get(httpInfo+`/posts?cat=blogs&id=${currentUser.id}`)}
                if(!currentUser && cat){res=await axios.get(httpInfo+`/posts${cat}`)}
                if(!currentUser && !cat){res=await axios.get(httpInfo+`/posts?cat=blogs`)}
                let x=res.data
                let y=[]
                x.map((e)=>{
                    y.push(...e.tags.split(','))
                })
                y=(Array.from(new Set(y)))
                setCheckedList(y)
                setPosts(res.data)
                setCheckAll(true)
            }catch(err){
                console.log(err)
            }
            // console.log(f)
            // setCheckedList(f)
        }
        fetchData()
    },[cat])
    const [page,setPage]=useState(1)
    posts.map((post)=>{
        if(post.tags) f.push(...post.tags.split(','))
    })
    f=(Array.from(new Set(f)))
    //
    //处理多选框
    const checkboxs =()=>{
        let i=0
        return f.map((prop)=>{
            i++
            return<Col key={i}>
                <Checkbox defaultChecked={true} key={i} value={prop} >{prop}</Checkbox>
            </Col>
        })

    }
    let [checkedList, setCheckedList] = useState(f);

    const [checkAll, setCheckAll] = useState(true);
    const onChange = (list) => {
        setCheckedList(list);
        setCheckAll(list.length === f.length);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? f : []);
        setCheckAll(e.target.checked);
    };
    const boxs=checkboxs()
    //处理多选框
    //
    //处理出现html标签的问题
    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }
    //处理出现html标签的问题
    //
    //数据预处理
    let postData1=[]
    let postData2=[]
    let postData3=[]
    let postData4=[]
    function handlePosts(){
        function handlePosts1(){
            for(let i=0;i<posts.length;i++){
                let bool=false
                for(let t=0;t<checkedList.length;t++){
                    if(posts[i].tags.split(',').includes(checkedList[t])){
                        bool=true
                        break
                    }
                }
                if(bool)postData1.push(posts[i])
            }

        }
        handlePosts1()
        function handlePosts2(){
            const date1=new Date(dateStrings[0])
            const date2=new Date(dateStrings[1])
            for(let p=0;p<postData1.length;p++){
                let date=new Date(postData1[p].date)
                if(date.getTime()>date1.getTime() &&date.getTime()<date2.getTime()){
                    postData2.push(postData1[p])
                }
            }
        }
        if(dateStrings) handlePosts2()
        if(dateStrings.length===0) postData2=postData1
        if(dateStrings[0]===''&& dateStrings[1]==='') postData2=postData1
        function handlePosts3(){
            let data1=[]
            let data2=[]
           if(other.includes('myself')){
               for (let r=0;r<postData2.length;r++){
                   if(`${currentUser.id}`===`${postData2[r].uid}`){
                       data1.push(postData2[r])
                   }
               }
           }
           if(!(other.includes('myself'))) data1=postData2
            if(other.includes('collection')){
                for (let x=0;x<data1.length;x++){
                    if(currentUser.collection.split(',').includes(`${data1[x].id}`)){
                        data2.push(data1[x])
                    }

                }
            }
            if(!(other.includes('collection'))) data2=data1
            if(other.includes('open')){
                for(let m=0;m<data2.length;m++){
                    if(data2[m].status===1)postData3.push(data2[m])
                }
            }
            if(!(other.includes('open'))) postData3=data2
        }
        if(currentUser)handlePosts3()
        if(!currentUser)postData3=postData2
        postData3=postData3.reverse()
        function handlePosts4(){
            const pageSize=10
            for(let i=page*pageSize-pageSize;(i<page*pageSize && i!==postData3.length);i++) {
                postData4[i]=postData3[i]
            }
        }
        handlePosts4()
    }
    handlePosts()
    //数据预处理
    // console.log(currentUser.collection.split(','))
    let Cards= postData4.map((post)=>{
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
        let color='#ebebeb'
        if(themes==='light'){
            color='#ebebeb'
        }
        if(themes==='dark'){
            color='#142439'
        }
            if(post.tags && t) tagSd=t.map((prop)=>{
                y++
                return <Tag key={y} className={`tagsd-${themes}`} color={color} closable={false} style={{marginLeft:'0px',marginRight:'4.5px'}}>{prop.name}</Tag>
            })
           return<Link key={post.id} className={`CardDivs-${themes}`} to={`/post/${post.id}`}>
                <div className='CardImg'>
                    {post.img &&<img className='BlogImg' src={httpInfo+`/${post.img}`} alt={post.img}></img>}
                    {!post.img &&<div className='Empty'><Empty description='' image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>}
                </div>
                <div className='CardInfo'>
                    <div className='CardTitle'><span>{getText(post.title)}</span></div>
                    <div className='CardInfomin'>
                        <div className='CardComment'>
                            <p className='p1'>{getText(post.introduction)}</p>
                            <p className='p2'><span>作者:{post.username}</span> <span>标签: {tagSd}</span></p>
                        </div>
                        <div className='CardInfodet'>{dayjs(post.date).format("YYYY-MM-DD")}</div>
                    </div>
                </div>
            </Link>
        })



    return<div className='home'>
        <div className='posts'>
            <div className='postsDiv'>{Cards}</div>
            <div className={`pageNationDiv-${themes}`}>
                <Pagination  size="medium" total={posts.length}  defaultPageSize={10} showPageSize={false} totalContent={false} onChange={(info)=>{
                setPage(info.current)
                }
                }/>
            </div>
        </div>
        <div className={`CheckboxDiv-${themes}`}>
            <Card title="筛 选"  className='CardDiv'>
                <p>按标签</p>
                <Checkbox defaultChecked={false} onChange={onCheckAllChange} checked={checkAll}>
                    全选
                </Checkbox>
                <Checkbox.Group style={{ width: '100%' }} defaultChecked={true} value={checkedList} onChange={onChange}>
                    <Row style={{gap:'10px'}}>
                        {boxs}
                    </Row>
                </Checkbox.Group>
                <Divider/>
                <p>按时间</p>
                <RangePicker className='dateRangPicker' locale={locale} presets={rangePresets} onChange={
                    (dates, dateStrings) => {
                        setdateStrings(dateStrings)
                    }
                } />
                {currentUser && <Divider/>}
                {currentUser && <p>其它</p>}
                {currentUser && <Checkbox.Group style={{width: '100%'}} onChange={(e) => {
                    setOther(e)
                }}>
                    <Row style={{gap: '10px'}}>
                        <Col>
                            <Checkbox value='myself'>只看自己的</Checkbox>
                        </Col>
                        <Col>
                            <Checkbox value='collection'>只看收藏的</Checkbox>
                        </Col>
                        <Col>
                            <Checkbox value='open'>只看公开的</Checkbox>
                        </Col>
                    </Row>
                </Checkbox.Group>}
            </Card>
        </div>
    </div>
}
export default Home