import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import {
    Alert,
    Button, Form,
    Input,
    Layout, Modal, Select,
    Typography
} from 'antd';
import 'antd/dist/antd.css';
import AdminLayout from 'components/layout/admin';
import React from 'react';
import styles from './congty.module.css';
import { useAuth } from '../../hooks/use-auth';
import Link from 'next/link';
import { useState } from 'react';

const { Content } = Layout;
const { Option } = Select;

function Congty() {
    const [form] = Form.useForm()
    const { data } = useAuth();
    const fullName = data?.data[0].fullName;
    // console.log(fullName)

    /* ===================== MODAL VISIBLE===================== */
    const [isVisibleModalCapNhat, setIsVisibleModalCapNhat] = useState(false)

    /* ===================== SHOW MODAL===================== */
    const showModalCapNhat = () => {
        setIsVisibleModalCapNhat(true)
    }

    /* ===================== SHOW MODAL===================== */
    const cancelModalCapNhat = () => {
        setIsVisibleModalCapNhat(false)
    }


    /* ===================== HANLDE FORM ===================== */
    const handleSubmit = (values) => {
        console.log(values)
    }

    const handlePrintButton = () => {
        console.log('print')
    }
    return (
        <div>
            <Content className={styles.contenContainer}>
                <div className={styles.contenContent}>
                    <div className={styles.contentTitle}>
                        <Typography.Title leve={3}>Thông tin công ty</Typography.Title>
                    </div>

                    <div className={styles.contentAlert}>
                        <Alert type='success' message='Trạng thái khởi tạo'
                            showIcon />
                    </div>

                    <div className={styles.formContainer}>
                        <Form
                            layout='vertical'
                            name='bcks'
                            form={form}
                            onFinish={handleSubmit}
                            className={styles.formContent}>
                            <Form.Item
                                label='Tên công ty'
                                name='tenCongTy'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <Form.Item
                                label='Tên viết tắt'
                                name='tenVietTat'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>

                            <div className={styles.formItemWrapper}>
                                <Form.Item
                                    label='Địa chỉ công ty'
                                    name='diaChi'>
                                    <Input className={styles.formItemInput} />
                                </Form.Item>
                                <Form.Item
                                    label='Phường/Xã'
                                    name='phuongXa'>
                                    <Select className={styles.formItemSelect}>
                                        <Option value='1'>Tân Thuận</Option>
                                        <Option value='2'>Phước Mỹ</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className={styles.formItemWrapper}>
                                <Form.Item
                                    label='Quận/Huyện'
                                    name='quanHuyen'>
                                    <Select className={styles.formItemSelect}>
                                        <Option value='1'>Tân Thuận</Option>
                                        <Option value='2'>Phước Mỹ</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label='Tỉnh/Thành phố'
                                    name='tinhThanhPho'>
                                    <Select className={styles.formItemSelect}>
                                        <Option value='1'>Tân Thuận</Option>
                                        <Option value='2'>Phước Mỹ</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className={styles.formItemWrapper}>
                                <Form.Item
                                    label='Số điện thoại'
                                    name='soDienThoai'>
                                    <Input className={styles.formItemInput} />
                                </Form.Item>
                                <Form.Item
                                    label='Email'
                                    name='email'>
                                    <Input className={styles.formItemInput} />
                                </Form.Item>
                            </div>
                            <div className={styles.formItemWrapper}>
                                <Form.Item
                                    label='Website'
                                    name='webSite'>
                                    <Input className={styles.formItemInput} />
                                </Form.Item>
                                <Form.Item
                                    label='Fax'
                                    name='fax'>
                                    <Input className={styles.formItemInput} />
                                </Form.Item>
                            </div>
                            <Form.Item
                                label='Họ và tên giám đốc'
                                name='tenGiamDoc'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <div className={styles.formItemWrapper}>
                                <Form.Item
                                    label='Số tài khoản'
                                    name='soTaiKhoan'>
                                    <Input className={styles.formItemInput} />
                                </Form.Item>
                                <Form.Item
                                    label='Ngân hàng'
                                    name='nganHang'>
                                    <Input className={styles.formItemInput} />
                                </Form.Item>
                            </div>
                            <Form.Item
                                label='Tên tài khoản'
                                name='tenTaiKhoan'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <Form.Item
                                label='Tên viết tắt'
                                name='tenVietTat'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>

                            <div className={styles.formButton}>
                                {fullName === 'Admin' &&
                                    <>
                                        <Button
                                            icon={<EditOutlined />}
                                        >

                                            Cập nhật
                                        </Button>
                                        <Button
                                            icon={<SaveOutlined />}
                                            htmlType='submit'
                                        >
                                            Lưu
                                        </Button>
                                    </>
                                }
                                <Button
                                    type='danger'
                                >
                          Đóng
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div >

                {/* ========================== MODAL ========================== */}
                <Modal
                    visible={isVisibleModalCapNhat}
                    footer={false}
                    closable={null}>
                    <Form
                        layout='vertical'
                        name='bcks'
                        form={form}
                        onFinish={handleSubmit}
                        className={styles.formContent}>
                        <Form.Item
                            label='Tên công ty'
                            name='tenCongTy'>
                            <Input className={styles.formItemInput} />
                        </Form.Item>
                        <Form.Item
                            label='Tên viết tắt'
                            name='tenVietTat'>
                            <Input className={styles.formItemInput} />
                        </Form.Item>

                        <div className={styles.formItemWrapper}>
                            <Form.Item
                                label='Địa chỉ công ty'
                                name='diaChi'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <Form.Item
                                label='Phường/Xã'
                                name='phuongXa'>
                                <Select className={styles.formItemSelect}>
                                    <Option value='1'>Tân Thuận</Option>
                                    <Option value='2'>Phước Mỹ</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <div className={styles.formItemWrapper}>
                            <Form.Item
                                label='Quận/Huyện'
                                name='quanHuyen'>
                                <Select className={styles.formItemSelect}>
                                    <Option value='1'>Tân Thuận</Option>
                                    <Option value='2'>Phước Mỹ</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='Tỉnh/Thành phố'
                                name='tinhThanhPho'>
                                <Select className={styles.formItemSelect}>
                                    <Option value='1'>Tân Thuận</Option>
                                    <Option value='2'>Phước Mỹ</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <div className={styles.formItemWrapper}>
                            <Form.Item
                                label='Số điện thoại'
                                name='soDienThoai'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <Form.Item
                                label='Email'
                                name='email'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                        </div>
                        <div className={styles.formItemWrapper}>
                            <Form.Item
                                label='Website'
                                name='webSite'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <Form.Item
                                label='Fax'
                                name='fax'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                        </div>
                        <Form.Item
                            label='Họ và tên giám đốc'
                            name='tenGiamDoc'>
                            <Input className={styles.formItemInput} />
                        </Form.Item>
                        <div className={styles.formItemWrapper}>
                            <Form.Item
                                label='Số tài khoản'
                                name='soTaiKhoan'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <Form.Item
                                label='Ngân hàng'
                                name='nganHang'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                        </div>
                        <Form.Item
                            label='Tên tài khoản'
                            name='tenTaiKhoan'>
                            <Input className={styles.formItemInput} />
                        </Form.Item>
                        <Form.Item
                            label='Tên viết tắt'
                            name='tenVietTat'>
                            <Input className={styles.formItemInput} />
                        </Form.Item>
                        <div className={styles.formButtonGroup}>
                            <Button icon={EditOutlined}>Cập nhật</Button>
                            <Button type='danger'
                                icon={<CloseOutlined />}
                                onClick={cancelModalCapNhat}>Đóng</Button>
                        </div>
                    </Form>
                </Modal>
            </Content >
        </div >
    );
}

Congty.Layout = AdminLayout; ///
export default Congty;
