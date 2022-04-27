import {
    AuditOutlined, CloseOutlined, DeleteOutlined,
    EditOutlined, EyeOutlined, FundOutlined, PlusOutlined,
    PrinterOutlined, SaveOutlined, SearchOutlined
} from '@ant-design/icons';
import {
    Affix,

    Button,
    Col, DatePicker, Form,
    Input,
    Layout,
    message,
    Modal, Row,
    Select, Space, Table, Typography
} from 'antd';
import 'antd/dist/antd.css';
import { chungthuApi, phieuYeuCauApi, tinhThanhApi } from 'api-client';
import AdminLayout from 'components/layout/admin';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './dschungthu.module.css';

const { Content } = Layout;
const { Option } = Select;

/** ********************** TABLE ********************** */
const columns = [
    {
        title: 'Số Chứng Thư hệ thống',
        dataIndex: 'soChungThu',
        key: 1,
    },
    {
        title: 'Ngày tạo chứng thư',
        dataIndex: 'ngayTao',
        key: 2,
        render: (text, record, index) => moment(record.ngayTao).format('DD/MM/YYYY'),
    },
    {
        title: 'Số chứng thư ban hành',
        dataIndex: 'soChungThu',
        key: 3
    },
    {
        title: 'Ngày chứng thư ban hành',
        dataIndex: 'createdTime',
        render: (text, record, index) => moment(record.createdTime).format('DD/MM/YYYY'),
        key:4
    },
    {
        title: 'Loại Tài Sản',
        dataIndex: 'ngayTao',
        key: 5,
    },
    {
        title: 'Tên Khách Hàng',
        dataIndex: 'ngayTao',
        key: 6,
    },
    {
        title: 'Số PYC',
        dataIndex: 'ngayTao',
        key: 7,
    },
    {
        title: 'Mã báo cáo',
        dataIndex: 'ngayTao',
        key: 8,
    },
    {
        title: 'Tổng giá trị thẩm định',
        dataIndex: 'ngayTao',
        key: 9,
    },
    {
        title: 'Nhân viên thẩm định',
        dataIndex: 'ngayTao',
        key: 10,
    },
    {
        title: 'Người tạo',
        dataIndex: 'ngayTao',
        key: 11,
    },
    {
        title: 'Trạng thái chứng thư',
        dataIndex: 'ngayTao',
        key: 12,
    },
    {
        title: 'Lý do hủy',
        dataIndex: 'ngayTao',
        key: 13,
    },
    {
        title: 'Ghi chú',
        dataIndex: 'ngayTao',
        key: 12,
    },



];

