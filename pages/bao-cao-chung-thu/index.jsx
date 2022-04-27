import { CloseOutlined, DeleteOutlined, FileOutlined, PrinterOutlined, SaveOutlined, UserAddOutlined } from '@ant-design/icons';
import {
    Affix,
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Layout,
    Alert,
    Row,
    Select
} from 'antd';
import 'antd/dist/antd.css';
import AdminLayout from 'components/layout/admin';
import Link from 'next/link'
import React, { useState } from 'react';
import styles from './bcchungthu.module.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

function BCChungThu() {
    const handleSubmitChungThuForm = (values) => {
        console.log('formValues', values)
    }
    return (
        <div>
            <Content className={styles.contentWrapper}>
                <div>
                    <div className={styles.title}>
                        <h1>Chứng thư thẩm định giá</h1>
                    </div>
                    <div style={{ width: 800, margin: '30px auto' }}>
                        <Alert message="Trạng thái khởi tạo" type="success" showIcon />
                    </div>

                    <div className={styles.formContainer}>
                        <Form
                            name='chungThu'
                            layout='vertical'
                            onFinish={handleSubmitChungThuForm}
                            className={styles.formContent}>
                            <div className={styles.formItemWrapper}>
                                <Form.Item name='soChungThuHeThong' label='Số chứng thư hệ thống'
                                    rules={[{
                                        required: true,
                                        message: 'Yêu cầu nhập!!!'
                                    }]}
                                >
                                    <Input className={styles.formItemInput} disabled />
                                </Form.Item>
                                <Form.Item name='ngayTaoChungThu' label='Ngày tạo chứng thu'
                                    rules={[{
                                        required: true,
                                        message: 'Yêu cầu nhập!!!'
                                    }]}>
                                    <DatePicker className={styles.formItemDatePicker} disabled />
                                </Form.Item>
                            </div>

                            <div className={styles.formItemWrapper}>
                                <Form.Item name='soChungThuBanHanh' label='Số chứng thư ban hành'
                                    rules={[{
                                        required: true,
                                        message: 'Yêu cầu nhập!!!'
                                    }]}>
                                    <Input className={styles.formItemInput} disabled />
                                </Form.Item>
                                <Form.Item name='ngayBanHanhChungThu' label='Ngày ban hành chứng thu'
                                    rules={[{
                                        required: true,
                                        message: 'Yêu cầu nhập!!!'
                                    }]}>
                                    <DatePicker className={styles.formItemDatePicker} disabled />
                                </Form.Item>
                            </div>

                            <div className={styles.formItemWrapper}>
                                <Form.Item name='soPhieuYeuCau' label='Số phiếu yêu cầu'
                                    rules={[{
                                        required: true,
                                        message: 'Yêu cầu nhập!!!'
                                    }]}>
                                    <Input className={styles.formItemInput} disabled />
                                </Form.Item>
                                <Form.Item name='ngayTaoPYC' label='Ngày Tạo PYC'
                                    rules={[{
                                        required: true,
                                        message: 'Yêu cầu nhập!!!'
                                    }]}>
                                    <DatePicker className={styles.formItemDatePicker} disabled />
                                </Form.Item>
                            </div>

                            <div className={styles.formItemWrapper}>
                                <Form.Item name='maBaoCao' label='Mã Báo Cáo'
                                    rules={[{
                                        required: true,
                                        message: 'Yêu cầu nhập!!!'
                                    }]}>
                                    <Input className={styles.formItemInput} disabled />
                                </Form.Item>
                                <Form.Item name='ngayLapBC' label='Ngày Lập Báo Cáo'
                                    rules={[{
                                        required: true,
                                        message: 'Yêu cầu nhập!!!'
                                    }]}>
                                    <DatePicker className={styles.formItemDatePicker} disabled />
                                </Form.Item>
                            </div>

                            <Form.Item name='tenKhachHang' label='Tên Khách hàng'
                                rules={[{
                                    required: true,
                                    message: 'Yêu cầu nhập!!!'
                                }]}>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <Form.Item name='tenTaiSan' label='Tên Tài sản thẩm định'
                                rules={[{
                                    required: true,
                                    message: 'Yêu cầu nhập!!!'
                                }]}>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <Form.Item name='mucDichThamDinh' label='Mục đích thẩm định'
                                rules={[{
                                    required: true,
                                    message: 'Yêu cầu nhập!!!'
                                }]}>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <Form.Item name='ketQua' label='Kết quả thẩm định giá'
                                rules={[{
                                    required: true,
                                    message: 'Yêu cầu nhập!!!'
                                }]}>
                                <Input className={styles.formItemInput} />
                            </Form.Item>
                            <div className={styles.formItemWrapper}>
                                <Form.Item name='tongGiaTri' label='Tổng giá trị tài sản'
                                    rules={[{
                                        required: true,
                                        message: 'Yêu cầu nhập!!!'
                                    }]}>
                                    <Input className={styles.formItemInput} />
                                </Form.Item>
                                <Form.Item name='soTienBangChu' label='Bằng chữ'>
                                    <Input className={styles.formItemInput} />
                                </Form.Item>
                            </div>
                            <Form.Item name='file' label='Ảnh chụp'>
                                <Input className={styles.formItemInput} />
                            </Form.Item>

                            <div className={styles.formButtonGroup}>
                                <Button htmlType='submit'
                                    icon={<SaveOutlined />} >Lưu</Button>
                                <Button >Gửi phê duyệt</Button>
                                <Button type='danger'>
                                    <Link href='/'>
                                        <a>Đóng</a>
                                    </Link>
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div >
                {/* 
                < Affix offsetBottom={13} >
                    <div>
                        <Button
                            icon={<PrinterOutlined />}
                        >
                            Lưu
                        </Button>
                        <Button
                            icon={<PrinterOutlined />}
                        >
                            Gửi phê duyệt
                        </Button>
                        <Button
                            icon={<DeleteOutlined />}
                        >
                            Đóng
                        </Button>
                    </div>
                </ Affix> */}
            </Content >
        </div >
    );
}

BCChungThu.Layout = AdminLayout; ///
export default BCChungThu;
