import { Button, Modal } from 'antd';
import { useState } from 'react';
const Modal = () => {
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
    return (
        <>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal title="肥肠抱歉" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>注册功能未开放，请与管理者联系</p>
            </Modal>
        </>
    );
};
export default Modal;