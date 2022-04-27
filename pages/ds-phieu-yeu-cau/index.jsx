/***
 * date: 17/03/2022
 * author: Thaonsd
 */

import {
    CloseCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    FileAddOutlined,
    FlagOutlined,
    PlusOutlined,
    PrinterOutlined,
    SaveOutlined,
    SearchOutlined,
    CaretRightOutlined,
    UploadOutlined
} from '@ant-design/icons';
import {
    Affix,
    Button,
    Upload,
    Col,
    Checkbox,
    Alert,
    DatePicker,
    Form,
    Input,
    Collapse,
    Layout,
    message,
    Modal,
    Row,
    Select,
    Space,
    Table,
    Typography,
} from 'antd';
import { phieuYeuCauApi, tinhThanhApi, upLoadApi } from 'api-client';
import ModalUpdatePYC from 'components/phieu-yeu-cau/modal-update-PYC';
import BaoPhiDichVu from './bao-phi-dich-vu/index'
import AdminLayout from 'components/layout/admin';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './dsphieuyeucau.module.css';
import Link from 'next/link';
import { render } from 'react-dom';
import { useAuth } from '../../hooks/use-auth';


const { Content } = Layout;
const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

function QuanLyPhieu() {

    const [mainForm] = Form.useForm();
    const { data, mutate } = useSWR(`/v1/PhieuYeuCaus?PageNumber${1}&PageSize=${1000}`, {
        dedupingInterval: 6000, // sau 6s clear cache
        revalidateOnFocus: false, // quay lại tab cũ ko gọi api
        // ...PublicConfiguration,
    });

    const [listItems, setListItems] = useState([]); // root data
    const [dataList, setDataList] = useState([]); // display data

    const [selectRow, setSelectRow] = useState([]);

    const [searchTearm, setSearchTerm] = useState('');

    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);

    const [loading, setloading] = useState(false);

    const [ngaytao_state, setNgayTao] = useState('');
    const dateFormat = 'DD/MM/YYYY';
    
    const getDate = new Date();
    const currentTime = moment(getDate.getTime());



    // get data
    useEffect(() => {
        setListItems(data?.data);
        setDataList(data?.data);
    }, [data]);

    // search filter
    useEffect(() => {
        try {
            const temp = [];
            listItems.filter((val) => {
                if (!val.soPhieuYeuCau) {
                    return;
                }
                if (val.soPhieuYeuCau.toLowerCase().includes(searchTearm.toLowerCase())) {
                    temp.push(val);
                }
                setDataList(temp);
            });
        } catch (error) {}
    }, [searchTearm]);

    function handleChange(value) {
        console.log(`selected ${value}`);
    }

    //table
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
            title: 'Số phiếu yêu cầu',
            dataIndex: 'soPhieuYeuCau',
            key: 'soPhieuYeuCau',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            render: (text, record, index) => moment(record.ngayTao).format('DD/MM/YYYY'),
        },
        {
            title: 'Loại khách hàng',
            dataIndex: 'loaiKhachHangId',
            key: 'loaiKhachHangId',
            render: (text, record, index) => {
                if (record.loaiKhachHangId === 1) {
                      return 'Cá nhân';
                } else {
                  return 'Doanh nghiệp';
                }
            },
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'tenKhachHang',
            key: 'tenKhachHang',
        },
        {
            title: 'Số CMT/Số hộ chiếu/Mã số thuế',
            dataIndex: '',
            key: 'soCMND',
            render: (text, record, index) => <p> {  record.loaiKhachHangId === 1 ? record.soCMND : record.maSoThue } </p>
        },
    ];
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectRow(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        // selectRow,
        selectedRowKeys,
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const clickUnchecked = () => {
        setSelectRow([]);
        setSelectedRowKeys([]);
    };

    const [selectionType, setSelectionType] = useState('checkbox');

    //
    function onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }

    function handleOnChange(page, pageSize) {
        console.log('page', page);
        console.log('pageSize', pageSize);
        setPageIndex(page);
        setPageSize(pageSize);
    }

    //modal antd
    const [isModalVisibleCN, setIsModalVisibleCN] = useState(false);
    const [isModalVisibleXoa, setIsModalVisibleXoa] = useState(false);


    // ------ ModalCN -------

    const showModalCN = () => {
        if (selectRow.length > 1) {
            message.warning('Chỉ chọn 1 dòng để cập nhật');
            return;
        }
        if (selectRow.length < 1) {
            message.warning('Chọn 1 dòng cần cập nhật');
            return;
        }

        console.log('showModalCN selectRow', selectRow);

        // mainForm.setFieldsValue({
        //     id: selectRow[0].id,
        //     nguoiLienHe: selectRow[0].nguoiLienHe,
        //     nguoiLienHeDiKhaoSat: selectRow[0].nguoiLienHeDiKhaoSat,
        //     trangthai: selectRow[0].trangThai,
        //     chitieu: selectRow[0].tenTinhThanhPho,
        //     ghiChu: selectRow[0].ghiChuChung,
        //     diaChi: selectRow[0].diaChi
        // });
        mainForm.setFieldsValue(selectRow[0]);
        setIsModalVisibleCN(true);
    };

    const handleCancelCN = () => {
        setIsModalVisibleCN(false);
        clickUnchecked()
    };

    const changeDateNT = (date, dateString) => {
        setNgayTao(moment(date).format('YYYY-MM-DD'));
    };

    const handleSubmitCNForm = (values) => {
        try {
            const params = mainForm.getFieldValue();
            console.log('Update', params);
            phieuYeuCauApi.updatePYC(params).then((res) => {
                if (res.succeeded && res.data) {
                    mutate();
                    message.success('Cập nhật phiếu yêu cầu thành công!');
                    handleCancel();
                } else {
                    message.success(res.message);
                }
            });
        } catch (error) {
            message.error('Thất bại hoặc trùng mã phiếu yêu cầu!');
            console.log('error', error);
        }
    };

    // ------ End of ModalPC -------

    // ------ Modal Xóa -------

    const showModalXoa = () => {
        if (selectRow.length > 1) {
            message.warning('Chỉ chọn 1 dòng để xóa');
            return;
        } else if (selectRow.length < 1) {
            message.warning('Chọn 1 dòng cần xóa');
            return;
        } else setIsModalVisibleXoa(true);
    };

    const createPhieuThu = () => {
        if (selectRow.length > 1) {
            message.warning('Chỉ chọn 1 phiếu yêu cầu để tạo phiếu thu');
        } else if (selectRow.length < 1) {
            message.warning('Chọn 1 phiếu yêu cầu để tạo phiếu thu');
        } else {
            sessionStorage.setItem('PYC', JSON.stringify(selectRow[0]));
        }
    };
    const handleCancelXoa = () => {
        setIsModalVisibleXoa(false);
    };

    const handleOkXoa = async () => {
        const id = selectRow[0].id;
        const response = await phieuYeuCauApi.deletePYC(id);
        if (response.succeeded && response.data) {
            message.success('Xóa thành công!!!');
            const index = dataList.findIndex((x) => x.id === id);
            console.log(index);
            if (index < 0) return;
            const newData = [...dataList];
            newData.splice(index, 1);
            setDataList(newData);
            setIsModalVisibleXoa(false);
        }
    };

    let printDocument = (item) => {
        try {
            phieuYeuCauApi.printPYC(item.id).then((res) => {
                const link = document.createElement("a");
                link.href = 'data:application/pdf;base64,' + res.fileContents;
                link.download = res.fileDownloadName;
                link.click();
                message.success('Bạn đã in thành công Phiếu yêu cầu: ' + item.soPhieuYeuCau);
            });
        } catch (error) {
            console.log(error)
        }
      };
    
    async function onKeyPress(e) {

        if (e.key === 'Enter') {
            // await onSearchClick();
            console.log('Enter');
        }
    }

    // -----   GỬI PHÊ DUYỆT --------
    const [pheDuyetForm] = Form.useForm();
    const [isModalVisiblePheDuyet, setIsModalVisiblePheDuyet] = useState(false);

    const showModalPheDuyet = () => {
        setIsModalVisiblePheDuyet(true);
    }
    const handleSubmitPheDuyet = (values) => {
        let params = values
        params.soPhieuYeuCau = selectRow[0].soPhieuYeuCau
        params.ngayDeXuatSua = moment().format('YYYY/MM/DD');
        params.trangThai = 4
        console.log('GỬI PHÊ DUYỆT:', params);
    };
    

    // ------ End of GỬI PHÊ DUYỆT -------

    // -----   PHÊ DUYỆT SỬA --------
    const [pheDuyetSuaForm] = Form.useForm();
    const [isModalVisiblePheDuyetSua, setIsModalVisiblePheDuyetSua] = useState(false);

    const showModalPheDuyetSua = () => {
        setIsModalVisiblePheDuyetSua(true);
    }
    const handleSubmitPheDuyetSua = (values) => {
        let params = values
        console.log('PHÊ DUYỆT SỬA:', params);
    };
    

    // ------ End of PHÊ DUYỆT SỬA -------

    // -----   CẬP NHẬT TRẠNG THÁI THẨM ĐỊNH  --------
    const [updateStatusTDForm] = Form.useForm();
    const [isModalVisibleUpdateStatusTD, setIsModalVisibleUpdateStatusTD] = useState(false);
    const [statusTD, setStatusTD] = useState()
    const { getUserInfo } = useAuth()
    const [currentUser, setCurrentUser] = useState()
    const [listTinhThanh, setListTinhThanh] = useState()
    const [isNgoaiGio, setIsNgoaiGio] = useState()
    const [titleFileDinhKem, setTitle] = useState()
    const [fileList, setFileList] = useState([]);
    async function getData() {
        try {
            const res = await getUserInfo()
            if (res.status) {
                setCurrentUser(res.uInfo_name)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getTinhThanh() {
        try {
            const res = await tinhThanhApi.getCity()
            if (res.succeeded && res.data) {
                setListTinhThanh(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getData()
        getTinhThanh()
    }, [])

    const onChangeStatusTD = (value, event) => {
        value == 3 ? setStatusTD(true) : setStatusTD()
    }
    const showModalUpdateStatusTD = () => {
        setIsModalVisibleUpdateStatusTD(true);
    }
    const onChangeLeTet = (e) => {
        let checked = e.target.checked
        updateStatusTDForm.setFieldsValue({ hoSoNgoaiGioHoacLeTet: checked })
        checked ? setIsNgoaiGio(true) : setIsNgoaiGio(false)
    }
    const uploadImage = async (options) => {
        const { onSuccess, file } = options;
        onSuccess('Ok');
        const formdata = new FormData();
        formdata.append('formFile', file); //add field File
        upLoadApi.uploadImage(formdata).then((res) => {
            let link = res.data.data
            setTitle(link)
        });
    };
    const handleSubmitUpdateStatusTD = (values) => {
       
        let params = values
        params.ngayKhaoSat = moment(values.ngayKhaoSat).format('YYYY-MM-DD')
        console.log('CẬP NHẬT TRẠNG THÁI THẨM ĐỊNH:', params);
    };
    

    // ------ End of CẬP NHẬT TRẠNG THÁI THẨM ĐỊNH  -------

    // -----   IN BÁO GIÁ DỊCH VỤ --------
    const [quoteServiceForm] = Form.useForm();
    
    const [isModalVisibleuoteService, setIsModalVisibleQuoteService] = useState(false);

    const showModaltQuoteService = () => {
        setIsModalVisibleQuoteService(!isModalVisibleuoteService);
    }

    const printQuoteService = (key) => {
        let params = quoteServiceForm.getFieldValue()
        params.id = selectRow[0].id
        if(key == 'PRICE'){
            console.log('IN BÁO GIÁ DỊCH VỤ:', params);
        }
        else{
            console.log('IN XÁC NHẬN PHÍ:', params);
        }
    };
    const handlePricePrint = (e ,key) => {
        const val = e.target.value
        // let gia_so_bo = Number(e.target.value.replace(/,/g, ""));
        if (val == '') {
            key == 1 ? quoteServiceForm.setFieldsValue({ soTienDot1: 0 }) : quoteServiceForm.setFieldsValue({ soTienDot2: 0 })
            return
        }
        if (val.charAt(0) == 0) {
            key == 1 ? quoteServiceForm.setFieldsValue({ soTienDot1: val.slice(1) }) : quoteServiceForm.setFieldsValue({ soTienDot2: val.slice(1) })
            return
        }
        key == 1 ? quoteServiceForm.setFieldsValue({  soTienDot1: val.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") })
            : quoteServiceForm.setFieldsValue({  soTienDot2: val.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") })
    }
    

    // ------ End of IN BÁO GIÁ DỊCH VỤ -------


     // -----   PHÂN CÔNG --------
     const [PCForm] = Form.useForm();
     const [isModalVisiblePC, setIsModalVisiblePC] = useState(false);

     const showModalPC = () => {
         setIsModalVisiblePC(true);
     };
 
     const handleCancelPC = () => {
         setIsModalVisiblePC(false);
         setIsModalVisiblePheDuyet(false);
         setIsModalVisibleUpdateStatusTD(false);
         setIsModalVisiblePheDuyetSua(false);
         setIsModalVisibleQuoteService(false);
         clickUnchecked()
     };
 
     const handleSubmitPCForm = (values) => {
         console.log('Phân Công:', { values });
     };
    

     // ------ End of PHÂN CÔNG -------

    return (
        <div>
            <Content className={styles.content_page}>
                <div className={styles.db__6}>
                    {/* <Col span={24}> */}
                        <Collapse
                            expandIcon={({ isActive }) => (
                                <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            className="site-collapse-custom-collapse"
                            expandIconPosition="right"
                        >
                            <Panel header="Tìm kiếm" key="1" className="site-collapse-custom-panel">
                                {/* <p>{text}</p> */}
                                <Row gutter={24}>
                                    <Col span={5}>
                                        <div className="filter-item-label">Số phiếu yêu cầu</div>
                                        <Form.Item name="UserFullName">
                                            <Input onKeyPress={onKeyPress} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <div className="filter-item-label">Tên khách hàng</div>
                                        <Form.Item name="UserName">
                                            <Input onKeyPress={onKeyPress} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <div className="filter-item-label">Loại khách hàng</div>
                                        <Form.Item name="Phone">
                                            <Input onKeyPress={onKeyPress} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <div className="filter-item-label">Ngày tạo</div>
                                        <Form.Item name="Phone">
                                            <Input onKeyPress={onKeyPress} />
                                            {/* <DatePicker
                                                disabled={isDisable}
                                                placeholder="Chọn ngày tạo"
                                                className={styles.formItemDatePicker}
                                                size="large"
                                                onChange={changeDateNT}
                                                format={dateFormat}
                                            /> */}
                                        </Form.Item>
                                    </Col>

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
                                            >
                                                Tìm Kiếm
                                            </Button>
                                            <Button
                                                htmlType="button"
                                                type="primary"
                                                ghost
                                                // onClick={onReset}
                                                style={{ margin: '19px 0 0 10px', width: '90px' }}
                                            >
                                                Làm Mới
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Panel>
                        </Collapse>
                    {/* </Col> */}
                </div>
                <Row style={{  marginBottom: 32, boxShadow: 'rgba(0, 0, 0, 0.12) 0px 0px 10px' }} >
                    <Col span={24} className={styles.wrapperTitle} >
                        <Typography.Text level={3}>Danh sách Phiếu yêu cầu</Typography.Text>
                            <div>
                                <Button
                                    style={{ marginRight: 14 , }}
                                    className={styles.btnWhite}
                                    icon={<FlagOutlined />}
                                    onClick={createPhieuThu}
                                >
                                    <Link href="/phieu-thu">
                                        <a style={{ color: 'black' }}>Tạo phiếu thu</a>
                                    </Link>
                                </Button>
                            </div>
                            <Button style={{ marginRight: 14 , }} icon={<FileAddOutlined />} onClick={ createPhieuThu }>
                                <Link href="/bao-cao-khao-sat">
                                   <a style={{ color: 'black' }}>Lập báo cáo thẩm định</a>
                                </Link>
                            </Button>
                            <Button style={{ marginRight: 14 , }} icon={<FileAddOutlined />} onClick={ createPhieuThu }>
                            <Link href="/bao-cao-chung-thu">
                                   <a style={{ color: 'black' }}>Lập chứng thư</a>
                                </Link>
                            </Button>

                            <Button style={{ marginRight: 14 , }} icon={<PlusOutlined style={{color: '#1890ff'}}/>}>
                                <Link href="/phieu-yeu-cau">
                                    Tạo mới Phiếu yêu cầu
                                </Link>
                            </Button>
                    </Col>

                    <Col span={24} className={styles.wrapperSearchInput}>
                        <Input
                            style={{ border: 'none' }}
                            size="large"
                            placeholder="Tìm kiếm Số phiếu yêu cầu"
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                            }}
                            prefix={<SearchOutlined className="site-form-item-icon" />}
                        />

                        <Select
                            defaultValue="Bộ lọc"
                            size="large"
                            style={{ color: '#2196F3', borderColor: '#2196F3', width: 150 }}
                            onChange={handleChange}
                        >
                            <Option value="a">Số thứ tự</Option>
                            <Option value="b">A - Z</Option>
                            <Option value="c">Z - A</Option>
                        </Select>
                    </Col>

                    <Col span={24}>
                        <div  style={{ padding: '10px' }}>
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
            </Content>
            {selectedRowKeys.length > 0 ? (
                <Affix offsetBottom={0}>
                    <Row className={styles.affixConfig}>
                        <Col span={3}>
                            <div style={{ padding: '6px' }}>
                                <span>{`${selectRow.length || 0} đã chọn`}</span>
                            </div>
                        </Col>

                        <Col span={21} justify="center">
                            <div className={styles.buttonWrapper}>
                                {/* PHÂN CÔNG */}
                                <div>
                                    <Button
                                        className={styles.btnWhite}
                                        icon={<FlagOutlined />}
                                        onClick={showModalPC}
                                    >
                                        Phân bổ chuyên viên thẩm định
                                    </Button>

                                    <Modal
                                        maskClosable={false}
                                        visible={isModalVisiblePC}
                                        footer={false}
                                        closable={false}
                                        className={styles.modalSetting}
                                    >
                                        <Form
                                            layout='vertical'
                                            form={PCForm}
                                            name="phancongForm"
                                            initialValues={{ remember: true }}
                                            autoComplete="off"
                                            onFinish={handleSubmitPCForm}
                                        >
                                            <div className={styles.titleModal}>
                                                <Typography.Title>Phân bổ</Typography.Title>
                                                <Typography.Text> Phân bổ chuyên viên thẩm định </Typography.Text>
                                            </div>
                                            <Form.Item name="nhanVienThamDinhId" label='Nhân viên thẩm định'
                                                rules={[{
                                                    required: true,
                                                    message: ' Bạn chưa chọn nhân viên cần phân bổ'
                                                }]}>
                                                <Select
                                                    showSearch
                                                    placeholder="Nhân viên thẩm định"
                                                    bordered={false}
                                                    style={{ paddingLeft: -20 }}
                                                    className={styles.formItemSelect}
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                      }
                                                >
                                                    <Option value={1}>
                                                        Nhân viên thẩm định ABC
                                                    </Option>
                                                    <Option value={2}>
                                                        Nhân viên thẩm định 123
                                                    </Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item name="nhanVienNhapLieuId" label='Nhân viên nhập liệu'
                                                rules={[{
                                                    required: true,
                                                    message: ' Bạn chưa chọn nhân viên nhập liệu'
                                                }]}>
                                                <Select
                                                    showSearch
                                                    placeholder="Nhân viên thẩm định"
                                                    bordered={false}
                                                    style={{ paddingLeft: -20 }}
                                                    className={styles.formItemSelect}
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                      }
                                                >
                                                    <Option value={1}>
                                                        Nhân viên Nhập Liệu ABC
                                                    </Option>
                                                    <Option value={2}>
                                                        Nhân viên Nhập Liệu 123
                                                    </Option>
                                                </Select>
                                            </Form.Item>

                                            <Row>
                                                <Col span={11}>
                                                    <Button
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#2196F3',
                                                            color: '#fff',
                                                        }}
                                                        htmlType="submit"
                                                        icon={<SaveOutlined />}
                                                        onClick={handleSubmitPCForm}
                                                    >
                                                        Lưu lại
                                                    </Button>
                                                </Col>
                                                <Col span={1} />
                                                <Col span={12}>
                                                    <Button
                                                        style={{ width: '100%' }}
                                                        type="danger"
                                                        onClick={handleCancelPC}
                                                    >
                                                        Hủy bỏ
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Modal>
                                </div>
                                {/*----- END PHÂN CÔNG ---- */}

                                {/*  GỬI PHÊ DUYỆT */}
                                <div>
                                    <Button
                                        className={styles.btnWhite}
                                        icon={<FlagOutlined />}
                                        onClick={showModalPheDuyet}
                                    >
                                        Gửi phê duyệt
                                    </Button>

                                    <Modal
                                        maskClosable={false}
                                        visible={isModalVisiblePheDuyet}
                                        footer={false}
                                        closable={false}
                                        className={styles.modalSetting}
                                    >
                                        <Form
                                            layout='vertical'
                                            form={pheDuyetForm}
                                            name="guiPheDuyetForm"
                                            autoComplete="off"
                                            onFinish={handleSubmitPheDuyet}
                                            initialValues={{
                                                trangThai: 'Đề xuất sửa',
                                            }}
                                        >
                                            <div className={styles.titleModal}>
                                                <Typography.Title>Gửi phê duyệt</Typography.Title>
                                                <Typography.Text> Vui lòng nhập đầy đủ thông tin </Typography.Text>
                                            </div>
                                            <Form.Item  name='trangThai' label='Trạng thái phiếu yêu cầu'>
                                                <Input disabled className={styles.formItemInput} placeholder='Trạng thái phiếu yêu cầu' />
                                            </Form.Item>

                                            <Form.Item name='lyDoDeXuat' label='Nội dung chỉ tiêu'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Bạn chưa nhập Lý do đề xuất'
                                                    },
                                                    {
                                                        max: 4000,
                                                        message: 'Tối đa 4000 ký tự!',
                                                    },
                                                ]}>
                                                <TextArea className={styles.formItemInput} rows={2} placeholder="Lý do đề xuất" maxLength={4000} />
                                            </Form.Item>

                                            <Row>
                                                <Col span={11}>
                                                    <Button
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#2196F3',
                                                            color: '#fff',
                                                        }}
                                                        htmlType="submit"
                                                        icon={<SaveOutlined />}
                                                        // onClick={handleSubmitPheDuyet}
                                                    >
                                                        Lưu lại
                                                    </Button>
                                                </Col>
                                                <Col span={1} />
                                                <Col span={12}>
                                                    <Button
                                                        style={{ width: '100%' }}
                                                        type="danger"
                                                        onClick={handleCancelPC}
                                                    >
                                                        Hủy bỏ
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Modal>
                                </div>
                                {/*----- END GỬI PHÊ DUYỆT  ---- */}


                                {/*  PHÊ DUYỆT SỬA*/}
                                <div>
                                    <Button
                                        className={styles.btnWhite}
                                        icon={<FlagOutlined />}
                                        onClick={showModalPheDuyetSua}
                                    >
                                        Phê duyệt sửa
                                    </Button>

                                    <Modal
                                        maskClosable={false}
                                        visible={isModalVisiblePheDuyetSua}
                                        footer={false}
                                        closable={false}
                                        className={styles.modalSetting}
                                    >
                                        <Form
                                            layout='vertical'
                                            form={pheDuyetSuaForm}
                                            name="guiPheDuyetSuaForm"
                                            autoComplete="off"
                                            onFinish={handleSubmitPheDuyetSua}
                                            initialValues={{
                                                trangThai: 'Đề xuất sửa',
                                                lyDoDeXuat: "Đề xuất sửa Phiếu yêu cầu do sai thông tin khách hàng"
                                            }}
                                        >
                                            <div className={styles.titleModal}>
                                                <Typography.Title>Phê duyệt sửa</Typography.Title>
                                                <Typography.Text> Vui lòng nhập đầy đủ thông tin </Typography.Text>
                                            </div>

                                            <Form.Item  name='lyDoDeXuat' label='Lý do đề xuất'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Bạn chưa nhập Lý do đề xuất'
                                                    },
                                                    {
                                                        max: 4000,
                                                        message: 'Tối đa 4000 ký tự!',
                                                    },
                                                ]}>
                                                <TextArea disabled className={styles.formItemInput} rows={2} placeholder="Lý do đề xuất" maxLength={4000} />
                                            </Form.Item>

                                            <Form.Item  name='trangThai' label='Trạng thái phê duyệt'>
                                                <Select
                                                        placeholder="Trạng thái phê duyệt "
                                                        bordered={false}
                                                        style={{ paddingLeft: -20 }}
                                                        className={styles.formItemSelect}
                                                    >
                                                        <Option value={5}>Phê duyệt sửa</Option>
                                                        <Option value={6}>Từ chối sửa</Option>
                                                    </Select>
                                            </Form.Item>
                                            <Row>
                                                <Col span={11}>
                                                    <Button
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#2196F3',
                                                            color: '#fff',
                                                        }}
                                                        htmlType="submit"
                                                        icon={<SaveOutlined />}
                                                        // onClick={handleSubmitPheDuyet}
                                                    >
                                                        Lưu lại
                                                    </Button>
                                                </Col>
                                                <Col span={1} />
                                                <Col span={12}>
                                                    <Button
                                                        style={{ width: '100%' }}
                                                        type="danger"
                                                        onClick={handleCancelPC}
                                                    >
                                                        Hủy bỏ
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Modal>
                                </div>
                                {/*----- END PHÊ DUYỆT SỬA  ---- */}

                                 {/*  CẬP NHẬT TRẠNG THÁI THẨM ĐỊNH  */}
                                 <div>
                                    <Button
                                        className={styles.btnWhite}
                                        icon={<FlagOutlined />}
                                        onClick={showModalUpdateStatusTD}
                                    >
                                        Cập nhật trạng thái thẩm định
                                    </Button>

                                    <Modal
                                        maskClosable={false}
                                        visible={isModalVisibleUpdateStatusTD}
                                        footer={false}
                                        closable={false}
                                        className={styles.modalSetting}
                                    >
                                        <Form
                                            layout='vertical'
                                            form={updateStatusTDForm}
                                            name="guiPheDuyetSuaForm"
                                            autoComplete="off"
                                            onFinish={handleSubmitUpdateStatusTD}
                                            initialValues={{
                                                trangThai: 'Đề xuất sửa',
                                                ngayKhaoSat: moment(currentTime),
                                                nguoiThucHienKhaoSat: currentUser
                                            }}
                                        >
                                            <div className={styles.titleModal}>
                                                <Typography.Title>Cập nhật trạng thái thẩm định</Typography.Title>
                                                <Typography.Text> Vui lòng nhập đầy đủ thông tin </Typography.Text>
                                            </div>

                                            <Form.Item  name='trangThai' label='Trạng thái'>
                                                <Select
                                                        placeholder="Trạng thái "
                                                        bordered={false}
                                                        style={{ paddingLeft: -20 }}
                                                        className={styles.formItemSelect}
                                                        onChange={(value, event) => onChangeStatusTD(value, event)}
                                                    >
                                                        <Option value={1}>Đã nhận</Option>
                                                        <Option value={2}>Đã liên hệ khách hàng</Option>
                                                        <Option value={3}>Đã khảo sát</Option>
                                                    </Select>
                                            </Form.Item>

                                            {/* Đã khảo sát */}
                                            { statusTD ? 
                                            <div>
                                            <Form.Item label='Ngày khảo sát' name='ngayKhaoSat'
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Điền đầy đủ thông tin',
                                                        },
                                                    ]}
                                                >
                                                    <DatePicker
                                                        placeholder="Ngày khảo sát"
                                                        className={styles.formItemDatePicker}
                                                        size="large"
                                                        format={dateFormat}
                                                    />
                                            </Form.Item>

                                            <Form.Item label='Người thực hiện khảo sát' name='nguoiThucHienKhaoSat'>
                                                <Input
                                                    className={styles.formItemInput}
                                                    name="nguoiThucHienKhaoSat"
                                                    placeholder="Người thực hiện khảo sát"
                                                />
                                            </Form.Item>

                                            <Form.Item label='Địa điểm khảo sát' name='diaDiemKhaoSat'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Điền đầy đủ thông tin',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                        placeholder="Địa điểm khảo sát"
                                                        bordered={false}
                                                        style={{ paddingLeft: -20 }}
                                                        className={styles.formItemSelect}
                                                    >
                                                        {listTinhThanh.map((option, index) => (
                                                            <Option
                                                                key={index}
                                                                value={option.id}
                                                            >
                                                                {option.tenTinhThanhPho}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                            </Form.Item>

                                            <Form.Item label='Hồ sơ ngoài giờ hoặc ngày lễ tết' name='hoSoNgoaiGioHoacLeTet'>
                                                <Checkbox className={styles.db__16}  valuePropName='checked' onChange={onChangeLeTet}>
                                                    Hồ sơ ngoài giờ hoặc ngày lễ tết
                                                </Checkbox>
                                            </Form.Item>
                                            { isNgoaiGio ? 
                                            <Form.Item label='Lý do hồ sơ ngoài giờ hoặc ngày lễ' name='lyDoHoSoNgoaiGioHoacLeTet'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Điền đầy đủ thông tin',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                        placeholder="Lý do hồ sơ ngoài giờ hoặc ngày lễ"
                                                        bordered={false}
                                                        style={{ paddingLeft: -20 }}
                                                        className={styles.formItemSelect}
                                                    >
                                                        <Option value={1}>Yêu cầu của kinh doanh</Option>
                                                        <Option value={2}>Khách hàng yêu cầu</Option>
                                                        <Option value={3}>Nhân viên tự yêu cầu</Option>
                                                </Select>
                                            </Form.Item>
                                            : '' }

                                            <Form.Item label='Ghi chú' name='ghiChu'>
                                                <TextArea className={styles.formItemInput} rows={3} placeholder="Ghi chú" maxLength={5000} />
                                            </Form.Item>

                                            <Form.Item label='Tải biên bản khảo sát' name='taiBienBanKhaoSat'>
                                                <Upload
                                                    accept="image/*"
                                                    customRequest={uploadImage}
                                                    fileList={fileList}
                                                >
                                                    <Button icon={<UploadOutlined />}>
                                                        Tài liệu đính kèm
                                                    </Button>
                                                </Upload>
                                                <p>{titleFileDinhKem}</p>
                                            </Form.Item>
                                            </div>
                                            : ''}
                                            <Form.Item label='Đã thu tiền' name='daThuTien'>
                                                <Checkbox className={styles.db__16}  valuePropName='checked' 
                                                           onChange={(event) => {updateStatusTDForm.setFieldsValue({daThuTien: event.target.checked})} }>
                                                    Đã thu tiền
                                                </Checkbox>
                                            </Form.Item>
                                            <Row>
                                                <Col span={11}>
                                                    <Button
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#2196F3',
                                                            color: '#fff',
                                                        }}
                                                        htmlType="submit"
                                                        icon={<SaveOutlined />}
                                                        // onClick={handleSubmitPheDuyet}
                                                    >
                                                        Lưu lại
                                                    </Button>
                                                </Col>
                                                <Col span={1} />
                                                <Col span={12}>
                                                    <Button
                                                        style={{ width: '100%' }}
                                                        type="danger"
                                                        onClick={handleCancelPC}
                                                    >
                                                        Hủy bỏ
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Modal>
                                </div>
                                {/*----- END CẬP NHẬT TRẠNG THÁI THẨM ĐỊNH  ---- */}


                                {/* SỬA PHIẾU YÊU CẦU */}
                                <div>
                                    <Button
                                        className={styles.btnWhite}
                                        icon={<EditOutlined />}
                                        onClick={showModalCN}
                                    >
                                        Sửa
                                    </Button>
                                    <Modal
                                        maskClosable={false}
                                        visible={isModalVisibleCN}
                                        footer={true}
                                        closable={true}
                                        onCancel={handleCancelCN}
                                        className={styles.modalSetting}
                                        width={1000}
                                        title='Chỉnh sửa phiếu yêu cầu '
                                    >
                                      <ModalUpdatePYC data={selectRow[0]} />
                                      <Button
                                            style={{ backgroundColor: '#F44336', color: '#fff', border: 'none' ,float:'right', bottom: '15px', marginRight: '10px' }}
                                            icon={<CloseOutlined style={{ fontSize: '16px' }} color={'#fff'} />}
                                            onClick={handleCancelCN}
                                        >
                                            Đóng
                                        </Button>
                                    </Modal>
                                </div>
                                {/*-------- END SỬA PHIẾU YÊU CẦU -------- */}

                                {/* XOÁ PHIẾU YÊU CẦU */}
                                <div>
                                    <Button
                                        className={styles.btnGreen}
                                        icon={<DeleteOutlined />}
                                        type="danger"
                                        onClick={showModalXoa}
                                    >
                                        Xóa
                                    </Button>
                                    <Modal
                                        maskClosable={false}
                                        visible={isModalVisibleXoa}
                                        footer={false}
                                        closable={false}
                                        className={styles.modalSetting}
                                    >
                                        <div className={styles.titleModal}>
                                            <Typography.Title>Xóa Phiếu Yêu Cầu</Typography.Title>
                                            <Typography.Text>Bạn muốn xóa?</Typography.Text>
                                        </div>
                                        <p
                                            className={styles.titleModal}
                                        >{`Phiếu yêu cầu: ${selectedRowKeys[0]}`}</p>
                                        <Row>
                                            <Col span={11}>
                                                <Button
                                                    style={{ width: '100%' }}
                                                    type="primary"
                                                    icon={<DeleteOutlined />}
                                                    htmlType="submit"
                                                    onClick={handleOkXoa}
                                                >
                                                    Xóa
                                                </Button>
                                            </Col>
                                            <Col span={1} />
                                            <Col span={12}>
                                                <Button
                                                    style={{ width: '100%' }}
                                                    type="danger"
                                                    icon={<CloseCircleOutlined />}
                                                    onClick={handleCancelXoa}
                                                >
                                                    Đóng
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Modal>
                                </div>
                                {/*------ END XOÁ PHIẾU YÊU CẦU --------- */}

                                {/* IN BÁO GIÁ DỊCH VỤ */}
                                <div>
                                    <Button
                                        style={{
                                            backgroundColor: '#4CAF50',
                                            color: '#fff',
                                            border: 'none',
                                        }}
                                        icon={<PrinterOutlined />}
                                        onClick={showModaltQuoteService}
                                    >
                                        In báo phiếu dịch vụ
                                    </Button>
                                    <Modal
                                        maskClosable={false}
                                        visible={isModalVisibleuoteService}
                                        footer={[
                                            <Button
                                                key="submit"
                                                style={{
                                                    width: '30%',
                                                    backgroundColor: '#2196F3',
                                                    color: '#fff',
                                                }}
                                                icon={<PrinterOutlined />}
                                                onClick={()=> printQuoteService('PRICE')}
                                            >
                                                Báo giá dịch vụ
                                            </Button>,

                                            <Button
                                                key="link"
                                                style={{
                                                    width: '30%',
                                                    backgroundColor: '#2196F3',
                                                    color: '#fff',
                                                }}
                                                icon={<PrinterOutlined />}
                                                onClick={()=> printQuoteService('CONFIRM')}
                                                >
                                                Xác nhận phí
                                            </Button>,
                                            <Button key="back" style={{ width: '30%' }} type="danger" onClick={handleCancelPC}>Đóng</Button>,
                                            ]}
                                        closable={false}
                                        className={styles.modalSetting}
                                    >
                                        {/* <BaoPhiDichVu data={selectRow[0]} /> */}
                                        <Form
                                            layout='vertical'
                                            form={quoteServiceForm}
                                            name="quoteServiceFormName"
                                            autoComplete="off"
                                            onFinish={printQuoteService}
                                        >
                                            <div className={styles.titleModal}>
                                                <Typography.Title>Báo phiếu dịch vụ</Typography.Title>
                                                <Typography.Text> Vui lòng nhập đầy đủ thông tin </Typography.Text>
                                            </div>
                                            <Form.Item  name='soTienDot1' label='Số tiền đợt 1'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Bạn chưa nhập số tiền đợt 1'
                                                    },
                                                    {
                                                        max: 1000,
                                                        message: 'Tối đa 4000 ký tự!',
                                                    },
                                                ]}>
                                                <Input className={styles.formItemInput} placeholder='Số tiền đợt 1' onChange={(event) => handlePricePrint(event, 1)} />
                                            </Form.Item>

                                            <Form.Item  name='soTienDot2' label='Số tiền đợt 2'>
                                                <Input className={styles.formItemInput} placeholder='Số tiền đợt 2' onChange={(event) => handlePricePrint(event, 2)} />
                                            </Form.Item>

                                            <Form.Item name='noiDungChuyenKhoan' label='Nội dung chuyển khoản'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Bạn chưa nhập nội dung chuyển khoản'
                                                    },
                                                    {
                                                        max: 1000,
                                                        message: 'Tối đa 4000 ký tự!',
                                                    },
                                                ]}>
                                                <TextArea className={styles.formItemInput} rows={2} placeholder="Lý do đề xuất" maxLength={1000} />
                                            </Form.Item>
                                        </Form>
                                        </Modal>
                                </div>
                                {/*------- END BÁO GIÁ DỊCH VỤ -----------*/}
                            </div>
                        </Col>


                    </Row>
                </Affix>
            ) : (
                ''
            )}
        </div>
    );
}

QuanLyPhieu.Layout = AdminLayout; ///
export default QuanLyPhieu;
