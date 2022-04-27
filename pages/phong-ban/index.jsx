import React from 'react'
import AdminLayout from 'components/layout/admin';
import { Content } from 'antd/lib/layout/layout';
import { Affix, Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Table, Typography } from 'antd';
import styles from './phongban.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import { phongBanApi } from 'api-client';
const { Option } = Select
/* -------------------- TABLE -------------------- */
const columns = [
    {
        title: 'Mã phòng ban',
        dataIndex: 'maPhongBan'
    },
    {
        title: 'Tên phòng ban',
        dataIndex: 'tenPhongBan'
    },
    {
        title: 'Trạng thái',
        // dataIndex: 'trangThai',
        render: record => record.trangThai == 1 ? 'Hoạt động' : ' Ngưng hoạt động'
    },
    {
        title: 'Ghi chú',
        dataIndex: 'ghiChu'
    },
]

function PhongBan() {
    const [pages, setPages] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const { data, mutate } = useSWR(`/v1/PhongBans?PageNumber=${pages}&PageSize=${pageSize}`, {
        dedupingInterval: 6000, // sau 6s clear cache
        revalidateOnFocus: false, // quay lại tab cũ ko gọi api
        // ...PublicConfiguration,
    });

    const [listItems, setListItems] = useState([]); // root data
    const [dataList, setDataList] = useState([]); // display data
    /** ===================== GET DATA ===================== */
    useEffect(() => {
        setListItems(data?.data);
        setDataList(data?.data.reverse());
    }, [data?.data]);
    const newDataList = dataList?.map(item => { return { ...item, key: item.id } })
    const [selectKey, setSelectKey] = useState([]);
    const [selectRows, setSelectRows] = useState([])

    const [themForm] = Form.useForm()
    const [searchTearm, setSearchTerm] = useState('');
    const [capNhatForm] = Form.useForm()
    const [disableThemButton, setDisableThemButton] = useState(false)
    const [disableCapNhatButton, setDisableCapNhatButton] = useState(false)
    /* -------------------- SEARCH FILTER-------------------- */
    useEffect(() => {
        const temp = [];
        listItems?.filter((val) => {
            if (val.maPhongBan.toLowerCase().includes(searchTearm.toLowerCase())) {
                temp.push(val);
            }
            setDataList(temp);
        });
    }, [searchTearm]);

    /* -------------------- ROW SELECTIONS -------------------- */
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectRows(selectedRows)
            setSelectedRowKeys(selectedRowKeys);
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        selectedRowKeys,
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    /* -------------------- MODAL STATE -------------------- */
    const [isVisibleModalThem, setIsVisibleModalThem] = useState(false)
    const [isVisibleModalCapNhat, setIsVisibleModalCapNhat] = useState(false)
    const [isVisibleModalXoa, setIsVisibleModalXoa] = useState(false)

    /** ======================== VALIDATE ========================  */
    const [validateMaPhong, setValidateMaPhong] = useState(false)
    const [validateTenPhong, setValidateTenPhong] = useState(false)
    const [disableButtonSubmit, setDisableButtonSubmit] = useState(false)

    const [selectionType, setSelectionType] = useState('checkbox');

    /* -------------------- HADNLE MODAL -------------------- */

    /* -------------------- SHOW MODAL -------------------- */
    const showModalThem = () => {
        setIsVisibleModalThem(true)
    }
    const showModalCapNhat = () => {
        if (selectRows.length > 1 || selectRows.length < 1) {
            message.warning('Chỉ chọn 1 row để thực hiện')
            return
        }
        setIsVisibleModalCapNhat(true)
        capNhatForm.setFieldsValue({
            maPhongBan: selectRows[0].maPhongBan,
            tenPhongBan: selectRows[0].tenPhongBan,
            ghiChu: selectRows[0].ghiChu,
            trangThai: selectRows[0].trangThai
        })
    }
    const showModalXoa = () => {
        setIsVisibleModalXoa(true)
    }

    /* -------------------- HADNLE FORM -------------------- */
    const handleSubmitThemForm = async (values) => {
        const maPhongBan = themForm.getFieldValue('maPhongBan')
        if (!maPhongBan) {
            setValidateMaPhong(true)
            return
        }
        if (validateMaPhong) {
            setValidateMaPhong(true)
            return
        }
        const params = {
            maPhongBan: values.maPhongBan,
            tenPhongBan: values.tenPhongBan,
            trangThai: values.trangThai,
            ghiChu: values.ghiChu
        }
        const maPhong = dataList.find(item => item.maPhongBan == values.maPhongBan)
        // const tenPhong = dataList.find(item => item.tenPhongBan.toLowerCase() == values.tenPhongBan.toLowerCase())
        if (maPhong) {
            message.error('Mã phòng đã tồn tại!!!')
            return
        }
        try {
            // message.success('Thành công!!!')
            const res = await phongBanApi.createPhongBan(params)
            if (res.succeeded && res.data) {
                const newData = [...dataList, params]
                setDataList(newData)
                message.success('Thêm phòng ban thành công !!!!')
                themForm.resetFields()
                capNhatForm.resetFields()

            }
            else {
                message.error(res.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const hanldeBoChon = () => {
        setSelectedRowKeys([]);
        setSelectRows([]);
    };
    const handleSubmitCapNhatForm = async (values) => {

        const id = selectRows[0].id
        const params = {
            ...values,
            id
        }
        if (values.maPhongBan.length == 1) {
            setValidateMaPhong(true)
            return
        }
        if (validateMaPhong) {
            setValidateMaPhong(true)
            return
        }
        setValidateMaPhong(false)

        // const maPhong = dataList.find(item => item.maPhongBan == values.maPhongBan)
        // const tenPhong = dataList.find(item => item.tenPhongBan.toLowerCase() == values.tenPhongBan.toLowerCase())
        // if (maPhong) {
        //     message.error('Mã phòng đã tồn tại!!!')
        //     return
        // }
        // console.log(params)
        try {
            const res = await phongBanApi.updatePhongBan(params)
            if (res.succeeded && res.data) {
                setDataList(dataList.map(item => item.id == res.data ? { ...item, ...params } : item))
                message.success('Cập nhật phòng ban thành công !!!!')
                capNhatForm.resetFields()
                themForm.resetFields()
                hanldeBoChon()
                closeModalCapNhat()
            }
            else {
                message.warning(res.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleXoaPhongBan() {
        console.log('Xoa')
        const id = selectRows[0].id
        console.log(id)
        const params = {
            id,
            maPhongBan: selectRows[0].maPhongBan,
            tenPhongBan: selectRows[0].tenPhongBan,
            ghiChu: selectRows[0].ghiChu,
            trangThai: 2
        }
        try {
            const res = await phongBanApi.updatePhongBan(params)
            if (res.succeeded && res.data) {
                setDataList(dataList.map(item => item.id == res.data ? { ...item, ...params } : item))
                message.success('Xóa Phòng ban thành công!!!')
                closeModalXoa()
            }
        } catch (error) {
            console.log(error)
        }
    }

    /* -------------------- CLOSE MODAL -------------------- */
    const closeModalThem = () => {
        setIsVisibleModalThem(false)
        themForm.resetFields()
        capNhatForm.resetFields()
        setValidateMaPhong(false)
    }
    const closeModalCapNhat = () => {
        setIsVisibleModalCapNhat(false)
        setValidateMaPhong(false)
        capNhatForm.resetFields()
        themForm.resetFields()
    }
    const closeModalXoa = () => {
        setIsVisibleModalXoa(false)
    }

    function handleChangeMaPhong(values) {
        const val = values.target.value
        themForm.setFieldsValue({
            maPhongBan: val.replace(/[^0-9\,\.]/g, '').replace('.', '').replace(',', '').replace('-', '')
        })
        capNhatForm.setFieldsValue({
            maPhongBan: val.replace(/[^0-9\,\.\--]/g, '').replace('.', '').replace(',', '').replace('-', '')
        })
        if (val.length < 1) {
            setValidateMaPhong(false)
            return
        }
        if (val.length == 1) {
            setValidateMaPhong(true)
            return
        }
        if (val == '00') {
            setValidateMaPhong(true)
            return
        }
        setValidateMaPhong(false)
    }
    function handleChangeTenPhong(values) {
        const val = values.target.value
        // themForm.setFieldsValue({
        //     tenPhongBan: val.replace(/[^a-zA-Z]/g, '')
        // })

        // capNhatForm.setFieldsValue({
        //     tenPhongBan: val.replace(/[^a-zA-Z]/g, '')
        // })
    }
    function handleChangePageSize(page, pageSize) {
        setPages(page)
        setPageSize(pageSize)
    }
    return (
        <div>
            <Content className={styles.wrapperContent}>
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
                    <h2>Danh mục phòng ban</h2>
                    <Table
                        bordered
                        rowKey="key"
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={newDataList}
                        pagination={{
                            total: data?.recordsTotal,
                            onChange: handleChangePageSize,
                            size: 'small',
                            defaultPageSize: '10',
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30'],
                        }}
                    />
                </div>
            </Content>
            <Affix className={styles.affixConfig}>
                <Row justify='center'>
                    <Col span={16} className={styles.affixButtonGroup}>
                        {
                            !selectRows.length ?
                                <Button type='danger'>
                                    <Link href='/'>
                                        <a>
                                            Đóng
                                        </a>
                                    </Link>
                                </Button>
:
<>
                                <Button
                                    onClick={showModalCapNhat}
                                    icon={<EditOutlined />}>Cập nhật</Button>

                                <Button
                                    type='danger'
                                    onClick={showModalXoa}
                                    icon={<DeleteOutlined />}
                                >Xóa</Button>
                            </>
                        }
                    </Col>
                </Row>
            </Affix>
            {/* ================== MODAL THÊM ================== */}
            <Modal
                visible={isVisibleModalThem}
                footer={false}
                closable={null}>
                <Form
                    name='themForm'
                    onFinish={handleSubmitThemForm}
                    layout='vertical'
                    initialValues={{
                        trangThai: 1
                    }}
                    form={themForm}>
                    <div className={styles.modalTitle}>
                        <Typography.Title level={3}>Thêm phòng ban</Typography.Title>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Form.Item name='maPhongBan' label='Mã phòng ban'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập mã phòng ban!!!!'
                                }
                            ]}
                        >
                            <Input maxLength={2} onChange={e => handleChangeMaPhong(e)} />
                        </Form.Item>
                        {validateMaPhong &&
                            <p style={{ color: 'red', position: 'absolute', top: '100%', left: 0 }}>Mã phòng ban không hợp lệ!!!</p>}
                    </div>
                    <Form.Item name='tenPhongBan' label='Tên phòng ban'
                        rules={[{
                            required: true,
                            message: 'Nhập tên phòng ban!!!!'
                        }]}>
                        <Input maxLength={1000} onChange={e => handleChangeTenPhong(e)} />
                    </Form.Item>

                    <Form.Item name='ghiChu' label='Ghi chú'>
                        <Input maxLength={2000} />
                    </Form.Item>

                    <Form.Item name='trangThai' label='Trạng thái'>
                        <Select>
                            <Option value={1}>Hoạt động</Option>
                            <Option value={2}>Ngưng hoạt động</Option>
                        </Select>
                    </Form.Item>

                    <div className={styles.formButtonGroup}>
                        <Button htmlType='submit' disabled={disableThemButton}>Thêm</Button>
                        <Button type='danger' onClick={closeModalThem}>Đóng</Button>
                    </div>
                </Form>
            </Modal>

            {/* ================== MODAL CẬP NHẬT ================== */}
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
                        <Typography.Title level={3}>Cập nhật phòng ban</Typography.Title>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Form.Item className={styles.formItem} name='maPhongBan' label='Mã phòng ban'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập mã phòng ban!!!'
                                }
                            ]}
                        >
                            <Input disabled style={{ color: '#000' }} maxLength={2} onChange={e => handleChangeMaPhong(e)} />
                        </Form.Item>
                        {validateMaPhong &&
                            <p style={{ color: 'red', position: 'absolute', top: '95%', left: 0 }}>Mã phòng không hợp lệ</p>}
                    </div>
                    <Form.Item className={styles.formItem} name='tenPhongBan' label='Tên phòng ban'
                        rules={[{
                            required: true,
                            message: 'Nhập tên phòng ban!!!!'
                        }]}>
                        <Input maxLength={1000} onChange={e => handleChangeTenPhong(e)} />
                    </Form.Item>

                    <Form.Item className={styles.formItem} name='ghiChu' label='Ghi chú'>
                        <Input maxLength={2000} />
                    </Form.Item>
                    <Form.Item name='trangThai' label='Trạng thái'>
                        <Select>
                            <Option value={1}>Hoạt động</Option>
                            <Option value={2}>Ngưng hoạt động</Option>
                        </Select>
                    </Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button htmlType='submit' disabled={disableCapNhatButton}>Cập nhật</Button>
                        <Button type='danger' onClick={closeModalCapNhat}>Đóng</Button>
                    </div>
                </Form>
            </Modal>

            {/* ================== MODAL XÓA ================== */}
            <Modal
                footer={false}
                visible={isVisibleModalXoa}
                closable={null}>
                <div className={styles.modalText}>
                    <Typography.Title level={3}>Xóa phòng ban</Typography.Title>
                    <Typography.Text >Bạn muốn xóa phòng: {selectRows[0]?.tenPhongBan}</Typography.Text>
                </div>
                <div className={styles.formButtonGroup}>

                    <Button
                        onClick={closeModalXoa}
                        icon={<CloseOutlined />}>Đóng</Button>
                    <Button type='danger' htmlType='submit'
                        onClick={handleXoaPhongBan}
                        icon={<DeleteOutlined />
                        }>Xóa</Button>
                </div>
            </Modal>
        </div >
    )
}
PhongBan.Layout = AdminLayout;
export default PhongBan