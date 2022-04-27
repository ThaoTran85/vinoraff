import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    PrinterOutlined,
    CaretRightOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import {
    Affix,
    Button,
    Col,
    Form,
    Input,
    Layout,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Typography,
    Collapse,
} from 'antd';
import 'antd/dist/antd.css';
import { tinhThanhApi } from 'api-client';
import AdminLayout from 'components/layout/admin';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './tinhthanh.module.css';

const { Content } = Layout;
const { Option } = Select;
const { Panel } = Collapse;

function TinhThanh() {
    const [actionForm] = Form.useForm();
    const [searchForm] = Form.useForm();

    const { data, mutate } = useSWR(
        `/v1/TinhThanhPhos?PageNumber=${1}&PageSize=${1000}&OrderBy=createdTime`,
        {
            dedupingInterval: 5000, // sau 5s clear cache
            revalidateOnFocus: false, // quay lại tab cũ ko gọi api
            // ...PublicConfiguration,
        }
    );

    const [listItems, setListItems] = useState([]); // root data
    const [dataList, setDataList] = useState([]); // display data
    const [searchTearm, setSearchTerm] = useState('');
    const [editing, setEditing] = useState(null);
    const [titleModal, setTitleModal] = useState('Tạo mới');

    // const [alertTextSuccess, setAlertTextSuccess] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [selectRow, setSelectRow] = useState([]);
    const [sortValue, setSortValue] = useState(false);

    // modal antd
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);

    useEffect(() => {
        setListItems(data?.data);
        setDataList(data?.data.reverse());
        console.log('data', data);
    }, [data]);

    const handleSubmit = async (values) => {
        try {
            const params = {
                id: '',
                maTinhThanhPho: values.maTinhThanhPho,
                tenTinhThanhPho: values.tenTinhThanhPho,
                ghiChu: values.ghiChu,
                trangThai: Number(values.trangThai) || 1,
                createdBy: 'Admin', // hard code
            };

            if (editing === null) {
                // console.log('Add new: editing is null');
                console.log('params', params);
                await tinhThanhApi.createCity(params).then((res) => {
                    if (res.succeeded && res.data) {
                        // success
                        mutate();
                        message.success('Thêm tỉnh thành thành công!');
                        actionForm.resetFields();
                    } else {
                        message.error(res.message);
                    }
                });
            } else {
                params.id = editing;

                await tinhThanhApi.updateCity(params).then((res) => {
                    if (res.succeeded && res.data) {
                        // success
                        mutate();
                        message.success('Cập nhật tỉnh thành thành công!');
                        handleCancel();
                    } else {
                        message.success(res.message);
                    }
                });
            }
        } catch (error) {
            message.error('Thất bại hoặc trùng mã tỉnh thành!');
            console.log('error', error);
        }
    };

    const handleAddNew = () => {
        setTitleModal('Tạo mới');
        actionForm.resetFields();
        setEditing(null);
        showModal();
    };

    const handleEditRow = (record) => {
        console.log('record', record.id);
        setEditing(record.id);
        setTitleModal('Cập nhật');
        actionForm.setFieldsValue({
            maTinhThanhPho: record.maTinhThanhPho,
            tenTinhThanhPho: record.tenTinhThanhPho,
            ghiChu: record.ghiChu,
            trangThai: record.trangThai,
        });
        showModal();
    };

    const handleEditOnButton = () => {
        if (selectRow.length > 1) {
            message.warning('Chỉ chọn 1 dòng để cập nhật');
            return;
        }
        if (selectRow.length < 1) {
            message.warning('Chọn 1 dòng cần cập nhật');
            return;
        }
        setTitleModal('Cập nhật');
        setEditing(selectedRowKeys[0]);
        actionForm.setFieldsValue({
            maTinhThanhPho: selectRow[0].maTinhThanhPho,
            tenTinhThanhPho: selectRow[0].tenTinhThanhPho,
            ghiChu: selectRow[0].ghiChu,
            trangThai: Number(selectRow[0].trangThai),
        });
        showModal();
    };

    const handleDeleteButton = async () => {
        const id = selectedRowKeys[0];
        console.log('selectedRowKeys[0]', selectedRowKeys[0]);
        await tinhThanhApi.delteCity(id).then((res) => {
            if (res.succeeded && res.data) {
                const index = dataList.findIndex((x) => x.id === id);
                if (index < 0) return;
                const newList = [...dataList];
                newList.splice(index, 1);
                setDataList(newList);
                setIsModalDelete(false);
                // update checkall
                setSelectedRowKeys([]);
                setSelectRow([]);
            }
        });
    };

    const handleDeleteRow = async (record) => {
        await tinhThanhApi.delteCity(record?.id).then((res) => {
            if (res.succeeded && res.data) {
                const index = dataList.findIndex((x) => x.id === record.id);
                if (index < 0) return;
                const newList = [...dataList];
                newList.splice(index, 1);
                setDataList(newList);
            }
        });
    };

    // modal antd
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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

    const handleCancelModelDelete = () => {
        setIsModalDelete(false);
    };

    //select ant
    function handleChangeSelect(value) {
        setSortValue(value);
    }

    //table
    const [selectionType, setSelectionType] = useState('checkbox');

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => {
                const currentIndex = pageSize * (pageIndex - 1);
                return currentIndex + index + 1;
            },
        },
        {
            title: 'Mã Tỉnh/ Thành Phố',
            dataIndex: 'maTinhThanhPho',
            key: 'maTinhThanhPho',
            sorter: (a, b) => a.maTinhThanhPho - b.maTinhThanhPho,
        },
        // {
        //     title: 'Ngày tạo',
        //     dataIndex: 'ngayTao',
        //     key: 'ngayTao',
        //     render: (text, record, index) => moment(record.ngayTao).format('DD-MM-YYYY'),
        // },
        {
            title: 'Tên',
            dataIndex: 'tenTinhThanhPho',
            key: 'tenTinhThanhPho',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (text, record, index) => {
                if (record.trangThai === 1) {
                    return 'Hoạt động';
                } else {
                    return 'Ngừng hoạt động';
                }
            },
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
        },
        {
            title: 'Action',
            dataIndex: 'Edit',
            key: 'ghiChu',
            fixed: 'right',
            // with: '100px',

            render: (_, record, checked) => (
                <>
                    <Button
                        type="link"
                        size="middle"
                        onClick={() => handleEditRow(record)}
                        style={{ marginRight: '5px' }}
                    >
                        Cập nhật
                    </Button>
                    <Popconfirm
                        title={`Bạn muốn xóa tỉnh thành ${record.tenTinhThanhPho}?`}
                        placement="topRight"
                        onConfirm={() => handleDeleteRow(record)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="link" size="middle" danger style={{ marginRight: '5px' }}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectRow(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        selectedRowKeys,
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const hanldeBoChon = () => {
        setSelectedRowKeys([]);
        setSelectRow([]);
        // setSelectKey([]);
    };

    async function onKeyPress(e) {
        if (e.key === 'Enter') {
            // await onSearchClick();
            console.log('Enter');
        }
    }

    const handleResetField = () => {
        searchForm.resetFields();
    };

    return (
        <div>
            <Content className={styles.content_page}>
                <div className={styles.db__6}>
                    <Col span={24}>
                        <Collapse
                            expandIcon={({ isActive }) => (
                                <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            className="site-collapse-custom-collapse"
                            expandIconPosition="right"
                        >
                            <Panel header="Tìm kiếm" key="1" className="site-collapse-custom-panel">
                                {/* <p>{text}</p> */}
                                <Form form={searchForm}>
                                    <Row gutter={24}>
                                        <Col span={5}>
                                            <div className="filter-item-label">Mã tỉnh thành</div>
                                            <Form.Item name="UserFullName">
                                                <Input onKeyPress={onKeyPress} allowClear />
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <div className="filter-item-label">Tên tỉnh thành</div>
                                            <Form.Item name="UserName">
                                                <Input onKeyPress={onKeyPress} allowClear />
                                            </Form.Item>
                                        </Col>
                                        <Col span={10} />
                                        <Col
                                            span={4}
                                            style={{
                                                textAlign: 'right',
                                            }}
                                        >
                                            <Form.Item>
                                                <Button
                                                    htmlType="submit"
                                                    type="primary"
                                                    style={{ width: '90px' }}
                                                    onClick={() => onSearchClick(1)}
                                                >
                                                    Tìm Kiếm
                                                </Button>
                                                <Button
                                                    htmlType="button"
                                                    type="primary"
                                                    ghost
                                                    onClick={handleResetField}
                                                    style={{
                                                        margin: '19px 0 0 10px',
                                                        width: '90px',
                                                    }}
                                                >
                                                    Làm Mới
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Panel>
                        </Collapse>
                    </Col>
                </div>
                <div className={styles.db__6}>
                    <div className={styles.db__11}>
                        <Button type="primary" className={styles.db__12} onClick={handleAddNew}>
                            <div className={styles.db__8}>
                                <div className={styles.db__13}>
                                    <PlusOutlined />
                                </div>
                                <div>Tạo mới</div>
                            </div>
                        </Button>

                        <Modal visible={isModalVisible} onCancel={handleCancel} footer={false}>
                            <Form
                                form={actionForm}
                                name="basic"
                                initialValues={{ remember: true }}
                                onFinish={handleSubmit}
                                autoComplete="off"
                            >
                                <div className={styles.db__14}>
                                    <h1>{titleModal}</h1>
                                    <p>Vui lòng nhập các trường thông tin bên dưới</p>
                                </div>
                                <div className={styles.db__15}>
                                    <p className={styles.formItemTitle}>Mã tỉnh/Thành phố</p>
                                    <Form.Item
                                        name="maTinhThanhPho"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Mã tỉnh thành không được trống!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="number"
                                            min={1}
                                            max={9999999}
                                            placeholder="Mã Tỉnh/Thành Phố"
                                            className={styles.formItemInput}
                                            size="large"
                                        />
                                    </Form.Item>

                                    <p className={styles.formItemTitle}>Tên tỉnh/Thành phố</p>
                                    <Form.Item
                                        name="tenTinhThanhPho"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Tên tỉnh thành không được trống!',
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
                                        <Input
                                            placeholder="Tên tỉnh/Thành phố"
                                            className={styles.formItemInput}
                                            size="large"
                                        />
                                    </Form.Item>

                                    <p className={styles.formItemTitle}>Ghi chú</p>
                                    <Form.Item
                                        name="ghiChu"
                                        rules={[
                                            {
                                                max: 255,
                                                message: 'Tối đa 255 ký tự!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Ghi chú"
                                            className={styles.formItemInput}
                                            size="large"
                                        />
                                    </Form.Item>
                                    <p className={styles.formItemTitle}>Trạng thái</p>
                                    <Form.Item name="trangThai">
                                        <Select defaultValue={1} size="large">
                                            <Option value={1}>Hoạt động</Option>
                                            <Option value={2}>Ngừng hoạt động</Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div>
                                    <Row className={styles.db__1}>
                                        <Col span={11}>
                                            <Button
                                                type="primary"
                                                className={styles.db__18}
                                                htmlType="submit"
                                            >
                                                <div>Lưu lại</div>
                                            </Button>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={11}>
                                            <Button
                                                type="danger"
                                                onClick={handleCancel}
                                                className={styles.db__18a}
                                            >
                                                <div>Hủy bỏ</div>
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                        </Modal>
                    </div>

                    <Row style={{ boxShadow: '0 0 10px rgba(0,0,0,.12)', marginBottom: 32 }}>
                        <Col span={24} className={styles.wrapperTitle}>
                            <Typography.Text level={3}>Danh sách Tỉnh Thành Phố</Typography.Text>
                        </Col>

                        <Col span={24}>
                            <div style={{ padding: '10px' }}>
                                <Table
                                    rowKey="id"
                                    rowSelection={{
                                        type: selectionType,
                                        ...rowSelection,
                                    }}
                                    columns={columns}
                                    dataSource={dataList}
                                    pagination={{
                                        size: 'small',
                                        defaultPageSize: '10',
                                        showSizeChanger: true,
                                        pageSizeOptions: ['10', '20', '50', '100'],
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>
            {selectedRowKeys.length > 0 ? (
                <Affix offsetBottom={2}>
                    <Row className={styles.affixConfig}>
                        <Col span={12}>
                            <div>
                                <span style={{ marginRight: '10px' }}>{`${
                                    selectedRowKeys.length || 0
                                } đã chọn`}</span>
                                <Button onClick={hanldeBoChon} className={styles.unSelected}>
                                    Bỏ chọn
                                </Button>
                            </div>
                        </Col>

                        <Col span={12}>
                            <Space style={{ display: ' flex', justifyContent: 'flex-end' }}>
                                <div>
                                    <Button
                                        icon={<EditOutlined />}
                                        type="primary"
                                        onClick={handleEditOnButton}
                                    >
                                        Cập nhật
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        type="danger"
                                        onClick={showModalDelete}
                                        icon={<DeleteOutlined />}
                                    >
                                        Xóa
                                    </Button>
                                    <Modal
                                        title="Xóa dữ liệu"
                                        visible={isModalDelete}
                                        onOk={handleDeleteButton}
                                        onCancel={handleCancelModelDelete}
                                    >
                                        <p>{`Bạn có muốn xóa tỉnh thành ${selectRow[0].tenTinhThanhPho}?`}</p>
                                    </Modal>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </Affix>
            ) : (
                ''
            )}
        </div>
    );
}

TinhThanh.Layout = AdminLayout;
export default TinhThanh;
