import {
    AppstoreOutlined,
    CloseOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    SafetyCertificateTwoTone,
    SettingTwoTone,
    UserOutlined,
    DownOutlined,
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Col,
    Dropdown,
    Form,
    Input,
    Layout,
    Menu,
    message,
    Modal,
    Row,
} from 'antd';
import 'antd/dist/antd.css';
import SubMenu from 'antd/lib/menu/SubMenu';
import { authApi } from 'api-client';
import { Auth } from 'components/common/auth';
import Loading from 'components/common/spin';
import { useAuth } from 'hooks';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { default as logo1 } from 'public/assets/vinorsoft.png';
import React, { useEffect, useState } from 'react';
import { getPageTitle } from 'util';
import { isEmpty } from 'util/index';
import styles from './admin.module.css';

const { Header, Sider, Content } = Layout;

function Admin({ children }) {
    const route = useRouter();
    const [form] = Form.useForm();
    const [titleHeader, setTitleHeader] = useState();
    const [loadPage, setLoadPage] = useState(false);
    const [userTK, setUserTK] = useState();

    const [currentEmail, setCurrentEmail] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const [displayEmailField, setDisplayEmailField] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fullName, setFullName] = useState();
    const [collapse, setCollapse] = useState(true);

    const { revokeToken, getToken, getUserInfo } = useAuth({
        revalidateOnMount: false, // không gọi api cho lần đầu tiên chạy
    });

    useEffect(() => {
        setTitleHeader(getPageTitle(route.pathname));
        getToken().then((res) => {
            setUserTK(res.access_token);
        });
    }, [route.pathname]);

    useEffect(() => {
        getUserInfo().then((res) => {
            setFullName(res.uInfo_name);
            setCurrentEmail(res.uInfo_email);
        });
    }, []);

    const handleLogout = async () => {
        await revokeToken(userTK);
    };

    const showModal = (isBool) => {
        if (isBool) {
            setDisplayEmailField(true);
        } else {
            setDisplayEmailField(false);
        }
        setIsModalVisible(true);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleRedirectPage = async (pathname) => {
        if (route.pathname !== pathname) {
            setLoadPage(true);
        }
        await route.push(pathname);
        setLoadPage(false);
    };

    const handleSubmit = () => {
        if (displayEmailField) {
            if (isEmpty(email) || isEmpty(newPassword) || isEmpty(confirmPassword)) return;
            try {
                authApi.setPassword({ email, password: newPassword }).then((res) => {
                    if (res.succeeded && res.data) {
                        // success
                        form.resetFields();
                        message.success('Tạo mật khẩu mới thành công!');
                    } else {
                        message.error('Tạo mật khẩu mới thất bại!');
                    }
                });
            } catch (error) {
                console.log('error', error);
                message.error('Tạo mật khẩu mới thất bại!');
            }
        } else {
            if (isEmpty(password) || isEmpty(newPassword) || isEmpty(confirmPassword)) return;
            try {
                authApi
                    .changePassword({ email: currentEmail, password, newPassword })
                    .then((res) => {
                        console.log('res', res);
                        if (res.succeeded && res.data) {
                            // success
                            form.resetFields();
                            message.success('Đổi mật khẩu mới thành công!');
                        } else {
                            message.error('Đổi mật khẩu mới thất bại!');
                        }
                    });
            } catch (error) {
                console.log('error', error);
                message.error('Đổi mật khẩu mới thất bại!');
            }
        }
    };

    const handleOnChangeNewPass = (e) => {
        setNewPassword(e.target.value);
    };

    const handleOnChangePass = (e) => {
        setPassword(e.target.value);
    };

    const handleOnChangeConfirmPass = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const menu = (
        <Menu
        // className={styles.menuUserContent}
        >
            <Menu.Item icon={<SettingTwoTone />} key="0">
                <a href="#">Thông tin tài khoản </a>
            </Menu.Item>
            <Menu.Item
                icon={<SafetyCertificateTwoTone twoToneColor="#3bad78" />}
                key="1"
                onClick={() => showModal(false)}
            >
                <a href="#">Đổi mật khẩu</a>
            </Menu.Item>
            <Menu.Item
                icon={<SafetyCertificateTwoTone twoToneColor="#3bad78" />}
                key="2"
                onClick={() => showModal(true)}
            >
                <a href="#">Lấy lại mật khẩu</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item icon={<LogoutOutlined />} key="3" onClick={handleLogout}>
                Đăng Xuất
            </Menu.Item>
        </Menu>
    );

    function handleCollapse() {
        setCollapse((prev) => !prev);
    }
    return (
        <Auth>
            <Layout hasSider className={styles.container}>
                <Sider
                    theme="light"
                    width="300"
                    className={styles.menuBar}
                    style={collapse ? { left: '-100%' } : { left: 0 }}
                >
                    <Menu mode="inline"
                        style={{ marginTop: 40 }}>
                        <SubMenu key="sub1" title="Tổng Quát" icon={<AppstoreOutlined />}>
                            <Menu.Item
                                className={styles.menuItem}
                                key="/ds-tinh-thanh"
                                icon={<AppstoreOutlined />}
                                onClick={() => handleRedirectPage('/ds-tinh-thanh')}
                            >
                                DS Tỉnh Thành
                            </Menu.Item>
                            <Menu.Item
                                className={styles.menuItem}
                                key="/ds-phieu-yeu-cau"
                                icon={<AppstoreOutlined />}
                                onClick={() => handleRedirectPage('/ds-phieu-yeu-cau')}
                            >
                                DS Phiếu Yêu Cầu
                            </Menu.Item>
                            <Menu.Item
                                className={styles.menuItem}
                                key="/phieu-yeu-cau"
                                icon={<AppstoreOutlined />}
                                onClick={() => handleRedirectPage('/phieu-yeu-cau')}
                            >
                                Phiếu Yêu Cầu
                            </Menu.Item>
                            <Menu.Item
                                className={styles.menuItem}
                                key="/ds-phieu-thu"
                                icon={<AppstoreOutlined />}
                                onClick={() => handleRedirectPage('/ds-phieu-thu')}
                            >
                                DS Phiếu Thu
                            </Menu.Item>
                            <Menu.Item
                                className={styles.menuItem}
                                key="phieu-thu"
                                icon={<AppstoreOutlined />}
                                onClick={() => handleRedirectPage('/phieu-thu')}
                            >
                                Phiếu Thu
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item
                            className={styles.menuItem}
                            key="7"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/ds-bao-cao-tham-dinh')}
                        >
                            DS BC Thẩm Định
                        </Menu.Item>

                        <Menu.Item
                            className={styles.menuItem}
                            key="8"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/ds-chung-thu')}
                        >
                            DS Chứng Thư
                        </Menu.Item>
                        <Menu.Item
                            className={styles.menuItem}
                            key="17"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/ds-luong-kinh-doanh')}
                        >
                            DS Lương
                        </Menu.Item>
                        <Menu.Item
                            className={styles.menuItem}
                            key="9"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/ds-chi-tieu-bao-cao')}
                        >
                            DS Chỉ Tiêu Báo Cáo
                        </Menu.Item>
                        <Menu.Item
                            className={styles.menuItem}
                            key="10"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/bao-cao-khao-sat')}
                        >
                            Báo Cáo Khảo Sát
                        </Menu.Item>
                        <Menu.Item
                            className={styles.menuItem}
                            key="11"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/bao-cao-chung-thu')}
                        >
                            Báo Cáo Chứng Thư
                        </Menu.Item>
                        <Menu.Item
                            className={styles.menuItem}
                            key="12"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/phong-ban')}
                        >
                            Danh mục phòng ban
                        </Menu.Item>
                        <Menu.Item
                            className={styles.menuItem}
                            key="13"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/cong-ty')}
                        >
                            Thông tin công ty
                        </Menu.Item>
                        <Menu.Item
                            className={styles.menuItem}
                            key="14"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/ds-chuyen-vien')}
                        >
                            Danh sách chuyên viên
                        </Menu.Item>
                        <Menu.Item
                            className={styles.menuItem}
                            key="15"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/chuc-danh')}
                        >
                            Danh mục chức danh
                        </Menu.Item>
                        <Menu.Item
                            className={styles.menuItem}
                            key="16"
                            icon={<AppstoreOutlined />}
                            onClick={() => handleRedirectPage('/ds-phieu-chi')}
                        >
                            Danh sách phiếu chi
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout className={styles.rightContainer}>
                    <Header className={styles.headerContent}>
                        <div className={styles.logoContent}>
                            <Image src={logo1} alt="Logo" />
                        </div>
                        <Button
                            size="large"
                            // type="defa"
                            // ghost
                            onClick={handleCollapse}
                            icon={collapse ? <MenuUnfoldOutlined style={{ fontSize: 20 }} /> : <CloseOutlined style={{ fontSize: 20 }} />}
                            className={styles.menuButton}
                        ></Button>
                        <div className={styles.titleContent}>
                            <h2>{titleHeader}</h2>
                        </div>

                        <Dropdown
                            overlay={menu}
                            arrow
                            overlayStyle={{ position: 'fixed', top: 0, right: 0 }}
                            // trigger={['click']}
                            className={styles.userInfo}
                        // placement='bottom'
                        >
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <div className={styles.user_name}>{fullName}</div>
                                <Avatar
                                    size={36}
                                    icon={<UserOutlined />}
                                    className={styles.user_avatar}
                                />
                            </a>
                        </Dropdown>


                    </Header>

                    <Content className={styles.content}>
                        {loadPage ? (
                            <Loading />
                        ) : (
                            <div className="site-layout-background">{children}</div>
                        )}
                    </Content>

                    {/* Change password */}
                    <Modal
                        style={{ textAlign: 'center' }}
                        title={displayEmailField ? 'Lấy lại mật khẩu' : 'Đổi mật khẩu'}
                        visible={isModalVisible}
                        onCancel={handleCancelModal}
                        footer={false}
                    >
                        <Form
                            name="resetPass"
                            form={form}
                            initialValues={{ remember: true }}
                            onFinish={handleSubmit}
                            autoComplete="off"
                            scrollToFirstError
                        >
                            <Row gutter={24} style={{ textAlign: 'left' }}>
                                <Col span={24}>
                                    {displayEmailField ? (
                                        <>
                                            <div>Email:</div>
                                            <Form.Item
                                                name="email"
                                                hasFeedback
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Email không được trống!',
                                                    },
                                                    {
                                                        type: 'email',
                                                        message:
                                                            'Vui lòng nhập đúng định dạng email!',
                                                    },
                                                    {
                                                        max: 100,
                                                        message: 'Tối đa 100 ký tự!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    size="large"
                                                    placeholder="Nhập email"
                                                    onChange={handleOnChangeEmail}
                                                />
                                            </Form.Item>
                                        </>
                                    ) : (
                                        <>
                                            <div>Mật khẩu cũ:</div>
                                            <Form.Item
                                                name="password"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Mật khẩu cũ không được để trống!',
                                                    },
                                                    {
                                                        min: 6,
                                                        message: 'Mật khẩu cũ ít nhất 6 ký tự!',
                                                    },
                                                    {
                                                        max: 50,
                                                        message: 'Mật khẩu cũ tối đa 50 ký tự!',
                                                    },
                                                    {
                                                        pattern: '^[a-zA-Z0-9_]*$',
                                                        message:
                                                            'Mật khẩu cũ không được chứa khoảng trắng',
                                                    },
                                                    // {
                                                    //     pattern:
                                                    //         '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,10}$',
                                                    //     message:
                                                    //         'Tối thiểu tám và tối đa 10 ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt',
                                                    // },
                                                ]}
                                                hasFeedback
                                            >
                                                <Input.Password
                                                    size="large"
                                                    placeholder="Nhập mật khẩu"
                                                    onChange={handleOnChangePass}
                                                />
                                            </Form.Item>
                                        </>
                                    )}

                                    <div>Mật khẩu mới:</div>
                                    <Form.Item
                                        name="newPassword"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Mật khẩu mới không được để trống!',
                                            },
                                            {
                                                min: 6,
                                                message: 'Mật khẩu mới ít nhất 6 ký tự!',
                                            },
                                            {
                                                max: 50,
                                                message: 'Mật khẩu mới tối đa 50 ký tự!',
                                            },
                                            {
                                                pattern: '^[a-zA-Z0-9_]*$',
                                                message:
                                                    'Mật khẩu mới không được chứa khoảng trắng',
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            size="large"
                                            placeholder="Nhập mật khẩu"
                                            onChange={handleOnChangeNewPass}
                                        />
                                    </Form.Item>
                                    <div>Xác nhận mật khẩu mới:</div>
                                    <Form.Item
                                        name="confirmPassword"
                                        dependencies={['newPassword']}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Xác nhận mật khẩu không được để trống!',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (
                                                        !value ||
                                                        getFieldValue('newPassword') === value
                                                    ) {
                                                        return Promise.resolve();
                                                    }

                                                    return Promise.reject(
                                                        new Error(
                                                            'Mật khẩu mới và xác nhận mật khẩu đang không trùng nhau!'
                                                        )
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            size="large"
                                            placeholder="Nhập mật khẩu"
                                            onChange={handleOnChangeConfirmPass}
                                            validateStatus="success"
                                        />
                                    </Form.Item>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button type="primary" htmlType="submit" name="changePass">
                                            Đổi mật khẩu
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>

                    {/* <Footer style={{ textAlign: 'center' }}>vinorsoft ©2022 </Footer> */}
                </Layout>
            </Layout>
        </Auth>
    );
}

export default Admin;
