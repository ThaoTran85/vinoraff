import React from 'react'
import AdminLayout from 'components/layout/admin';
import { Content } from 'antd/lib/layout/layout';
import { Affix, Button, Col, DatePicker, Form, Input, Modal, Row, Select, Table, Typography, message } from 'antd';
import styles from './chuyenvien.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { phongBanApi } from 'api-client/phongbanapi';
import { chucDanhApi } from 'api-client/chucdanhapi';
import { responseSymbol } from 'node_modules/next/dist/server/web/spec-compliant/fetch-event';
const { Option } = Select

/* ============================== TABLE ============================== */
const columns = [
    {
        title: 'Mã nhân viên',
        dataIndex: 'maNhanVien'
    },
    {
        title: 'Email',
        dataIndex: 'email'
    },
    {
        title: 'Họ và tên',
        dataIndex: 'hoVaTen'
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'soDienThoai'
    },
    {
        title: 'Phòng',
        dataIndex: 'phongBan'

    },
    {
        title: 'Chức danh',
        dataIndex: 'chucDanh1',

    },
    {
        title: 'Chức danh 2',
        dataIndex: 'chucDanh2'
    },
    {
        title: 'Mật khẩu',
        dataIndex: 'matKhau'
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trangThai',
        render: record => record.trangThai == 1 ? 'Hoạt động' : 'Ngưng hoạt động'
    },
    {
        title: 'Ghi chú',
        dataIndex: 'ghiChu'
    }
]

