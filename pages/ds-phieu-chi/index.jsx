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
import AdminLayout from 'components/layout/admin';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './dsphieuchi.module.css'

const { Content } = Layout;
const { Option } = Select;
/* --------------------------- COLUMNS  ---------------------------*/
const columns = [
    {
        title: 'Số phiếu chi',
        dataIndex: 'soPhieuChi',
    },
    {
        title: 'Ngày tạo',
        render: (text, record, index) => moment(record.ngayTao).format('DD-MM-YYYY'),
    },

    {
        title: 'Số phiếu yêu cầu',
        dataIndex: 'phieuYeuCauId',
    },
    {
        title: 'Ngày tạo PYC',
        dataIndex: 'phieuYeuCauId',
        // render: (text, record, index) => moment(record.ngayTao).format('DD-MM-YYYY'),
    },
    {
        title: 'Họ tên người nhận tiền',
        dataIndex: 'hoTenNguoiNhan',
    },

    {
        title: 'Nội dung',
        dataIndex: 'noiDung',
    }
];
function DSPhieuChi() {
    const [pheDuyetForm] = Form.useForm()
    const { data, mutate } = useSWR(`/v1/BaoCaoKhaoSats?PageNumber${1}&PageSize=${1000}`, {
        dedupingInterval: 6000, // sau 6s clear cache
        revalidateOnFocus: false, // quay lại tab cũ ko gọi api
        // ...PublicConfiguration,
    });

    const [listItems, setListItems] = useState([]); // root data
    const [dataList, setDataList] = useState([]); // display data

    const [selectKey, setSelectKey] = useState([]);
    const [searchTearm, setSearchTerm] = useState('');

    const [pageSize, setPageSize] = useState(2);
    const [pageIndex, setPageIndex] = useState(1);
    // get data
    useEffect(() => {
        setListItems(data?.data);
        setDataList(data?.data);
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

    function handleChange(value) {
        console.log(`selected ${value}`);
    }



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

    const [selectionType, setSelectionType] = useState('checkbox');

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
    * 
    * MODAL HANDLE 
    * 
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
                    <h2>Danh sách phiếu chi</h2>
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
                            pageSizeOptions: ['10', '20', '30'],
                        }}
                    />
                </div>
            </Content>

            {selectKey.length > 0 &&
                <Affix offsetBottom={13}>
                    <div className={styles.affixButtonGroup}>
                        <Button
                            icon={<EyeOutlined />}
                            onClick={showModalXem}>
                            Xem
                        </Button>
                        <Button
                            icon={<EditOutlined />}
                            onClick={showModalSua} >
                            Sửa
                        </Button>
                        <Button
                            icon={<EditOutlined />}
                            onClick={showModalSua}>
                            Xác nhận chi
                        </Button>

                        <Button
                            icon={<FundOutlined />}
                            onClick={showModalPheduyet}>
                            Chờ Phê duyệt
                        </Button>


                        <Button
                            icon={<PrinterOutlined />}>
                            In
                        </Button>
                        <Button
                            icon={<PrinterOutlined />}>
                            Hủy
                        </Button>
                    </div>
                </Affix>
            }
            {/** ============================== MODAL XEM ============================== */}
            <Modal
                visible={isVisibleModalXem}
                footer={false}
            >
                <Form name='xem' >

                    <div>
                        <h1></h1>
                        <p>Vui lòng chọn các quyền</p>
                    </div>
                    <div >
                        <div>Phòng ban tham gia</div>
                        <Select
                            showSearch
                            placeholder="-- Chọn chuyên viên --"
                            optionFilterProp="children"
                            size="large"
                            // onChange={onChange}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ width: '100%' }}
                        >
                            <Option value="1">Phòng Kinh doanh</Option>
                            <Option value="2">002</Option>
                        </Select>
                        <div className={styles.qlp__17}>Phòng ban tham gia</div>
                        <Select
                            showSearch
                            placeholder="-- Chọn chuyên viên --"
                            optionFilterProp="children"
                            size="large"
                            // onChange={onChange}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ width: '100%' }}
                        >
                            <Option value="1">Phòng Kinh doanh</Option>
                            <Option value="2">002</Option>
                        </Select>
                        <div className={styles.qlp__17}>Phòng ban tham gia</div>
                        <Select
                            showSearch
                            placeholder="-- Chọn chuyên viên --"
                            optionFilterProp="children"
                            size="large"
                            // onChange={onChange}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ width: '100%' }}
                        >
                            <Option value="1">Phòng Kinh doanh</Option>
                            <Option value="2">002</Option>
                        </Select>
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
            {/** ============================== MODAL SỬA ============================== */}
            <Modal
                visible={isVisibleModalSua}
                footer={false}
                closable={null}

            >
                <Form name='suaForm'>
                    <Form.Item></Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button>Lưu</Button>
                        <Button type='danger' onClick={handleCancelModalSua}>Đóng</Button>
                    </div>
                </Form>
            </Modal>
            {/** ============================== MODAL CHỜ PHÊ DUYỆT ============================== */}

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
                            <Select.Option value='1'>Phê duyệt</Select.Option>
                            <Select.Option value='2'>Chưa phê duyệt</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name='ghiChu' label='Ghi chú' rules={[
                        {
                            required: true,
                            message: ' Bắt buộc nhập'
                        }
                    ]}>
                        <Input.TextArea />
                    </Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button htmlType='submit'>Lưu</Button>
                        <Button type='danger' onClick={handleCancelModalPheduyet}>Đóng</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

DSPhieuChi.Layout = AdminLayout; ///
export default DSPhieuChi;
