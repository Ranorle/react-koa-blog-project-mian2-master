import React, {useContext, useState} from "react";
import {AuthContext} from "../context/authContext";
import {UserOutlined, PlusOutlined} from "@ant-design/icons";
import {Avatar, Button, Modal, Divider, Form, Input,message,Watermark,Upload } from "antd";
import {httpInfo} from "../context/https";
import axios from "axios";
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const UserInfo=()=>{
    const [fileList, setFileList] = useState([]);
    const [fileList2, setFileList2] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const handleCancel2 = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview =await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    // console.log(fileList)
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                点击此处上传
            </div>
        </div>
    );

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file);
        });
        setUploading(true);
        postavatar(formData,setFileList,setUploading)
    };
    const handleChange = ({ fileList: newFileList }) => setFileList2(newFileList);

    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };
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

    let {currentUser,changeinfo,changepassword,postavatar,themes} =useContext(AuthContext)
    const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
        const [form] = Form.useForm();
        return (
            <Modal
                open={open}
                title="更改个人信息"
                okText="确认修改"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then(async (values) => {
                            form.resetFields();
                            onCreate(values);
                            const token=JSON.parse(sessionStorage.getItem('user')).token
                            changeinfo({
                                values:values,
                                token:token,
                            })

                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                            message.error('修改失败')
                        });

                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        username:currentUser.username,
                        email:currentUser.email,
                        signal:currentUser.signal,
                    }}
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[
                            {
                                required:true,
                                message: '请输入用户名!',
                            },
                        ]}

                    >
                       <Input defaultValue={currentUser.username} placeholder='请输入用户名'/>
                    </Form.Item>
                    <Form.Item name="signal" label="签名" >
                        <Input placeholder='请输入个人签名' defaultValue={currentUser.signal}/>
                    </Form.Item>
                    <Form.Item name="email" label="邮箱" rules={[
                        {
                            required:true,
                            message: '请输入邮箱!',
                        },
                        {
                            type: 'email',
                            message: '必须是正确的邮箱格式',
                        },
                    ]}

                    >
                        <Input placeholder='请输入邮箱' defaultValue={currentUser.email} />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const [open, setOpen] = useState(false);
    const onCreate = () => {
        setOpen(false);
    };
    const CollectionCreateForm2 = ({ open, onCreate, onCancel }) => {
        const [form] = Form.useForm();
        return (
            <Modal
                open={open}
                title="更改密码"
                okText="确认修改"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then(async (values) => {
                            form.resetFields();
                            onCreate(values);
                            const token=JSON.parse(sessionStorage.getItem('user')).token
                            changepassword({values:values, token:token})

                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                            message.error('修改失败，重复密码不一致')
                        });

                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal2"
                    initialValues={{
                        username:currentUser.username,
                        email:currentUser.email,
                        signal:currentUser.signal,
                    }}
                >
                    <Form.Item
                        name="original"
                        label="原密码"
                        rules={[
                            {
                                required:true,
                                message: '请输入原密码!',
                            },
                        ]}

                    >
                        <Input.Password placeholder='请输入原密码'/>
                    </Form.Item>
                    <Form.Item name="new" label="新密码" hasFeedback rules={[
                        {
                            required:true,
                            message: '请输入新密码!',
                        },
                    ]}>
                        <Input.Password placeholder='请输入新密码' />
                    </Form.Item>
                    <Form.Item name="repeat" label="重复新密码" hasFeedback dependencies={['new']} rules={[
                        {
                            required:true,
                            message: '请再次输入新密码!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('new') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不相同！'));
                            },
                        }),
                    ]}

                    >
                        <Input.Password placeholder='请再次输入新密码'  />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const [open2, setOpen2] = useState(false);
    const onCreate2 = () => {
        setOpen2(false);
    };
    let watercolor='white'
    if(themes==='light') watercolor='rgba(0,0,0,.15)'
    if(themes==='dark') watercolor='#c3c9d2'
    return<div className={`PersonalContentInfo-${themes}`}>
        <Modal title="更改头像" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
            <p>注意：图片仅能为png/jpeg/jpg格式，图片路径及名称中不得有中文</p>
            <Upload {...props} listType="picture-card" fileList={fileList2} onPreview={handlePreview} onChange={handleChange}>
                {fileList2.length >= 1 ? null : uploadButton}
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{
                    marginTop: 16,
                }}
            >
                {uploading ? '正在上传' : '上传更改头像'}
            </Button>
        </Modal>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel2}>
            <img
                alt="example"
                style={{
                    width: '100%',
                }}
                src={previewImage}
            />
        </Modal>
        <CollectionCreateForm
            open={open}
            onCreate={onCreate}
            onCancel={() => {
                setOpen(false);
            }}
        />
        <CollectionCreateForm2
            open={open2}
            onCreate={onCreate2}
            onCancel={() => {
                setOpen2(false);
            }}
        />
        <div className='usercuurentinfo'>
        <div className='baseInfo'>
        <div className='avatar'><Avatar size={64} icon={<UserOutlined />} src={currentUser.img} />
            <Button className='darkButton' onClick={showModal}>更换头像</Button>
            </div>
            <div className='baseInfotext'>
                <h3>{currentUser.username}</h3>
                <p>个性签名:{currentUser.signal}</p>
            </div>
    </div>
        <div className='changeDiv'>
        <Button className='darkButton' onClick={() => {setOpen(true);}}>更改资料</Button>
        <Button className='darkButton' onClick={()=> {setOpen2(true)}}>更改密码</Button>
    </div>
        </div>
        <Divider type='horizontal'/>
        <div className='theme'>
        <Watermark font={{color:watercolor}} content={['主题功能', '尽请期待']}  gap={[80,80]}>
            <div style={{height: 340}} />
        </Watermark>
        </div>
    </div>
}
export default UserInfo