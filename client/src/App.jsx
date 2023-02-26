import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Write from "./pages/Write";
import Single from "./pages/Single";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"
import Footer from "./components/Footer";
import "./css/style-light.scss"
import "./css/style-dark.scss"
import React, {useContext} from "react";
import PersonalPage from "./pages/PersonalPage";
import UserInfo from "./PersonalComponents/userInfo";
import ArticleControl from "./PersonalComponents/articleControl";
import CollectionInfo from "./PersonalComponents/collectionInfo";
import DataInfo from "./PersonalComponents/dataInfo";
import {AuthContext} from "./context/authContext"
import {ConfigProvider} from 'antd';
const Layout =()=>{
    return(
        <>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </>
    )
}

const router=createBrowserRouter([
    {
        path:"/",
        element:<Layout/>,
        children:[
            {
                path:"/",
                element:<Home/>,
            },
            {
                path:"/post/:id",
                element:<Single/>,
            },
            {
                path:"/write",
                element:<Write/>,
            },
            {
                path:"/personal",
                element:<PersonalPage/>,
                children:[{
                    path:'/personal/',
                    element:<UserInfo/>,
                },{
                    path:'/personal/control',
                    element:<ArticleControl/>,
                },{
                    path:'/personal/collection',
                    element:<CollectionInfo/>,
                },{
                    path:'/personal/data',
                    element:<DataInfo/>,
                },],
            },
        ]
},
    {
        path:"/register",
        element:<Register/>,
    },
    {
        path:"/login",
        element:<Login/>,
    },
    {
        path:"/write",
        element:<Write/>,
    },
    {
        path:"/single",
        element:<Single/>,
    },

])

function App() {
    const {themes} = useContext(AuthContext)
    return (
        <ConfigProvider theme={{
            token: {
                borderRadius: 6,
                colorPrimary: '#1677ff',
            },
        }}>
    <div className={`app-${themes}`}>
        <div className="container">
            <RouterProvider router={router}/>
        </div>
    </div>
            </ConfigProvider>
  );
}



export default App;
