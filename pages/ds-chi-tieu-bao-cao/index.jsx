import {
    EyeOutlined,
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { Affix, Button, Col, Form, Input, Layout, message, Modal, Row, Select, Space, Table, Typography } from 'antd';
import { chitieuBaoCaoAPi } from 'api-client';
import { baoCaoKhaoSatApi } from 'api-client/baocaokhaosat';
import AdminLayout from 'components/layout/admin';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './dschitieubaocao.module.css';

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const columns = [
    {
        title: 'Mã chỉ tiêu',
        dataIndex: 'maChiTieu'
    },
    {
        title: 'Nội dung chỉ tiêu',
        dataIndex: 'noiDung'
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trangThai'
    },
    {
        title: 'Ghi chú',
        dataIndex: 'ghiChu'
    }
];

function DSChiTieuBC() {
    const { data, mutate } = useSWR(`/v1/ChiTieuBaoCaos?PageNumber=${1}&PageSize=${1000}&OrderBy=createdTime`, {
        dedupingInterval: 6000, // sau 6s clear cache
        revalidateOnFocus: false, // quay lại tab cũ ko gọi api
        // ...PublicConfiguration,
    });
    const [suaForm] = Form.useForm()
    const [actionForm] = Form.useForm()
    const [listItems, setListItems] = useState([]); // root data
    const [dataList, setDataList] = useState([]); // display data

    const [selectKey, setSelectKey] = useState([]);
    const [selectRows, setSelectRows] = useState([]);
    const [searchTearm, setSearchTerm] = useState('');

    const [pageSize, setPageSize] = useState(2);
    const [pageIndex, setPageIndex] = useState(1);
    // get data
    useEffect(() => {
        setListItems(data?.data);
        setDataList(data?.data);
    }, [data]);

    /** ================================= SEARCH FILTER ================================= */
    useEffect(() => {
        const temp = [];
        listItems.filter((val) => {
            if (val.tenChiTieu.toLowerCase().includes(searchTearm.toLowerCase())) {
                temp.push(val);
            }
            setDataList(temp);
        });
    }, [searchTearm]);

    function handleChange(value) {
        console.log(`selected ${value}`);
    }
    const onSelectType = (value, event) => {
        console.log(`selected ${value}`);
        console.log('event', event);
    }

    //table

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectKey(selectedRowKeys);
            setSelectRows(selectedRows)
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
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

    /** ========================= MODAL VISIBLE ========================= */
    const [titleModal, setTitleModal] = useState('');
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [statusModal, setStatusModal] = useState('');


    /** ========================= SHOW MODAL ========================= */
    const showModalSua = (selectKeys) => {
        if (selectRows.length > 1 || selectRows.length < 1) {
            message.warning('Chỉ chọn 1 dòng để thực hiện')
            return
        }
        console.log('selectKey:', selectRows[0])
        setStatusModal(selectRows[0].id)
        setTitleModal('Chỉnh sửa')
        setIsVisibleModal(true);
        actionForm.setFieldsValue({
            maChiTieu: selectRows[0].maChiTieu,
            tenChiTieu: selectRows[0].tenChiTieu,
            noiDung: selectRows[0].noiDung,
            trangThai: selectRows[0].trangThai,
            ghiChu: selectRows[0].ghiChu,
        })
    }
    const showModalThem = () => {
        setStatusModal(null)
        setTitleModal('Tạo mới')
        setIsVisibleModal(true);
    }


    /** ========================= CLOSE MODAL ========================= */
    const closeModal = () => {
        setIsVisibleModal(false);
        actionForm.resetFields()
    }

    /** ========================= SUBMIT FORM ========================= */
    const handleSubmitactionForm = (values) => {
        let params = {
            id:'',
            maChiTieu: values.maChiTieu,
            tenChiTieu: values.tenChiTieu,
            noiDung: values.noiDung,
            trangThai: values.trangThai,
            ghiChu: values.ghiChu,
        }
        if(statusModal == null){
            addNew(params)
        }
        else{
            params.id = statusModal
            updateCTBC(params)
        }
    }

    const addNew = async (params) => {
        try {
            const res = await chitieuBaoCaoAPi.createChiTieu(params)
            if (res.succeeded && res.data) {
                mutate();
                message.success('Thêm thành công!!!')
                actionForm.resetFields()
                closeModal()
            }
        } catch (error) {
            console.log(error)
        }
    }
    const updateCTBC = async (params) => {
        try {
            const res = await chitieuBaoCaoAPi.updateChiTieu(params)
            if (res.succeeded && res.data) {
                mutate();
                message.success('Cập nhật hành công')
                actionForm.resetFields()
                closeModal()
            }
        } catch (error) {
            console.log(error)
        }
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
                    <h2>Cấu hình chỉ tiêu báo cáo</h2>
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

            <Affix offsetBottom={0}>
                <div className={styles.affixButtonGroup}>
                    {selectKey.length > 0 ?
                        <>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => showModalSua(selectKey)}>
                                Sửa
                            </Button>
                            <Button type="danger">
                                Quay lại
                            </Button>
                        </>
                        : <Button type="danger">
                            <Link href='/'>
                                <a>Đóng</a>
                            </Link>
                        </Button>
                    }
                </div>
            </Affix>

            {/** =========================== MODAL THÊM =========================== */}
            <Modal
                visible={isVisibleModal}
                footer={false}
                closeIcon={null}
                onCancel={closeModal}
            >
                <Form name='actionForm' form={actionForm}
                    onFinish={handleSubmitactionForm} layout='vertical'>
                    <div style={{ textAlign: 'center', marginBottom: 10 }}>
                        <Typography.Title>{ titleModal }</Typography.Title>
                        <Typography.Text>Vui lòng điền đủ các quyền bắt buộc</Typography.Text>
                    </div>
                    <Form.Item name='maChiTieu' label='Mã chỉ tiêu'
                        rules={[
                            {
                                required: true,
                                message: 'Bạn chưa nhập mã chỉ tiêu'
                            }
                        ]}>
                        <Input className={styles.formItemInput} placeholder='Mã chỉ tiêu báo cáo'  maxLength={5}/>
                    </Form.Item>

                    <Form.Item name='tenChiTieu' label='Tên chỉ tiêu '
                        rules={[
                            {
                            required: true,
                            message: 'Bắt buộc nhập'
                            },
                            {
                                max: 100,
                                message: 'Tối đa 100 ký tự!',
                            },
                        ]}>
                        <Input className={styles.formItemInput} placeholder='Tên chỉ tiêu báo cáo'/>
                    </Form.Item>

                    <Form.Item name='noiDung' label='Nội dung chỉ tiêu'
                        rules={[
                            {
                                required: true,
                                message: 'Bạn chưa nhập trường chỉ tiêu'
                            },
                            {
                                max: 9000,
                                message: 'Tối đa 10000 ký tự!',
                            },
                        ]}>
                        <TextArea className={styles.formItemInput} rows={4} placeholder="Nội dung chỉ tiêu báo cáo" maxLength={10000} />
                    </Form.Item>

                    <Form.Item name='trangThai' label='Trạng thái'
                        rules={[{
                            required: true,
                            message: 'Bạn chưa chọn trạng tháo chỉ tiêu báo cáo'
                        }]}>
                        <Select
                            className={styles.formItemSelect}
                            placeholder='Chọn trạng thái'
                            size="large"
                            bordered={false}
                        >
                            <Option value={1}>Hiệu lực</Option>
                            <Option value={2}>Hết hiệu lực</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name='ghiChu' label='Ghi chú '
                        rules={[
                            {
                                max: 4900,
                                message: 'Tối đa 5000 ký tự!',
                            },
                        ]}>
                        <TextArea className={styles.formItemInput} rows={2} placeholder="Ghi chú chỉ tiêu báo cáo" maxLength={5000} />
                    </Form.Item>
                    <div className={styles.formButtonGroup}>
                        <Button
                            htmlType='submit'>
                            Lưu lại
                        </Button>

                        <Button
                            type="danger"
                            icon={<CloseCircleOutlined />}
                            onClick={closeModal}
                        >
                            Hủy bỏ
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div >
    );
}
DSChiTieuBC.Layout = AdminLayout; ///
export default DSChiTieuBC
