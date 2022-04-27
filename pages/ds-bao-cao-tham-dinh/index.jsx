import {
    CloseOutlined,
    FileAddOutlined,
    PlusOutlined,
    PrinterOutlined,
    SearchOutlined,
    SaveOutlined,
    EyeOutlined,
    EditOutlined,
    FundOutlined,
} from '@ant-design/icons';
import { Affix, Button, Checkbox, Col, Form, Input, Layout, Modal, Row, Select, Table, Typography } from 'antd';
import { phieuYeuCauApi } from 'api-client';
import { danhMucApi } from 'api-client/danhmucapi';
import AdminLayout from 'components/layout/admin';
import moment from 'moment';
import { DatePicker } from 'node_modules/antd/lib/index';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './dsbaocaothamdinh.module.css'

const { Content } = Layout;
const { Option } = Select;
/* --------------------------- COLUMNS  ---------------------------*/
const columns = [
    {
        title: 'Mã báo cáo',
        dataIndex: 'maBaoCaoKhaoSat',
    },
    {
        title: 'Ngày báo cáo',
        render: (text, record, index) => moment(record.ngayTao).format('DD/MM/YYYY'),
    },
    {
        title: 'Loại tài sản',
        dataIndex: 'loaiTaiSanId',
    },
    {
        title: 'Số phiếu yêu cầu',
        dataIndex: 'soPhieuYeuCau',
    },

    {
        title: 'Tên Khách hàng',
        dataIndex: 'tenKhachHang',
    },

    {
        title: 'Nhân viên thẩm định',
        dataIndex: 'nhanVienThamDinh',
    }
    ,
    {
        title: 'Giá thẩm định',
        dataIndex: 'tongGiaTri',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trangThai',
    },
    {
        title: 'Ghi chú',
        dataIndex: 'ghiChu',
    }
];
function BaoCaoThamDinh() {
    const [pheDuyetForm] = Form.useForm()
    const [pages, setPages] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const { data, mutate } = useSWR(`/v1/BaoCaoKhaoSats?PageNumber${pages}&PageSize=${pageSize}`, {
        dedupingInterval: 6000, // sau 6s clear cache
        revalidateOnFocus: false, // quay lại tab cũ ko gọi api
        // ...PublicConfiguration,
    });
    const [trangThaiBCKS, setTrangThaiBCKS] = useState([])
    const [pYCs, setPYCs] = useState([])
    const [listItems, setListItems] = useState([]); // root data
    const [dataList, setDataList] = useState([]); // display data
    const [selectKey, setSelectKey] = useState([]);
    const [searchTearm, setSearchTerm] = useState('');
    const [selectionType, setSelectionType] = useState('checkbox');

/** ============================ GET Trạng thái BCKS ============================*/
    useEffect(()=>{
        const getTrangThaiBCKS = async () => {
            const res = await danhMucApi.getDanhMucs('trang-thai-bao-cao-khao-sat')
            if (res.succeeded && res.data) {
                setTrangThaiBCKS(res.data)
            }
        }
        getTrangThaiBCKS()
    }, [])
    
    useEffect(() => {
        const getPYC = async () => {
            try {
                const res = await phieuYeuCauApi.getPYC()
                if (res.succeeded && res.data) {
                    setPYCs(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getPYC()
    }, [])

    const newPYCList = dataList?.map(item => {
        const id = item.phieuYeuCauId
        const data = pYCs?.find(it => it.id == id)
        // const {tenKhachHang} = data
        // return {...item, tenKhachHang}
    })
    // console.log(findID)

    // get data
    useEffect(() => {
        setListItems(data?.data);
        setDataList(data?.data.reverse());
    }, [data]);


    /* --------------------------- FILTER SEARCH ---------------------------*/
    // useEffect(() => {
    //     const temp = [];
    //     listItems.filter((val) => {
    //         if (val.soPhieuYeuCau.toLowerCase().includes(searchTearm.toLowerCase())) {
    //             temp.push(val);
    //         }
    //         setDataList(temp);
    //     });
    // }, [searchTearm]);




    /* --------------------------- ROW SELECTION  ---------------------------*/
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectKey(selectedRowKeys);
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };


    /* --------------------------- HANDLE ON CHANGE && CHANGE  ---------------------------*/
    function onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }

    function handleOnChange(page, pageSize) {
        console.log('page', page);
        console.log('pageSize', pageSize);
        setPageIndex(page);
        setPageSize(pageSize);
    }

    /* --------------------------- MODAL USE STATE---------------------------*/
    const [isVisibleModalXem, setIsVisibleModalXem] = useState(false);
    const [isVisibleModalPheduyet, setIsVisibleModalPheduyet] = useState(false);
    const [isVisibleModalSua, setIsVisibleModalSua] = useState(false);
    const [isVisibleModalThem, setIsVisibleModalThem] = useState(false);

    /*
    * MODAL HANDLE 
    */

    /* ---------------------------  HANDLE MODAL XEM---------------------------*/
    const showModalXem = () => {
        setIsVisibleModalXem(true);
    };

    const handleCancelModalXem = () => {
        setIsVisibleModalXem(false);
    };
    /* ---------------------------  END HANDLE MODAL XEM---------------------------*/

    /* ---------------------------  HANDLE MODAL PHE DUYET---------------------------*/
    const showModalPheduyet = () => {
        setIsVisibleModalPheduyet(true);
    };

    const handleCancelModalPheduyet = () => {
        setIsVisibleModalPheduyet(false);
    };
    /* ---------------------------  END HANDLE MODAL PHE DUYET---------------------------*/

    /* ---------------------------  HANDLE MODAL SƯA---------------------------*/
    const showModalSua = () => {
        setIsVisibleModalSua(true);
    };
    const showModalThem = () => {
        setIsVisibleModalThem(true);
    };

    const handleCancelModalSua = () => {
        setIsVisibleModalSua(false);
    };
    /* ---------------------------  END HANDLE MODAL SƯA---------------------------*/
    const handlePageChange = (page, pageSize) => {
        setPageSize(pageSize)
        setPages(page)
    }
    const formatDate = 'DD/MM/YYYY'
    const phapLyColumns= [
        {
            title: 'Tên văn bản',
            dataIndex: 'tenVanBan'
        },
        {
            title: 'Số - ngày ban hành',
            dataIndex: 'soBanHanh'
        },
        {
            title: 'Cơ quan cấp',
            dataIndex: 'coQuanCap'
        },
        {
            title: 'Chủ tài sản',
            dataIndex: 'chuTaiSan'
        },
    ]
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
                    <h2>Quản lý báo cáo thẩm định</h2>
                    <Table
                        rowKey="id"
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={dataList}
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

            {selectKey.length > 0 &&
                <Affix offsetBottom={13}>
                    <div className={styles.affixButtonGroup}>
                        <Button
                            icon={
                                <EyeOutlined />
                            }
                            onClick={showModalXem}>
                            Xem
                        </Button>
                        <Button
                            icon={<EditOutlined />}
                            onClick={showModalSua}
                        >
                            Sửa
                        </Button>
                        <Button
                            icon={<FundOutlined />}
                            onClick={showModalPheduyet}
                        >
                            Phê duyệt
                        </Button>
                        <Button
                            icon={<PrinterOutlined />}
                        >
                            In
                        </Button>
                    </div>
                </Affix>
            }

            {/* =================== MODAL XEM =================== */}
            <Modal
                visible={isVisibleModalXem}
                footer={false}
                closable={null}
            >
                <Form name='xem' 
                layout='vertical'>
                    <div>
                        <h1 style={{textAlign: 'center', marginBottom: 0}}>Chi tiết Báo cáo</h1>
                        <p style={{textAlign: 'center'}}>Vui lòng chọn các quyền</p>
                    </div>

                    <div className={styles.formItemWrapper}>
                        <Form.Item name='trangThai' label='Trạng thái'>
                            <Input />
                        </Form.Item>
                        <Form.Item name='maBaoCao' label='Mã báo cáo'>
                            <Input />
                        </Form.Item>
                        <Form.Item name='ngayBaoCao' label='Ngày báo cáo'>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='tenKhachHang' label='Tên khách hàng'>
                            <Input />
                        </Form.Item>
                        <Form.Item name='soPhieuYeuCau' label='Số phiếu yêu cầu'>
                            <Input />
                        </Form.Item>
                        <Form.Item name='ngayKhaoSat' label='Ngày khảo sát'>
                            <Input />
                        </Form.Item>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='nguoiThucHienKS' label='Người thức hiện khảo sát'>
                            <Input />
                        </Form.Item>
                        <Form.Item name='diaDiemKS' label='Địa điểm khảo sát'>
                            <Input />
                        </Form.Item>
                        <Form.Item name='loaiTS' label='Loại tài sản'>
                            <Input />
                        </Form.Item>
                    </div>
                    <h2>Thông tin tài sản thẩm định giá</h2>
                    <h2>A. Pháp lý tài sản</h2>
                    <div className={styles.tableContent}>
                        <Table columns={phapLyColumns} />
                    </div>
                    <h2>B. Đặc điểm chung của tài sản</h2>
                    <Form.Item name='viTri' label='Vị trí bất động sản'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='giaoThong' label='Giao thông'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='huongChinh' label='Hướng chính'>
                            <Input />
                        </Form.Item>
                    <h2>C. Đặc điểm thửa đất</h2>
                    <Form.Item name='dienTichDat' label='Diện tích đất'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='chieuDai' label='Chiều dài'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='chieuRong' label='Chiều rộng'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='mucDichSuDung' label='Mục đích sử dụng'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='thoiHanSuDung' label='Thời hạn sủ dụng'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='thongTinThoiHanSuDung' label='Thông tin cụ thể'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='nguonGocSuDungDat' label='Nguồn gốc sử dụng'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='hinhDang' label='Hình dạng'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='hinhDangDescription' label='Mô tả cụ thể'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='hienTrangSuDung' label='Hiện trạng sử dụng'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='luuYKhac' label='Lưu ý khác'>
                            <Input />
                        </Form.Item>
                    <h2>D. Đặc điểm chi tiết về công trình nhà cửa, vật kiến trúc</h2>
                    <Form.Item name='loaiCongTrinh' label='Loại công trình'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='soTang' label='Số tầng'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='dienTichXayDung' label='Diện tích xây dựng'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='dienTichSuDung' label='Diện tích sử dụng'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='namSuDung' label='Năm sử dụng'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='isCaiTaoSuaChua' label='Cải tạo sửa chữa'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='ketCau' label='Kết cấu'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='tienIchKhac' label='Tiện ích khác'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='luuYKhac02' label='Lưu ý khác'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='loaiCongTrinhKhac' label='Loại công trình khác'>
                            <Input />
                        </Form.Item>
                    <h2>Kết quả thẩm định giá</h2>
                    <div className={styles.formItemWrapper}>
                    <Form.Item name='tongGiaTriTaiSan' label='Tổng giá trị tài sản'>
                            <Input />
                        </Form.Item>
                    <Form.Item name='tongGiaTriTaiSanBangChu' label='Bằng chữ'>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Row className={styles.qlp__18}>
                            <Col span={11}>
                                <Button
                                    className={styles.qlp__19}
                                >
                                    <div>Lưu lại</div>
                                </Button>
                            </Col>
                            <Col span={2} />
                            <Col span={11}>
                                <Button
                                    type="danger"
                                    onClick={handleCancelModalXem}
                                    className={styles.qlp__19}
                                >
                                    <div>Hủy bỏ</div>
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Form>

            </Modal>

            {/* =================== MODAL PHE DUYET =================== */}
            <Modal
                visible={isVisibleModalPheduyet}
                closable={null}
                footer={false}>
                <Typography.Title level={3}>Phê duyệt</Typography.Title>
                <Form name='pheDuyetForm' form={pheDuyetForm} layout='vertical'>
                    <Form.Item name='trangThai' label='Trạng thái'
                        rules={[
                            {
                                required: true,
                                message: ' Bắt buộc chọn'
                            }
                        ]}>
                        <Select>
                            {
                                trangThaiBCKS?.map(item => 
                                    <Option key={item.value} value={item.value}>{item.description}</Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name='ghiChu' label='Ghi chú' rules={[
                        {
                            required: true,
                            message: ' Bắt buộc nhập'
                        }
                        ,
                        {
                            max: 5000,
                            message: 'Độ dài tối đa 5000 ký tự'
                        }
                    ]}>
                        <Input.TextArea maxLength={5000}/>
                    </Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button htmlType='submit'>Lưu</Button>
                        <Button type='danger' onClick={handleCancelModalPheduyet}>Đóng</Button>
                    </div>
                </Form>
            </Modal>

            {/* =================== MODAL SUA =================== */}
            <Modal
                visible={isVisibleModalSua}
                footer={false}
                closable={null} >
                <Form name='suaForm'>
                    <Form.Item></Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button>Lưu</Button>
                        <Button type='danger' onClick={handleCancelModalSua}>Đóng</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

BaoCaoThamDinh.Layout = AdminLayout; ///
export default BaoCaoThamDinh;