function DSChungThu() {
    const [actionForm] = Form.useForm();
    const [suaChungThuForm] = Form.useForm()
    const [themChungThuForm] = Form.useForm()
    const [pheDuyetForm] = Form.useForm()
    const { data, mutate } = useSWR(
        `/v1/ChungThus`,
        {
            dedupingInterval: 5000, // sau 5s clear cache
            revalidateOnFocus: false, // quay lại tab cũ ko gọi api
            // ...PublicConfiguration,
        }
    );
    const formatDate = 'DD/MM/YYYY'
    const [listItems, setListItems] = useState([]); // root data
    const [dataList, setDataList] = useState([]); // display data
    const [searchTearm, setSearchTerm] = useState('');
    const [editing, setEditing] = useState(null);
    // const [titleModal, setTitleModal] = useState('Phê duyệt');

    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [selectKey, setSelectKey] = useState([]);
    const [selectRow, setSelectRow] = useState([]);
    const [sortValue, setSortValue] = useState(false);
    const [pycs, setPycs] = useState([])
    useEffect(() => {
        setListItems(data?.data);
        setDataList(data?.data.reverse());
    }, [data]);
const newDataList = dataList?.map(item => {return {...item, key: item.id}})
console.log(newDataList)
    const getPYCs = async () => {
        try {
            const res = await phieuYeuCauApi.getPYC()
            if (res.succeeded && res.data) {
                setPycs(res.data)
            }
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        getPYCs()
    }, [])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectKey(selectedRowKeys);
            setSelectRow(selectedRows);
            console.log('selectedRows', selectedRows)
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    // search filter
    useEffect(() => {
        const temp = [];
        listItems.filter((val) => {
            if (val.soChungThu.toLowerCase().includes(searchTearm.toLowerCase())) {
                temp.push(val);
            }
            setDataList(temp);
        });
    }, [searchTearm]);

    // useEffect(() => {
    //     const temp = [];
    //     const delayDebounceFn = setTimeout(() => {
    //         listItems.filter((val) => {
    //             if (val.tenTinhThanhPho.toLowerCase().includes(searchTearm.toLowerCase())) {
    //                 temp.push(val);
    //             }
    //             setDataList(temp);
    //         });
    //     }, 400);

    //     // return () => clearTimeout(delayDebounceFn);
    // }, [searchTearm]);


    /** ======================== VISIBLE MODAL ========================  */
    const [isVisibleModalPheDuyet, setIsVisibleModalPheDuyet] = useState(false);
    const [isVisibleModalSuaChungThu, setIsVisibleModalSuaChungThu] = useState(false)
    const [isVisibleModalThem, setIsVisibleModalThem] = useState(false)
    const [isVisibleModalIn, setIsVisibleModalIn] = useState(false)
    const [isModalHuyChungThuVisible, setIsModalHuyChungThuVisible] = useState(false);

    /** ======================== SHOW MODAL ========================  */
    const showModalDelete = () => {
        if (selectRow.length > 1) {
            message.warning('Chỉ chọn 1 dòng để xóa');
            return;
        }
        if (selectRow.length < 1) {
            message.warning('Chọn 1 dòng cần xóa');
            return;
        }
        setIsModalDelete(true);
    };

    const showModalSuaChungThu = () => {
        if (selectRow.length > 1) {
            message.warning('Chỉ chọn 1 dòng để cập nhật');
            return;
        }
        setIsVisibleModalSuaChungThu(true)
        suaChungThuForm.setFieldsValue({
            trangThai: selectRow[0].trangThai,
            phieuYeuCauId: selectRow[0].phieuYeuCauId,
            ngayTao: moment(selectRow[0].ngayTao),
        })
    }

    const showModalThem = () => {
        setIsVisibleModalThem(true)
    }
    const showModalPheDuyet = () => {
        if (selectRow.length > 1 || selectRow.length < 1) {
            message.warning('Chỉ chọn 1 dòng để thao tác!!!')
            return
        }
        setIsVisibleModalPheDuyet(true)
        pheDuyetForm.setFieldsValue({
            trangThai: selectRow[0].trangThai
        })
    }
    const showModalIn = () => {
        setIsVisibleModalIn(true)
    }

    /** ======================== CLOSE MODAL ========================  */
    const closeModalPheDuyet = () => {
        setIsVisibleModalPheDuyet(false)
    };

    const closelHuyChungThu = () => {
        setIsModalHuyChungThuVisible(false)
    };

    const closelModalSuaChungThu = () => {
        setIsVisibleModalSuaChungThu(false)
    }

    const closeModalThem = () => {
        setIsVisibleModalThem(false)
    }
    const closeModalIn = () => {
        setIsVisibleModalIn(false)
    }

    /** ======================== SUBMIT FORM ========================  */
    const onFinishPheDuyet = (values) => {
        console.log(values)
    }

    const handleSubmitThemChungThu = async (values) => {
        const params = {
            phieuYeuCauId: values.phieuYeuCauId,
            ngayTao: values.ngayTao,
            soChungThu: values.soChungThu,
            trangThai: 1,
            createdBy: 'admin'
        }
        try {
            const res = await chungthuApi.createChungThus(params)
            if (res.succeeded && res.data) {
                console.log(res.data)
                const newData = {
                    ...params,
                    key: res.data.phieuYeuCauId,
                }
                message.success('Thêm chứng thư thành công!!!!')
                themChungThuForm.resetFields()
                setDataList([...dataList, newData])
            }
        } catch (error) {
            console.log(error)
        }
        console.log(params)

    }
    const handleSubmitSuaChungThuForm = (values) => {
        console.log(values)
    }

    const handleHuyChungThu = () => {
        setIsModalHuyChungThuVisible(true)
    };

    //select ant
    function handleChangeSelect(value) {
        setSortValue(value);
    }

    const [selectionType, setSelectionType] = useState('checkbox');

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
                    <h2>Danh sách chứng thư</h2>
                    <Table
                        rowKey="key"
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={newDataList}
                        pagination={{
                            size: 'small',
                            defaultPageSize: '10',
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30'],
                        }}
                    />
                </div>
            </Content>

            {selectKey.length > 0 &&
                <Affix offsetBottom={0}>
                    <div className={styles.affixButtonGroup}>
                        {
                            selectRow[0].trangThai !== 1 &&
                            <Button
                                icon={<EyeOutlined />}>
                                Xem
                            </Button>
                        }
                        <Button
                            icon={<EditOutlined />}
                            onClick={showModalSuaChungThu}
                        >
                            Sửa
                        </Button>
                        <Button
                            icon={<FundOutlined />}
                        >
                            Gửi Phê Duyệt
                        </Button>

                        <Button
                            icon={<AuditOutlined />}
                            onClick={showModalPheDuyet}
                        >
                            Phê Duyệt
                        </Button>
                        {
                            selectRow[0].trangThai !== 1 &&
                            <Button
                                icon={<PrinterOutlined />}
                                onClick={handleIn}
                            >
                                In chứng thư
                            </Button>
                        }
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={handleHuyChungThu}
                        >
                            Hủy chứng thư
                        </Button>
                    </div>
                </Affix>
            }
            {/** ======================== MODAL THÊM ======================== */}
            <Modal
                visible={isVisibleModalThem}
                footer={false}
                closable={null}>
                <Form name='themForm' form={themChungThuForm} layout='vertical' onFinish={handleSubmitThemChungThu}
                    initialValues={
                        {
                            ngayTao: moment(new Date().getTime())
                        }
                    }>
                    <div className={styles.formTitle}>
                        <h2>Thêm Chứng Thư</h2>
                        <p>Nhập các thông tin bắt buộc</p>
                    </div>
                    <Form.Item name='phieuYeuCauId' label='Số phiếu'
                        rules={[
                            {
                                required: true,
                                message: 'Phải nhập số phiếu'
                            }
                        ]}>
                        <Select>
                            {pycs.map(item => {
                                const { id, soPhieuYeuCau } = item
                                return <Option value={id} key={id}>{soPhieuYeuCau}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name='ngayTao' label='Ngày tạo'>
                        <DatePicker format={formatDate} />
                    </Form.Item>
                    <Form.Item name='soChungThu' label='Số chứng thư' rules={[
                        {
                            required: true,
                            message: 'Phải nhập số chứng thư'
                        }
                    ]}>
                        <Input />
                    </Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button htmlType='submit'>Thêm</Button>
                        <Button type='danger' onClick={closeModalThem}>Đóng</Button>
                    </div>
                </Form>
            </Modal>

            {/** ======================== MODAL PHÊ DUYỆT ======================== */}
            <Modal
                visible={isVisibleModalPheDuyet}
                footer={false}
                closable={false}
                onFinsh={onFinishPheDuyet}
                className={styles.modalSetting}
            >
                <Form
                    form={pheDuyetForm}
                    name="pheduyetForm"
                    onFinish={onFinishPheDuyet}
                    layout='vertical'
                >
                    <div className={styles.titleModal}>
                        <Typography.Title>Phê Duyệt</Typography.Title>
                        <Typography.Text>Vui lòng điền đầy đủ các trường bắt buộc</Typography.Text>
                    </div>
                    <Form.Item
                        label="Trạng Thái"
                        name="trangThai"
                    >
                        <Select>
                            <Option value={1}>Phê duyệt</Option>
                            <Option value={2}>Chưa Phê duyệt</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label='Ghi chú'
                        name="ghiChu"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập',
                            }
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Vui lòng nhập"
                            size="large"
                        />
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            <div>Lưu lại</div>
                        </Button>
                        <Button
                            type="danger"
                            onClick={closeModalPheDuyet}
                        >
                            <div>Đóng</div>
                        </Button>
                    </div>
                </Form>
            </Modal>
            {/** ======================== MODAL SỬA ======================== */}
            <Modal
                visible={isVisibleModalSuaChungThu}
                footer={false}
                closable={null}>
                <Form
                    name='suaChungThu'
                    layout='vertical'
                    form={suaChungThuForm}
                    onFinish={handleSubmitSuaChungThuForm}
                    className={styles.formContent}>
                    <div className={styles.formTitle}>
                        <h2>Sửa Chứng Thư</h2>
                        <p>Vui lòng nhập các trường bắt buộc</p>
                    </div>
                    <Form.Item name='ngayTao' label='Ngày Tạo'>
                        <DatePicker className={styles.formItemDatePicker} disabled />
                    </Form.Item>
                    <Form.Item name='phieuYeuCauId' label='Số phiếu yêu cầu'>
                        <Input className={styles.formItemInput} disabled />
                    </Form.Item>
                    <Form.Item name='trangThai' label='Trạng thái'>
                        <Select className={styles.formItemSelect}>
                            <Select.Option value={1}>Khởi tạo</Select.Option>
                            <Select.Option value={2}>Đang xử lý</Select.Option>
                        </Select>
                    </Form.Item>

                    <div className={styles.formButtonGroup}>
                        <Button htmlType='submit'
                            icon={<SaveOutlined />}>Lưu</Button>

                        <Button >Gửi phê duyệt</Button>
                        <Button
                            type='danger'
                            icon={<CloseOutlined />}
                            onClick={closelModalSuaChungThu}
                        >Đóng</Button>
                    </div>
                </Form>
            </Modal>
            {/** ======================== MODAL HỦY ======================== */}
            <Modal
                visible={isModalHuyChungThuVisible}
                footer={false}
                className={styles.modalSetting}
                closable={null}
            >
                <Form
                    form={actionForm}
                    name="huyChungThuForm"
                    layout='vertical'
                >
                    <div className={styles.titleModal}>
                        <Typography.Title>Hủy Chứng Thư</Typography.Title>
                        <Typography.Text>Vui lòng điền đầy đủ các trường bắt buộc</Typography.Text>
                    </div>

                    <Form.Item
                        label='Ghi chú'

                        name="ghiChu"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập',
                            },
                            {
                                min: 2,
                                message: 'Ít nhất 2 ký tự!',
                            },
                            {
                                max: 255,
                                message: 'Tối đa 255 ký tự!',
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Vui lòng nhập"
                            size="large"
                        />
                    </Form.Item>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            <div>Lưu lại</div>
                        </Button>
                        <Button
                            type="danger"
                            onClick={closelHuyChungThu}
                        >
                            <div>Đóng</div>
                        </Button>
                    </div>
                </Form>
            </Modal>
            {/** ======================== MODAL IN ======================== */}
            <Modal
                visible={isVisibleModalIn}
                footer={false}
                closable={false}

                onFinsh={onFinishPheDuyet}
                className={styles.modalSetting}
            >
                <Form
                    form={actionForm}
                    name="pheduyetForm"
                    initialValues={{ remember: true }}
                    onFinish={onFinishPheDuyet}
                    autoComplete="off"
                >
                    <div className={styles.titleModal}>
                        <Typography.Title>In Tài Liệu</Typography.Title>
                        <Typography.Text>Bạn có chắc muốn in tài liệu ...</Typography.Text>
                    </div>

                    <Space className={styles.btn__group}>
                        <Button
                            style={{ width: 190 }}
                            type="primary"
                            htmlType="submit"
                        // onClick={handleCancelIn}
                        >
                            In
                        </Button>
                        <Button
                            style={{ width: 190 }}
                            type="danger"
                        // onClick={handleCancelIn}

                        >
                            <div>Hủy bỏ</div>
                        </Button>
                    </Space>
                </Form>
            </Modal>
        </div >
    );
}

DSChungThu.Layout = AdminLayout;
export default DSChungThu;