function DSChuyenVine() {
    const [selectRows, setSelectRows] = useState([])
    const [themForm] = Form.useForm()
    const [capNhatForm] = Form.useForm()
    const [capNhatMKForm] = Form.useForm()
    const [phongBans, setPhongBans] = useState([])
    const [disabledChucDanh, setDisabledChucDanh] = useState(true)
    const [phongBanIds, setPhongBanIds] = useState([])
    const [chucDanhs, setChucDanhs] = useState([])
    const [newChucDanhsList, setNewChucDanhsList] = useState([])
    const [dataSource, setDataSource] = useState([
        {
            key: 1,
            maNhanVien: 'NV01',
            email: 'Nguyenvana@gmail.com',
            hoVaTen: 'Nguyễn Văn A',
            soDienThoai: 123456789,
            phongBan: 'Kinh doanh',
            chucDanh1: 'Nhân viên',
            chucDanh2: 'Nhân viên',
            matKhau: '123456',
            trangThai: 1,
            ghiChu: 'Không có'
        },
        {
            key: 2,
            maNhanVien: 'NV02',
            email: 'Nguyenvana@gmail.com',
            hoVaTen: 'Nguyễn Văn A',
            soDienThoai: 123456789,
            phongBan: 'Kinh doanh',
            chucDanh1: 'Nhân viên',
            chucDanh2: 'Nhân viên',
            matKhau: '123456',
            trangThai: 1,
            ghiChu: 'Không có'
        }
    ])

    /**
     * GET PHONGBAN API
     */
    useEffect(() => {
        const getPhongBans = async () => {
            try {
                const res = await phongBanApi.getPhongBan()
                if (res.data) {
                    setPhongBans(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getPhongBans()
    }, [])

    /**
     * GET CHUCDANH API
     */
    useEffect(() => {
        const getChucDanh = async () => {
            try {
                const res = await chucDanhApi.getChucDanh()
                if (res.data) {
                    setChucDanhs(res.data)
                }
                else {
                    message.error(res.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getChucDanh()
    }, [])

    /* ============================== ROW SELECTIONS ============================== */
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectRows(selectedRows)
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    /* ============================== MODAL STATE ============================== */
    const [isVisibleModalThem, setIsVisibleModalThem] = useState(false)
    const [isVisibleModalCapNhat, setIsVisibleModalCapNhat] = useState(false)
    const [isVisibleModalXoa, setIsVisibleModalXoa] = useState(false)
    const [isVisibleModalCapNhatMK, setIsVisibleModalCapNhatMK] = useState(false)

    /* ============================== HADNLE MODAL ============================== */

    /* ============================== SHOW MODAL ============================== */
    const showModalThem = () => {
        setIsVisibleModalThem(true)
    }
    const showModalCapNhat = () => {
        if (selectRows.length > 1 || selectRows.length < 1) {
            message.warning('Chỉ được chọn 1 dòng để cập nhật')
            return
        }
        setIsVisibleModalCapNhat(true)
        capNhatForm.setFieldsValue({
            chucDanh1: selectRows[0].chucDanh1,
            chucDanh2: selectRows[0].chucDanh2,
            email: selectRows[0].email,
            ghiChu: selectRows[0].ghiChu,
            hoVaTen: selectRows[0].hoVaTen,
            phongBan: selectRows[0].phongBan,
            maNhanVien: selectRows[0].maNhanVien,
            matKhau: selectRows[0].matKhau,
            soDienThoai: selectRows[0].soDienThoai,
            trangThai: selectRows[0].trangThai
        })
    }
    const showModalXoa = () => {
        if (selectRows.length > 1 || selectRows.length < 1) {
            message.warning('Chỉ được chọn 1 dòng để xóa')
            return
        }
        setIsVisibleModalXoa(true)
    }
    const showModalCapNhatMK = () => {
        setIsVisibleModalCapNhatMK(true)
    }

    /* ============================== HADNLE FORM ============================== */
    const handleSubmitThemForm = (values) => {
        console.log('Thêm form', values)
        const key = new Date().getTime()
        const params = {
            ...values,
            ghiChu: values.ghiChu || '',
            key
        }
        setDataSource([...dataSource, params])
        themForm.resetFields()

    }
    const handleSubmitCapNhatForm = (values) => {
        console.log('Cập nhật form', values)

        setDataSource(dataSource.map(item => item.maNhanVien === values.maNhanVien ? { ...item, ...values } : item))
        capNhatForm.resetFields()
        closeModalCapNhat()
    }

    /* ============================== CLOSE MODAL ============================== */
    const closeModalThem = () => {
        themForm.resetFields()
        setIsVisibleModalThem(false)
    }
    const closeModalCapNhat = () => {
        setIsVisibleModalCapNhat(false)
    }
    const closeModalXoa = () => {
        setIsVisibleModalXoa(false)
    }
    const closeModalCapNhatMK = () => {
        setIsVisibleModalCapNhatMK(false)
    }
    const [selectionType, setSelectionType] = useState('checkbox');
    const handlePhongBanChange = async (value, option) => {
        const id = option.id
        setPhongBanIds(id)
        setDisabledChucDanh(false)
        setNewChucDanhsList(chucDanhs?.filter(item => item.phongBanId == id))
        console.log(newChucDanhsList)
    }
    return (
        <div>
            <Content className={styles.contentContainer}>
                <div className={styles.searchWrapper}>
                    <Input placeholder="Tìm kiếm..." onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button icon={<SearchOutlined />}></Button>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={showModalThem}
                    >
                        Tạo mới
                    </Button>
                </div>
                <div className={styles.tableWrapper}>
                    <h2>Danh mục chuyên viên</h2>
                    <Table
                        bordered
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={{
                            size: 'small',
                            defaultPageSize: '10',
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30'],
                        }}
                    />
                </div>
            </Content>
            <Affix className={styles.affixConfig}>
                <div className={styles.affixButtonGroup}>
                    {selectRows.length <= 0 ?
                        <Button type='danger'>
                            Đóng
                        </Button> :
                        <>
                            <Button
                                onClick={showModalCapNhat}
                                icon={<EditOutlined />}>Cập nhật</Button>
                            <Button
                                onClick={showModalCapNhatMK}
                                icon={<EditOutlined />}>Đổi mật khẩu</Button>
                            <Button
                                type='danger'
                                onClick={showModalXoa}
                                icon={<DeleteOutlined />}
                            >Xóa</Button>
                        </>
                    }
                </div>
            </Affix>
            {/* ==============================- Thêm ==============================- */}
            <Modal
                visible={isVisibleModalThem}
                footer={false}
                closable={null}>
                <Form
                    name='themForm'
                    onFinish={handleSubmitThemForm}
                    layout='vertical'
                    form={themForm}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <Typography.Title level={3} style={{ marginBottom: 0, textTransform: 'uppercase' }}>Thêm chuyên viên</Typography.Title>
                        <Typography.Text>Vui lòng thêm các trường bắt buộc</Typography.Text  >
                    </div>

                    <Form.Item name='maNhanVien' label='Mã nhân viên'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa nhập mã nhân viên'
                        },
                        {
                            max: 30,
                            message: 'Độ dài tối đa 30 kí tự'
                        }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='email' label='Email'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa nhập thông tin email'
                        }, {
                            max: 50,
                            message: 'Độ dài tối đa 100 kí tự'
                        },
                        {
                            type: 'email',
                            message: ' Email không hợp lệ'
                        }
                        ]}>
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item name='hoVaTen' label='Họ và tên'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa nhập họ và tên chuyên viên'
                        }]}>
                        <Input maxLength={300} />
                    </Form.Item>
                    <Form.Item name='soDienThoai' label='Số điện thoại (không bắt buộc)'
                        rules={[{
                            max: 50,
                            message: 'Độ dài tối đa 50 ký tự'
                        }]}>
                        <Input maxLength={50} />
                    </Form.Item>

                    <Form.Item name='phongBan' label='Phòng ban'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa chọn phòng của chuyên viên'
                        }]}>
                        <Select
                            onChange={handlePhongBanChange}>
                            {
                                phongBans?.map(item =>
                                    <Option
                                        value={item.maPhongBan}
                                        key={item.maPhongBan}
                                        id={item.id}
                                    >{item.maPhongBan}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name='chucDanh1' label='Chức danh 1'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa chọn chức danh cho chuyên viên'
                        }]}>
                        <Select disabled={disabledChucDanh}>
                            {
                                newChucDanhsList?.map(item =>
                                    <Option value={item.maChucDanh}
                                        key={item.id}>{item.tenChucDanh}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name='chucDanh2' label='Chức danh 2'>
                        <Select disabled={disabledChucDanh}>
                            {
                                newChucDanhsList?.map(item =>
                                    <Option value={item.maChucDanh}
                                        key={item.id}>{item.tenChucDanh}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name='matKhau' label='Mật khẩu'
                        rules={[{
                            required: true,
                            message: 'Mật khẩu của user chưa được nhập'
                        }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='trangThai' label='Trạng thái'
                        rules={[{
                            required: true,
                            message: 'Bắt buộc nhập trạng thái'
                        }]}>
                        <Select>
                            <Option value={1}>Hoạt động</Option>
                            <Option value={2}>Ngưng hoạt động</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name='ghiChu' label='Ghi chú (không bắt buộc)'>
                        <Input />
                    </Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button htmlType='submit'>Thêm</Button>
                        <Button type='danger' onClick={closeModalThem}>Đóng</Button>
                    </div>
                </Form>
            </Modal>
            {/* ==============================- Sửa ==============================- */}
            <Modal visible={isVisibleModalCapNhat}
                footer={false}
                closable={null}
            >
                <Form
                    name='capNhatForm'
                    onFinish={handleSubmitCapNhatForm}
                    layout='vertical'
                    form={capNhatForm}>
                    <div className={styles.formTitle}>
                        <Typography.Title level={3}>Cập nhật chuyên viên</Typography.Title>
                    </div>

                    <Form.Item name='maNhanVien' label='Mã nhân viên'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa nhập mã nhân viên'
                        },
                        {
                            max: 30,
                            message: 'Độ dài tối đa 30 kí tự'
                        }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='email' label='Email'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa nhập thông tin email'
                        }, {
                            max: 50,
                            message: 'Độ dài tối đa 100 kí tự'
                        },
                        {
                            type: 'email',
                            message: ' Email không hợp lệ'
                        }
                        ]}>
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item name='hoVaTen' label='Họ và tên'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa nhập họ và tên chuyên viên'
                        }]}>
                        <Input maxLength={300} />
                    </Form.Item>
                    <Form.Item name='soDienThoai' label='Số điện thoại (không bắt buộc)'
                        rules={[{
                            max: 50,
                            message: 'Độ dài tối đa 50 ký tự'
                        }]}>
                        <Input maxLength={50} />
                    </Form.Item>

                    <Form.Item name='phongBan' label='Phòng ban'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa chọn phòng của chuyên viên'
                        }]}>
                        <Select
                            onChange={handlePhongBanChange}>
                            {
                                phongBans?.map(item =>
                                    <Option
                                        value={item.maPhongBan}
                                        key={item.maPhongBan}
                                        id={item.id}
                                    >{item.maPhongBan}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name='chucDanh1' label='Chức danh 1'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa chọn chức danh cho chuyên viên'
                        }]}>
                        <Select disabled={disabledChucDanh}>
                            {
                                newChucDanhsList?.map(item =>
                                    <Option value={item.maChucDanh}
                                        key={item.id}>{item.tenChucDanh}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name='chucDanh2' label='Chức danh 2'>
                        <Select disabled={disabledChucDanh}>
                            {
                                newChucDanhsList?.map(item =>
                                    <Option value={item.maChucDanh}
                                        key={item.id}>{item.tenChucDanh}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name='matKhau' label='Mật khẩu'
                        rules={[{
                            required: true,
                            message: 'Mật khẩu của user chưa được nhập'
                        }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='trangThai' label='Trạng thái'
                        rules={[{
                            required: true,
                            message: 'Bắt buộc nhập trạng thái'
                        }]}>
                        <Select>
                            <Option value={1}>Hoạt động</Option>
                            <Option value={2}>Ngưng hoạt động</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name='ghiChu' label='Ghi chú (không bắt buộc)'>
                        <Input />
                    </Form.Item>

                    <div className={styles.formButtonGroup}>
                        <Button type='primary' htmlType='submit'>Lưu</Button>
                        <Button type='danger' onClick={closeModalCapNhat}>Đóng</Button>
                    </div>
                </Form>
            </Modal>

            {/* ==============================- Xóa ==============================- */}
            <Modal
                footer={false}
                visible={isVisibleModalXoa}
                closable={null}>
                <div className={styles.modalText}>
                    <Typography.Title level={3}>Xóa chuyên viên</Typography.Title>
                    <Typography.Text >Bạn muốn nhân viên: {selectRows[0]?.hoVaTen}</Typography.Text>
                </div>
                <div className={styles.formButtonGroup}>
                    <Button type='danger' htmlType='submit'
                        icon={<DeleteOutlined />}>Xóa</Button>
                    <Button
                        type='primary'
                        onClick={closeModalXoa}
                        icon={<CloseOutlined />}>Đóng</Button>
                </div>
            </Modal>
            {/* ==============================- MẬT KHẨU ==============================- */}
            <Modal
                visible={isVisibleModalCapNhatMK}
                footer={false}
                closable={null}>
                <Form name='updatePass' layout='vertical' form={capNhatMKForm}>
                    <Typography.Title level={2}>Cập nhật mật khẩu</Typography.Title>
                    <Typography.Text>Vui lòng nhập các trường bắt buộc</Typography.Text>
                    <Form.Item name='pass' label='Mật khẩu mới'>
                        <Input.Password hasfeefback />
                    </Form.Item>
                    <Form.Item name='re-pass' label='Nhập lại mật khẩu mới'>
                        <Input.Password hasfeefback />
                    </Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button type='primary'> Cập nhật</Button>
                        <Button type='danger' onClick={closeModalCapNhatMK}> Đóng</Button>
                    </div>
                </Form>
            </Modal>
        </div >
    )
}
DSChuyenVine.Layout = AdminLayout;
export default DSChuyenVine