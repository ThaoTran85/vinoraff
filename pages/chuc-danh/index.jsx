import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Affix, Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Table, Typography } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { chucDanhApi, phongBanApi } from 'api-client';
import AdminLayout from 'components/layout/admin';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './chucdanh.module.css';
const { Option } = Select

/* ====================== TABLE ====================== */
const columns = [
    {
        title: 'Mã phòng ban',
        dataIndex: 'maPhongBan',
        key: '1',
        sorter: (a, b) => a.maPhongBan - b.maPhongBan,

    },
    {
        title: 'Tên phòng ban',
        dataIndex: 'tenPhongBan',
        key: '2'

    },
    {
        title: 'Mã chức danh',
        dataIndex: 'maChucDanh',
        key: '3',
    },
    {
        title: 'Tên chức danh',
        dataIndex: 'tenChucDanh',
        key: '4',
    },
    {
        title: 'Trạng thái',
        render: record => record?.trangThai == 1 ? 'Hoạt động' : 'Ngưng hoạt động',
        key: '5'

    },
    {
        title: 'Ghi chú',
        dataIndex: 'ghiChu',
        key: '6'

    },
]

function ChucDanh() {
    const [pages, setPages] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const { data, mutate } = useSWR(`/v1/ChucDanhs?PageNumber=${pages}&PageSize=${pageSize}`, {
        dedupingInterval: 6000, // sau 6s clear cache
        revalidateOnFocus: false, // quay lại tab cũ ko gọi api
        // ...PublicConfiguration,
    });

    const [listItems, setListItems] = useState([]); // root data
    const [dataList, setDataList] = useState([]); // display data
    const [phongBans, setPhongBans] = useState([])
    const [phongBanIds, setPhongBanId] = useState([])
    const [tenPhongBan, setTenPhongBan] = useState([])
    const [maPhongBan, setMaPhongBan] = useState([])
    const getPhongBans = async () => {
        try {
            const res = await phongBanApi.getPhongBan()
            if (res.succeeded && res.data) {
                setPhongBans(res.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    /** ====================== GET DATA ====================== */
    useEffect(() => {
        setListItems(data?.data);
        setDataList(data?.data.reverse());
    }, [data]);
const newDataList = dataList?.map(item => {return {...item, key: item.id}})
    useEffect(() => {
        getPhongBans()
    }, [data])

    const [selectRows, setSelectRows] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [themForm] = Form.useForm()
    const [xemForm] = Form.useForm()
    const [capNhatForm] = Form.useForm()
    const [searchTearm, setSearchTerm] = useState('');

    /* ====================== SEARCH ====================== */
    useEffect(() => {
        const temp = [];
        listItems.filter((val) => {
            if (val?.tenChucDanh.toLowerCase().includes(searchTearm.toLowerCase())) {
                temp.push(val);
            }
            setDataList(temp);
        });
    }, [searchTearm]);

    /* ====================== ROW SELECTIONS ====================== */
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectRows(selectedRows)
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        selectedRowKeys,
        getCheckboxProps: (record) => ({
            disabled: record?.name === 'Disabled User',
            // Column configuration not to be checked
            name: record?.name,
        }),
    };

    /* ====================== MODAL STATE ====================== */
    const [isVisibleModalThem, setIsVisibleModalThem] = useState(false)
    const [isVisibleModalXem, setIsVisibleModalXem] = useState(false)
    const [isVisibleModalCapNhat, setIsVisibleModalCapNhat] = useState(false)
    const [isVisibleModalXoa, setIsVisibleModalXoa] = useState(false)

    /* ======================SHOW MODAL ======================*/
    const showModalThem = () => {
        setIsVisibleModalThem(true)
    }
    const showModalXem = () => {
        if (selectRows.length > 1 || selectRows.length < 1) {
            message.warning('Chỉ chọn 1 dòng để thực hiện!!!!')
            return
        }
        setIsVisibleModalXem(true)
        xemForm.setFieldsValue({
            ghiChu: selectRows[0].ghiChu,
            maChucDanh: selectRows[0].maChucDanh,
            tenChucDanh: selectRows[0].tenChucDanh,
            maPhongBan: selectRows[0].maPhongBan,
            tenPhongBan: selectRows[0].tenPhongBan,
            trangThai: selectRows[0].trangThai,
        })
    }

    const showModalCapNhat = () => {
        if (selectRows.length > 1 || selectRows.length < 1) {
            message.warning('Chỉ chọn 1 dòng để thực hiện!!!!')
            return
        }
        setIsVisibleModalCapNhat(true)
        capNhatForm.setFieldsValue({
            ghiChu: selectRows[0].ghiChu,
            maChucDanh: selectRows[0].maChucDanh,
            tenChucDanh: selectRows[0].tenChucDanh,
            maPhongBan: selectRows[0].maPhongBan,
            tenPhongBan: selectRows[0].tenPhongBan,
            trangThai: selectRows[0].trangThai,
        })
    }

    const showModalXoa = () => {
        if (selectRows.length > 1 || selectRows.length < 1) {
            message.warning('Chỉ chọn 1 dòng để thực hiện!!!!')
            return
        }
        setIsVisibleModalXoa(true)
    }

    /* ====================== HADNLE FORM ======================*/
    const handleSubmitThemForm = async (values) => {
        console.log(values.maChucDanh.slice(0, 2))
        const maCD = values.maChucDanh.slice(0, 2)
        const maPhongBan = values.maPhongBan
        if (maCD != maPhongBan) {
            message.error('Mã chức danh = mã phòng ban + số thự tự')
            return
        }
        // const params = {
        //     phongBanId: phongBanIds,
        //     maChucDanh: values.maChucDanh,
        //     tenChucDanh: values.tenChucDanh,
        //     ghiChu: values.ghiChu,
        //     trangThai: 1
        // }
        const formData = new FormData()
        formData.append('phongBanId', phongBanIds)
        formData.append('maChucDanh', values.maChucDanh)
        formData.append('tenChucDanh', values.tenChucDanh)
        formData.append('ghiChu', values.ghiChu || '')
        formData.append('trangThai', values.trangThai)
        try {
            console.log(values);
            const res = await chucDanhApi.createChucDanhFormData(formData)
            if (res.succeeded && res.data) {
                const newData = [...dataList, { ...values, tenPhongBan, maPhongBan, trangThai: 1 }]
                setDataList(newData)
                // setDataList(newData)
                message.success('Thêm chức danh thành công!!!')
                themForm.resetFields()
                closeModalThem()
            }
            else {
                message.error(res.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmitCapNhatForm = async (values) => {
        const maCD = values.maChucDanh.slice(0, 2)
        const maPhongBan = values.maPhongBan
        if (maCD != maPhongBan) {
            message.error('Mã chức danh = mã phòng ban + số thự tự')
            return
        }
        const id = selectRows[0].id
        const tenPhongBan = selectRows[0].tenPhongBan
        // const phongBanId = selectRows[0].phongBanId
        const params = {
            ...values,
            id,
            maPhongBan,
            tenPhongBan,
            trangThai: values.trangThai
        }
        const formData = new FormData()
        formData.append('id', id)
        formData.append('maChucDanh', values.maChucDanh)
        formData.append('tenChucDanh', values.tenChucDanh)
        formData.append('ghiChu', values.ghiChu || '')
        formData.append('trangThai', values.trangThai)
        formData.append('maPhongBan', maPhongBan)
        try {
            const res = await chucDanhApi.updateChucDanhFormData(formData, id)
            if (res.succeeded && res.data) {
                console.log(res.data);
                message.success('Cập nhật thành công!!!')
                closeModalCapNhat()
                capNhatForm.resetFields()
                setDataList(dataList.map(item => item.id == res.data ? { ...item, ...params } : item))
                hanldeBoChon()

                // clearTimeout(id)
            }
            else {
                message.error(res.message)
            }
        } catch (error) {
            console.log(error)
        }

    }

    function handleMaPhongBan(value, option) {
        const phongBanId = option.id
        const tenPhongBan = option.children
        const maPhongBan = option.value
        themForm.setFieldsValue({ maPhongBan: maPhongBan })
        setPhongBanId(phongBanId)
        setTenPhongBan(tenPhongBan)
        setMaPhongBan(maPhongBan)
    }
    /* ====================== CLOSE MODAL ======================*/
    const closeModalThem = () => {
        setIsVisibleModalThem(false)
        themForm.resetFields()
    }
    const closeModalXem = () => {
        setIsVisibleModalXem(false)
    }
    const closeModalCapNhat = () => {
        setIsVisibleModalCapNhat(false)
        capNhatForm.resetFields()
    }
    const closeModalXoa = () => {
        setIsVisibleModalXoa(false)
    }
    const hanldeBoChon = () => {
        setSelectedRowKeys([]);
        setSelectRows([]);
    };
    const [selectionType, setSelectionType] = useState('checkbox');
    const changeMaChucDanhCNForm = (e) => {
        themForm.setFieldsValue({ maChucDanh: e.replace(/[^0-9]/g, '') })
        capNhatForm.setFieldsValue({ maChucDanh: e.replace(/[^0-9]/g, '') })
    }
    const handlePageChange = (page, pageSize) => {
        setPageSize(pageSize)
        setPages(page)
    }
    return (
        <div>
            <Content className={styles.wrapperContent}>
                <div className={styles.searchWrapper}>
                    <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={showModalThem}
                    >
                        Tạo mới
                    </Button>
                </div>
                <div className={styles.tableWrapper}>
                    <h2>Danh mục chức danh</h2>
                    <Table
                        rowKey="id"

                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={newDataList}
                        pagination={{
                            total: data?.recordsTotal,
                            onChange: handlePageChange,
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
                                        onClick={showModalXem}
                                        icon={<EditOutlined />}>Xem</Button>
                                    <Button
                                        onClick={showModalCapNhat}
                                        icon={<EditOutlined />}>Cập nhật</Button>
                                </>

                        }
                    </Col>
                </Row>
            </Affix>
            {/* ====================== MODAL THÊM ====================== */}
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
                    <div className={styles.formTitle}>
                        <Typography.Title level={3}>Thêm chức danh</Typography.Title>
                    </div>
                    <Form.Item name='maPhongBan' label='Mã phòng ban'
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item name='tenPhongBan' label='Tên phòng ban'
                        rules={[{
                            required: true,
                            message: 'Phải chọn phòng ban'
                        }]}>
                        <Select
                            onChange={handleMaPhongBan}>
                            {phongBans?.length > 0 &&
                                phongBans.map(item =>
                                    <Option key={item.maPhongBan}
                                        value={item.maPhongBan}
                                        id={item.id}
                                    >{item.tenPhongBan}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name='maChucDanh' label='Mã chức danh'
                        rules={[{
                            required: true,
                            message: 'Phải nhập mã chức danh',
                        },
                        {
                            min: 4,
                            message: 'Mã chức danh gồm 4 kí tự'
                        }]}>
                        <Input maxLength={5} className={styles.formItemInput} onChange={e => changeMaChucDanhCNForm(e.target.value)} />
                    </Form.Item>

                    <Form.Item name='tenChucDanh' label='Tên chức danh'
                        rules={[{
                            required: true,
                            message: 'Phải nhập tên chức danh'
                        },
                        {
                            max: 1000,
                            message: 'Chỉ được nhập 1000 kí tự!!!'
                        }]}>

                        <Input maxLength={1000} />
                    </Form.Item>

                    <Form.Item name='trangThai' label='Trạng thái'>
                        <Select>
                            <Option value={1}>Hoạt động</Option>
                            <Option value={2}>Ngưng hoạt động</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name='ghiChu' label='Ghi chú (Không bắt buộc)'
                        rules={[
                            {
                                max: 1000,
                                message: 'Chỉ được nhập 1000 kí tự!!!'
                            }]}>
                        <Input maxLength={1000} />
                    </Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button type='primary' htmlType='submit'>Thêm</Button>
                        <Button type='danger' onClick={closeModalThem}>Đóng</Button>
                    </div>
                </Form>
            </Modal>
            {/* ====================== MODAL XEM ====================== */}
            <Modal visible={isVisibleModalXem}
                footer={false}
                closable={null}
            >
                <Form
                    name='xemForm'
                    layout='vertical'
                    form={xemForm}>
                    <div className={styles.formTitle}>
                        <Typography.Title level={3}>Chức danh</Typography.Title>
                    </div>
                    <Form.Item name='maPhongBan' label='Mã phòng ban'
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item className={styles.formItem} name='tenPhongBan' label='Tên phòng ban'
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item name='maChucDanh' label='Mã chức danh'
                    >
                        <Input disabled maxLength={5} style={{ width: '100%' }}/>
                    </Form.Item>
                    <Form.Item name='tenChucDanh' label='Tên chức danh'
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name='trangThai' label='Trạng thái'>
                        <Select disabled>
                            <Option value={1}>Hoạt động</Option>
                            <Option value={2}>Ngưng hoạt động</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item className={styles.formItem} name='ghiChu' label='Ghi chú (Không bắt buộc)'
                        rules={[{
                            max: 2000,
                            message: 'Nhập tối đa 2000 kí tự'
                        }]}>
                        <Input disabled maxLength={2000} />
                    </Form.Item>
                    <div style={{ display: 'flex', marginTop: 20 }}>
                        <Button type='danger' onClick={closeModalXem} style={{ width: '100%' }}>Đóng</Button>
                    </div>
                </Form>
            </Modal>
            {/* ====================== MODAL CẬP NHẬT====================== */}
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
                        <Typography.Title level={3}>Cập nhật chức danh</Typography.Title>
                    </div>
                    <Form.Item name='maPhongBan' label='Mã phòng ban'
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item className={styles.formItem} name='tenPhongBan' label='Tên phòng ban'
                        rules={[
                            {
                                required: true,
                                message: 'Nhập tên phòng ban!!!'
                            }
                        ]}>
                        <Input disabled />
                    </Form.Item>

                    <Form.Item name='maChucDanh' label='Mã chức danh'
                        rules={[
                            {
                                required: true,
                                message: 'Nhập mã chức danh!!!'
                            },
                            {
                                min: 4,
                                message: 'Mã chức danh gồm 4,5 kí tự'
                            }
                        ]}>
                        <Input maxLength={5} style={{ width: '100%' }} onChange={e => changeMaChucDanhCNForm(e.target.value)}/>
                    </Form.Item>
                    <Form.Item name='tenChucDanh' label='Tên chức danh'
                        rules={[
                            {
                                required: true,
                                message: 'Nhập tên chức danh!!!'
                            }
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='trangThai' label='Trạng thái'>
                        <Select >
                            <Option value={1}>Hoạt động</Option>
                            <Option value={2}>Ngưng hoạt động</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item className={styles.formItem} name='ghiChu' label='Ghi chú (Không bắt buộc)'>
                        <Input />
                    </Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button type='primary' htmlType='submit'>Cập nhật</Button>
                        <Button type='danger' onClick={closeModalCapNhat}>Đóng</Button>
                    </div>
                </Form>
            </Modal>

            {/* ====================== MODAL XÓA====================== */}
            <Modal
                footer={false}
                visible={isVisibleModalXoa}
                closable={null}>
                <div className={styles.modalText}>
                    <Typography.Title level={3}>Xóa chức danh</Typography.Title>
                    <Typography.Text >Bạn muốn chức danh: {selectRows[0]?.tenChucDanh}</Typography.Text>
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
        </div >
    )
}
ChucDanh.Layout = AdminLayout;
export default ChucDanh