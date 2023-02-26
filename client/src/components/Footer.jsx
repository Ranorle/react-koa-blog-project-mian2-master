import React from "react";
import beianimg from "../img/beianimg.png"
const Footer =()=>{
    return<div className='pagefootinfo'>
        <div className='beian'>
            <p>@Ranorle |</p><a href="https://beian.miit.gov.cn/#/Integrated/index"><p>京ICP备2022029720号-1 | </p></a><a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802040838"><img src={beianimg}/><p>京公网安备 11010802040838号</p></a>
        </div>
    </div>
}
export default Footer