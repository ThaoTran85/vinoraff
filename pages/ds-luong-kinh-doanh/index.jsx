import {
    AuditOutlined, CloseOutlined, DeleteOutlined,
    DollarCircleOutlined,
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
import { tinhThanhApi } from 'api-client';
import AdminLayout from 'components/layout/admin';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './dsLuongkinhdoanh.module.css';

const { Content } = Layout;
const { Option } = Select;

function DSChungThu() {
    const [actionForm] = Form.useForm();
    const [suaChungThuForm] = Form.useForm()
    const { data, mutate } = useSWR(
        `/v1/TinhThanhPhos?PageNumber${1}&PageSize=${1000}&OrderBy=createdTime`,
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
    // const [titleModal, setTitleModal] = useState('Phê duyệt');

    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [selectKey, setSelectKey] = useState([]);
    const [selectRow, setSelectRow] = useState([]);
    const [sortValue, setSortValue] = useState(false);

    useEffect(() => {
        setListItems(data?.data);
        setDataList(data?.data.reverse());
    }, [data]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectKey(selectedRowKeys);
            setSelectRow(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    // search filter
    // useEffect(() => {
    //     const temp = [];
    //     listItems.filter((val) => {
    //         if (val.tenTinhThanhPho.toLowerCase().includes(searchTearm.toLowerCase())) {
    //             temp.push(val);
    //         }
    //         setDataList(temp);
    //     });
    // }, [searchTearm]);

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

    // const handleSubmit = (values) => {
    //     try {
    //         const params = {
    //             id: '',
    //             maTinhThanhPho: values.maTinhThanhPho,
    //             tenTinhThanhPho: values.tenTinhThanhPho,
    //             ghiChu: values.ghiChu,
    //             trangThai: 1,
    //             createdBy: 'Admin', // hard code
    //         };

    //         if (editing === null) {
    //             // console.log('Add new: editing is null');
    //             tinhThanhApi.createCity(params).then((res) => {
    //                 if (res.succeeded && res.data) {
    //                     // success
    //                     mutate();
    //                     message.success('Thêm tỉnh thành thành công!');
    //                     actionForm.resetFields();
    //                 } else {
    //                     message.success(res.message);
    //                 }
    //             });
    //         } else {
    //             // console.log('Update');
    //             params.id = editing?.id;
    //             tinhThanhApi.updateCity(params).then((res) => {
    //                 if (res.succeeded && res.data) {
    //                     // success
    //                     mutate();
    //                     message.success('Cập nhật tỉnh thành thành công!');
    //                     handleCancel();
    //                 } else {
    //                     message.success(res.message);
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         message.error('Thất bại hoặc trùng mã tỉnh thành!');
    //         console.log('error', error);
    //     }
    // };

    // const handleAddNew = () => {
    //     setTitleModal('Tạo mới');
    //     actionForm.resetFields();
    //     setEditing(null);
    //     showModal();
    // };


    // modal antd
    const [isModalPheDuyetVisible, setIsModalPheDuyetVisible] = useState(false);
    const [isModalInVisible, setIsModalInVisible] = useState(false);
    const [isModalHuyChungThuVisible, setIsModalHuyChungThuVisible] = useState(false);
    const [isVisibleModalSuaChungThu, setIsVisibleModalSuaChungThu] = useState(false)
    // Modal Phe Duyet
    const handlePheDuyet = () => {
        setIsModalPheDuyetVisible(true)
    };

    const handleCancelPheDuyet = () => {
        setIsModalPheDuyetVisible(false)
    };

    const onFinishPheDuyet = (values) => {
        console.log(values)
    }

    // ----------- End Modal Phe Duyet-----------

    // -----------  Modal In -----------

    const handleIn = () => {
        setIsModalInVisible(true)
    };

    const handleCancelIn = () => {
        setIsModalInVisible(false)
    };

    // ----------- End Modal In -----------

    // -----------  Modal Huy Chung Thu -----------
    const handleHuyChungThu = () => {
        setIsModalHuyChungThuVisible(true)
    };

    const handleCancelHuyChungThu = () => {
        setIsModalHuyChungThuVisible(false)
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
    // ----------- End Modal Huy Chung Thu -----------

    // -----------  Modal Sua Chung Thu -----------
    const handleSubmitSuaChungThuForm = (values) => {
        console.log(values)
    }
    const showModalSuaChungThu = () => {
        if (selectRow.length > 1) {
            message.warning('Chỉ chọn 1 dòng để cập nhật');
            return;
        }
        setIsVisibleModalSuaChungThu(true)
        suaChungThuForm.setFieldsValue()
    }

    const handleCancelModalSuaChungThu = () => {
        setIsVisibleModalSuaChungThu(false)
    }

    // ----------- End Modal Sua Chung Thu -----------

    // const handleEditRow = (record) => {
    //     setEditing(record);
    //     setTitleModal('Cập nhật');
    //     actionForm.setFieldsValue({
    //         maTinhThanhPho: record.maTinhThanhPho,
    //         tenTinhThanhPho: record.tenTinhThanhPho,
    //         ghiChu: record.ghiChu,
    //         trangThai: record.trangThai,
    //     });
    //     showModal();
    // };

    // const handleEditOnButton = () => {
    //     if (selectRow.length > 1) {
    //         message.warning('Chỉ chọn 1 dòng để cập nhật');
    //         return;
    //     }
    //     if (selectRow.length < 1) {
    //         message.warning('Chọn 1 dòng cần cập nhật');
    //         return;
    //     }

    //     setTitleModal('Cập nhật');
    //     setEditing(selectKey[0]);
    //     actionForm.setFieldsValue({
    //         maTinhThanhPho: selectRow[0].maTinhThanhPho,
    //         tenTinhThanhPho: selectRow[0].tenTinhThanhPho,
    //         ghiChu: selectRow[0].ghiChu,
    //         trangThai: selectRow[0].trangThai,
    //     });
    //     showModal();
    // };

    // const handleDeleteButton = async () => {
    //     const id = selectKey[0];
    //     console.log('selectKey[0]', selectKey[0]);
    //     await tinhThanhApi.delteCity(id).then((res) => {
    //         if (res.succeeded && res.data) {
    //             const index = dataList.findIndex((x) => x.id === record.id);
    //             if (index < 0) return;
    //             const newList = [...dataList];
    //             newList.splice(index, 1);
    //             setDataList(newList);
    //         }
    //     });
    // };

    // const handleDeleteRow = async (record) => {
    //     await tinhThanhApi.delteCity(record?.id).then((res) => {
    //         if (res.succeeded && res.data) {
    //             const index = dataList.findIndex((x) => x.id === record.id);
    //             if (index < 0) return;
    //             const newList = [...dataList];
    //             newList.splice(index, 1);
    //             setDataList(newList);
    //         }
    //     });
    // };





    //select ant
    function handleChangeSelect(value) {
        // console.log(`selected ${value}`);
        // console.log(`selected ${value}`);
        setSortValue(value);
    }

    //table
    const columns = [
        {
            title: 'Số PYC',
            dataIndex: 'soChungThu',
            key: 'soChungThu',
        },
        {
            title: 'Số diên thoại',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            render: (text, record, index) => moment(record.ngayTao).format('DD-MM-YYYY'),
        },
        {
            title: 'Mã số thuế',
            dataIndex: 'ngayTao',
            key: 'loaiTaiSan',
        },
        {
            title: 'Họ và tên khách hàng',
            dataIndex: 'tenKhachHang',
            key: 'tenKhachHang',
        },
        {
            title: 'Chuyên viên kinh doanh',
            dataIndex: 'soPYC',
            key: 'soPYC',
        },
        {
            title: 'Phí thẩm định',
            dataIndex: 'maBaoCao',
            key: 'maBaoCao',
        },
    ];



    const [selectionType, setSelectionType] = useState('checkbox');

    return (
        <div>
            <Content className={styles.wrapper}>
                <Row>
                    <Col span={12} className={styles.btnWrapper} >
                        <Input placeholder='Search....' />
                        <Button
                            className={styles.btnSetting}
                            icon={<SearchOutlined style={{ fontSize: 11 }} />}
                        ></Button>
                        <Button type="primary"
                            icon={<PlusOutlined />}
                        >
                            Tạo mới
                        </Button>

                    </Col>
                </Row>
                <Row style={{ border: '1px solid rgba(0,0,0,.12)', borderRadius: 8 }}>
                    <Col span={24}>
                        <div className={styles.titleWrapper}>
                            <h2> Lương Kinh Doanh</h2>
                        </div>

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
                    </Col>
                </Row>

            </Content>

            {selectKey.length > 0 ? (
                <Affix offsetBottom={0}>
                    <Row className={styles.affixSetting}>
                        <Col span={3}>
                            <div style={{ padding: '6px' }}>
                                <span>{`${selectRow.length || 0} đã chọn`}</span>
                            </div>
                        </Col>
                        <Col span={21}  justify='center'>
                            <div className={styles.buttonWrapper}>
                                <div>
                                    <Button
                                        className={styles.btnWhite}
                                        icon={<DollarCircleOutlined />}
                                        onClick={showModalSuaChungThu}
                                    >
                                        Đề xuất hoàn phí
                                    </Button>
                                </div>
                                <Button
                                    className={styles.btnWhite}
                                    icon={<DollarCircleOutlined />}
                                >
                                    Đề xuất lương kinh doanh
                                </Button>
                                <div>
                                    <Button
                                        className={styles.btnWhite}
                                        icon={<DollarCircleOutlined />}
                                        onClick={handlePheDuyet}
                                    >
                                        Đề xuất chi hoa hồng
                                    </Button>
                                </div>

                                <div>
                                    <Button
                                        type="danger"
                                        icon={<CloseOutlined />}
                                        onClick={handleHuyChungThu}
                                    >

                                        Đóng
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Affix>
            ) : (
                ''
            )
            }
        </div >
    );
}

DSChungThu.Layout = AdminLayout;
export default DSChungThu;
