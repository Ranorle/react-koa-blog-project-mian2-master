import React, {useContext} from "react";
import {Link, Outlet, useLocation} from "react-router-dom";
import { Menu } from 'antd';
import {BarChartOutlined, FileOutlined, FolderOutlined, UserOutlined} from "@ant-design/icons";
import {AuthContext} from "../context/authContext";
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}


const items = [
    getItem(<Link to='/personal'>用户信息</Link>, 'personal', <UserOutlined />,null,null),
    getItem(<Link to='/personal/control'>文章管理</Link>, 'control', <FileOutlined />,null,null),
    getItem(<Link to='/personal/collection'>个人收藏</Link>, 'collection', <FolderOutlined />,null,null),
    getItem(<Link to='/personal/data'>数据中心</Link>, 'data', <BarChartOutlined />,null,null),
];


const PersonalPage=()=>{
    const {themes}=useContext(AuthContext)
    const location = useLocation()
    let path =location.pathname.split("/")[2]
    if(!path) path='personal'
    return<div className={`PersonalPage`}>
        <div className={`PersonalContent-${themes}`}>
            <div className='PersonalMenu'>
                <div className='MenuTitle' ><p>个人中心</p></div>
                <Menu
                    className='menumenu'
                    style={{ width: '100%' }}
                    defaultSelectedKeys={[path]}
                    mode="inline"
                    items={items}
                    theme={themes}
                />
            </div>
                <Outlet/>
        </div>
    </div>
}
export default PersonalPage