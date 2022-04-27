import { Button, Checkbox, Col, Form, Input, Row, notification } from 'antd';
import { useAuth } from 'hooks/index';
import { useRouter } from 'next/router';
import { Spin } from 'node_modules/antd/lib/index';
import React, { useEffect, useState } from 'react';
import styles from './login.module.css';

function DangNhap() {
    const { login, data } = useAuth({
        revalidateOnMount: false, // không gọi api cho lần đầu tiên chạy
    });

    const router = useRouter();
    const [emaiData, setEmaiData] = useState(false);
    const [passData, setPassData] = useState(false);
    const [displayButton, setDisplayButton] = useState(false);
    const [isLogin, setIslogin] = useState(false);

    const handleSubmit = async (values, e) => {
        try {
            setIslogin(true); // start spin
            const result = await login({
                email: values.email,
                password: values.password,
            });
            if (
                !result.succeeded &&
                result.message === 'Your account is locked. Please contact admin !!!'
            ) {
                openNotification('topRight', 'Đăng nhập thất bại', 'Tài khoản của bạn đã bị khóa!');
            } else if (!result.succeeded)
                openNotification('topRight', 'Đăng nhập thất bại', 'Sai email hoặc mật khẩu');
            setIslogin(false); // end spin
        } catch (error) {
            setIslogin(false); // end spin
            console.log('Đăng nhập thất bại', error);
            openNotification('topRight', 'Đăng nhập thất bại', 'Sai email hoặc mật khẩu');
        }
    };

    useEffect(() => {
        if (data?.data[0].fullName) {
            router.push('/');
        }
        console.log('data', data?.data[0].fullName);
    }, [data, router]);

    const handleOnChangeEmail = (e) => {
        if (e.target.value.length > 0) {
            setEmaiData(true);
        } else {
            setEmaiData(false);
        }
    };

    const handleOnChangePass = (e) => {
        if (e.target.value.length > 0) {
            setPassData(true);
        } else {
            setPassData(false);
        }
    };

    useEffect(() => {
        if (emaiData && passData) {
            setDisplayButton(true);
        } else {
            setDisplayButton(false);
        }
    }, [emaiData, passData]);

    const openNotification = (placement, message, description) => {
        <div>
            {notification.error({
                message: message,
                description: description,
                placement,
            })}
        </div>;
    };

    return (
        <div className="login-container">
            <div className="login-grid">
                <div className="login-grid-left">
                    <div
                        style={{
                            fontSize: '34px',
                            fontWeight: 'bold',
                            color: '#2266D8',
                            marginLeft: '5px',
                        }}
                    >
                        Đăng nhập
                    </div>
                    <p style={{ fontSize: '16px', color: '#444444', marginLeft: '5px' }}>
                        Hệ thống quản lý thẩm định giá
                    </p>

                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={handleSubmit}
                        autoComplete="off"
                    >
                        <Row gutter={24}>
                            <Col span={24}>
                                <div>Email</div>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Email không được trống!',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Vui lòng nhập đúng định dạng email!',
                                        },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        onChange={handleOnChangeEmail}
                                        placeholder="Nhập email"
                                        className={styles.btn_login}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <div>Mật khẩu</div>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mật khẩu không được để trống!',
                                        },
                                        {
                                            min: 6,
                                            message: 'Mật khẩu từ 6 đến 20 ký tự!',
                                        },
                                        {
                                            max: 50,
                                            message: 'Mật khẩu từ 6 đến 50 ký tự!',
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        size="large"
                                        placeholder="Nhập mật khẩu"
                                        onChange={handleOnChangePass}
                                        className={styles.btn_login}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="remember"
                                    valuePropName="checked"
                                    wrapperCol={{ offset: 1, span: 24 }}
                                >
                                    <Checkbox>Ghi nhớ email cho lần đăng nhập sau</Checkbox>
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                                    {displayButton ? (
                                        <Spin spinning={isLogin}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                style={{
                                                    width: '100%',
                                                    height: '48px',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                Đăng Nhập
                                            </Button>
                                        </Spin>
                                    ) : (
                                        <Button
                                            htmlType="button"
                                            disabled
                                            style={{
                                                width: '100%',
                                                height: '48px',
                                                fontSize: '16px',
                                                backgroundColor: '#CACACA',
                                                color: '#616161',
                                            }}
                                        >
                                            Đăng Nhập
                                        </Button>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default DangNhap;
