import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
// const posts=[
//     {
//         id:1,
//         title:"Title1",
//         desc:"description1",
//         img:"https://tse4-mm.cn.bing.net/th/id/OIP-C.z6_kUv_ooQ5hj77LWxKzLAHaD5?pid=ImgDet&rs=1"
//     },
//     {
//         id:2,
//         title:"Title2",
//         desc:"description2",
//         img:"https://tse1-mm.cn.bing.net/th/id/OIP-C.ksV-Z2AQE9q-XxDAqHtd-gHaGI?pid=ImgDet&rs=1"
//     }
// ]
const Menu =({cat})=>{
    const [posts, setPosts] = useState([]);
    let x=[]
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/posts/?cat=${cat}`);
                setPosts(res.data);
                 x=posts.sort(function() {
                    return (0.5-Math.random());
                })
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [cat]);

    return<div className='menu'>
        <h1>其它你可能感兴趣的文章</h1>
        {x.map(post=>(
            <div className='post' key={post.id}>
                <img src={`../upload/${post?.img}`} alt=""/>
                <h2>{post.title}</h2>
                <Link to={`/post/${post.id}`}><button>阅读更多</button></Link>
            </div>
        ))}
    </div>
}
export default Menu