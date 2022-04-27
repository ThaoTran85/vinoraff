import {
    CalendarOutlined, CaretRightOutlined, CheckCircleOutlined, CloseOutlined, EditOutlined, FundOutlined, PlusOutlined, PrinterOutlined, SaveFilled, SearchOutlined, UserAddOutlined
} from '@ant-design/icons';
import {
    Collapse,
    Affix, Button,
    Checkbox, DatePicker,
    Form,
    Input,
    InputNumber,
    Layout, message, Modal, Select, Table, Typography, Row, Col
} from 'antd';
import AdminLayout from 'components/layout/admin';
import moment from 'moment';
import React, { useEffect, useState, useCallback } from 'react';
import useSWR from 'swr';
import { DocTienBangChu } from '../../util/index';
import styles from './dsphieuthu.module.css';
import { useAuth } from '../../hooks/use-auth';
import Link from 'next/link';
import { phieuThuApi, phieuYeuCauApi, userApi } from 'api-client';
import { nganHangApi } from 'api-client/nganHangApi';

const { Content } = Layout;
const { Option } = Select;

/* -------------------- COLUMN  -------------------- */


/* -------------------- data  -------------------- */
function QuanLyPhieuThu() {
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);

    const { data, mutate } = useSWR(`/v1/PhieuThus?PageNumber=${pageIndex}&PageSize=${pageSize}`, {
        dedupingInterval: 6000, // sau 6s clear cache
        revalidateOnFocus: false, // quay lại tab cũ ko gọi api
        // ...PublicConfiguration,
    });

    const [banks, setBanks] = useState([])
    useEffect(() => {
        const getBanks = async () => {
            try {
                const res = await nganHangApi.getNganHangs()
                if (res.succeeded && res.data) {
                    setBanks(res.data)
                }
                else {
                    message.error(res.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getBanks()
    }, [setBanks])
    const columns = [
        {
            title: 'Số phiếu thu',
            dataIndex: 'soPhieuThu',
            key: 'soPhieuThu',
        },
        {
            title: 'Ngày tạo',
            // dataIndex: 'ngayTao',
            key: 'ngayTao',
            render: record => moment(record.ngayTao).format('DD/MM/YYYY'),
        },
        {
            title: 'Người lập phiếu',
            // dataIndex: 'createdBy',
            render: record => {
                if (record.createdBy == userEmail) return user
                else return record.createdBy
            },
            key: 'tenKhachHang',
        },
        {
            title: 'Số phiếu yêu cầu',
            dataIndex: 'soPhieuYeuCau',
            key: 'soPhieuYeuCau',
        },
        {
            title: 'Ngày tạo',
            // dataIndex: 'ngayTaoPhieuYeuCau',
            render: record => moment(record.ngayTaoPhieuYeuCau).format('DD/MM/YYYY'),
            key: 'ngayTaoPhieuYeuCau',
        },
        {
            title: 'Tên Khách hàng nộp',
            dataIndex: 'tenKhachHang',
            key: 'tenKhachHang',
        },
        {
            title: 'Tổng tiền tạm thu',
            // dataIndex: 'tongSoTien',
            key: 'tongSoTien',
            render: record => new Intl.NumberFormat('vn-VN', { currency: 'VND' }).format(record.tongSoTien),
        },
        {
            title: 'Số tiền thu thực tế',
            // dataIndex: 'soTienThuThucTe',
            key: 'soTienThuThucTe',
            render: record => new Intl.NumberFormat('vn-VN', { currency: 'VND' }).format(record.soTienThuThucTe),

        },
        {
            title: 'Hình thức thanh toán',
            // dataIndex: 'hinhThucThanhToanId',
            render: record => record.hinhThucThanhToanId == 1 ? 'Tiền mặt' : 'Chuyển khoản',
            key: 'hinhThucThanhToanId',
        },
        {
            title: 'Xuất hóa đơn',
            // dataIndex: 'isXuatHoaDon',
            key: 'isXuatHoaDon',
            render: record => record.isXuatHoaDon ? 'Có' : 'Không',

        },
        {
            title: 'Trạng thái',
            // dataIndex: 'trangThai',
            render: record => record.trangThai == 1 ? 'Khởi tạo' : record.trangThai == 2 ? 'Xác nhận thu' : 'Hủy'
        }

    ];
    const { getUserInfo } = useAuth()
    const [user, setUser] = useState([])
    const [userEmail, setUserEmail] = useState([])

    const [userDataList, setUserDataList] = useState([])

    const [suaForm] = Form.useForm();
    const [xemForm] = Form.useForm();
    const [xacNhanForm] = Form.useForm();

    const [listItems, setListItems] = useState([]); // root data
    const [dataList, setDataList] = useState([]); // display data
    const [selectKey, setSelectKey] = useState([]);
    const [selectRows, setSelectRows] = useState([]);
    const [searchTearm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([])

    const [isvisibleCK, setIsvisibleCK] = useState(false)
    const [validateTongTien, setValidateTongTien] = useState(false)
    const [validateChecked, setValidateChecked] = useState(false)
    // const [pageSize, setPageSize] = useState(2);
    // const [pageIndex, setPageIndex] = useState(1);
    const [disableKhongThuDuoc, setDisableKhongThuDuoc] = useState(false)
    const [disableDaThuTien, setDisableDaThuTien] = useState(false)
    const [disableLuuButton, setDisableLuuButton] = useState(false)

    const [validateTongTienNhapSo, setValidateTongTienNhapSo] = useState(false)
    const [validateTongTienThu, setValidateTongTienThu] = useState(false)
    const [validateTongTienLength, setValidateTongTienLength] = useState(false)
    const [validateSoTienThuThucTe, setValidateSoTienThuThucTe] = useState(false)
    /* ======================== MODAL VISIBLE ======================== */
    const [isVisible, setIsVisible] = useState(false)
    const [isModalVisiblePTT, setIsModalVisiblePTT] = useState(false);
    const [isVisibleModalXemPTT, setIsVisibleModalXemPTT] = useState(false)
    const [isVisibleModalXacNhanThu, setIsVisibleModalXacNhanThu] = useState(false)
    const [isVisibleModalHuyPhieuThu, setIsVisibleModalHuyPhieuThu] = useState(false)
    const [disableInButton, setDisableInButton] = useState(true)
    const [validateChungTu, setValidateChungTu] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // get data
    useEffect(() => {
        setListItems(data?.data);
        setDataList(data?.data);
    }, [data]);
    /** =============== GET USERS DATA =============== */
    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await userApi.getUser()
                if (res.data) {
                    setUserDataList(res.data)
                }
                else {
                    message.error(res.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUserData()
    }, [])

   
    useEffect(() => {
        async function getData() {
            try {
                const res = await getUserInfo()
                if (res.status) {
                    setUser(res.uInfo_name)
                    setUserEmail(res.uInfo_email)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])
    /** SEARCH */
    useEffect(() => {
        const temp = [];
        listItems?.filter((val) => {
            if (val?.soPhieuThu.toLowerCase().includes(searchTearm.toLowerCase())) {
                temp.push(val);
            }
            setDataList(temp);
        });
    }, [searchTearm]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await userApi.getUser()
                if (res.succeeded && res.data) {
                    setUsers(res.data)
                }
                else {
                    message.error(res.message)
                }

            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectKey(selectedRowKeys);
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

    let docTien = new DocTienBangChu();
    // useEffect(() => {
    //     hinhThucThanhToanId == 1 ? setIsVisible(true) : setIsVisible(false)
    // }, [data]);

    const [selectionType, setSelectionType] = useState('checkbox');

    /* ======================== SHOW MODAL ======================== */
    const showModalXemPTT = () => {
        if (selectRows.length > 1 || selectRows.length < 1) {
            message.warning(" Chọn 1 dòng để thực hiện")
            return
        }
        setIsVisibleModalXemPTT(true)
        xemForm.setFieldsValue({
            chiNhanh: selectRows[0].chiNhanhNganHang,
            chungTuKemTheo: selectRows[0].chungTuKemTheo,
            daThuHetTien: selectRows[0].daThuHetTien,
            diaChi: selectRows[0].diachi,
            hinhThucThanhToan: selectRows[0].hinhThucThanhToanId,
            isKhongThuDuocTien: selectRows[0].isKhongThuDuocTien,
            nganHang: selectRows[0].nganHangId,
            ngayTao: moment(selectRows[0].ngayTao),
            ngayTaoPYC: moment(selectRows[0].ngayTaoPhieuYeuCau),
            ngayThu: moment(selectRows[0].ngayThu),
            nguoiLap: selectRows[0].createdBy == userEmail ? user : '',
            noiDung: selectRows[0].lyDoThu,
            soPhieuThu: selectRows[0].soPhieuThu,
            soPhieuYeuCau: selectRows[0].soPhieuYeuCau,
            soTaiKhoan: selectRows[0].soTaiKhoan,
            tongSoTien: selectRows[0].tongSoTien,
            tongSoTienTamThuBangChu: docTien.doc(selectRows[0].tongSoTien),
            soTienDaThu: selectRows[0].soTienDaThu,
            soTienThuThucTe: selectRows[0].soTienThuThucTe,
            soTienThuThucTeBangChu: docTien.doc(selectRows[0].soTienThuThucTe),
            // soTienTamThuBangChu: docTien.doc(selectRows[0].tongSoTien),
            tenKhachHang: selectRows[0].tenKhachHang,
            trangThai: selectRows[0].trangThai,
            xuatHoaDon: selectRows[0].isXuatHoaDon
        })

        const setHinhThuc = xemForm.getFieldValue('hinhThucThanhToan')
        setHinhThuc == 1 ? setIsVisible(false) : setIsVisible(true)
    }

    const showModalEditPTT = () => {
        if (selectRows.length > 1) {
            message.warning('Chỉ chọn 1 dòng để cập nhật');
            return;
        }
        if (selectRows.length < 1) {
            message.warning('Chọn 1 dòng cần cập nhật');
            return;
        }
        setIsModalVisiblePTT(true);
        setDisableLuuButton(false)

        suaForm.setFieldsValue({
            chiNhanh: selectRows[0].chiNhanhNganHang,
            chungTuKemTheo: selectRows[0].chungTuKemTheo,
            daThuHetTien: selectRows[0].daThuHetTien,
            diaChi: selectRows[0].diachi,
            hinhThucThanhToan: selectRows[0].hinhThucThanhToanId,
            isKhongThuDuocTien: selectRows[0].isKhongThuDuocTien,
            nganHang: selectRows[0].nganHangId,
            ngayTao: moment(selectRows[0].ngayTao),
            ngayTaoPYC: moment(selectRows[0].ngayTaoPhieuYeuCau),
            ngayThu: moment(selectRows[0].ngayThu),
            nguoiLap: selectRows[0].createdBy == userEmail ? user : '',
            noiDung: selectRows[0].lyDoThu,
            soPhieuThu: selectRows[0].soPhieuThu,
            soPhieuYeuCau: selectRows[0].soPhieuYeuCau,
            soTaiKhoan: selectRows[0].soTaiKhoan,
            tongSoTien: selectRows[0].tongSoTien,
            tongSoTienTamThuBangChu: docTien.doc(selectRows[0].tongSoTien),
            soTienDaThu: selectRows[0].soTienDaThu,
            soTienThuThucTe: selectRows[0].soTienThuThucTe,
            soTienThuThucTeBangChu: docTien.doc(selectRows[0].soTienThuThucTe),
            tenKhachHang: selectRows[0].tenKhachHang,
            trangThai: selectRows[0].trangThai,
            xuatHoaDon: selectRows[0].isXuatHoaDon
        });
        const setHinhThuc = suaForm.getFieldValue('hinhThucThanhToan')
        setHinhThuc == 1 ? setIsVisible(false) : setIsVisible(true)

        const daThu = suaForm.getFieldValue('daThuHetTien')
        const khongThuDuoc = suaForm.getFieldValue('isKhongThuDuocTien')
        daThu ? setDisableKhongThuDuoc(true) : setDisableKhongThuDuoc(false)
        khongThuDuoc ? setDisableDaThuTien(true) : setDisableDaThuTien(false)

    };

    const showModalXacNhanThu = () => {
        if (selectRows.length > 1 || selectRows.length < 1) {
            message.warning(" Chọn 1 dòng để thực hiện")
            return
        }
        cancelModalXemPTT()
        xacNhanForm.setFieldsValue({
            chiNhanh: selectRows[0].chiNhanhNganHang,
            chungTuKemTheo: selectRows[0].chungTuKemTheo,
            daThuHetTien: selectRows[0].daThuHetTien,
            diaChi: selectRows[0].diachi,
            hinhThucThanhToan: selectRows[0].hinhThucThanhToanId,
            isKhongThuDuocTien: selectRows[0].isKhongThuDuocTien,
            nganHang: selectRows[0].nganHangId,
            ngayTao: moment(selectRows[0].ngayTao),
            ngayTaoPYC: moment(selectRows[0].ngayTaoPYC),
            ngayThu: moment(selectRows[0].ngayThu),
            nguoiLap: selectRows[0].createdBy == userEmail ? user : '',
            noiDung: selectRows[0].lyDoThu,
            soPhieuThu: selectRows[0].soPhieuThu,
            soPhieuYeuCau: selectRows[0].soPhieuYeuCau,
            soTaiKhoan: selectRows[0].soTaiKhoan,
            tongSoTien: selectRows[0].tongSoTien,
            tongSoTienTamThuBangChu: docTien.doc(selectRows[0].tongSoTien),
            soTienDaThu: selectRows[0].soTienDaThu,
            soTienThuThucTe: selectRows[0].soTienThuThucTe,
            soTienThuThucTeBangChu: docTien.doc(selectRows[0].soTienThuThucTe),
            tenKhachHang: selectRows[0].tenKhachHang,
            xuatHoaDon: selectRows[0].isXuatHoaDon
        })
        const setHinhThuc = xacNhanForm.getFieldValue('hinhThucThanhToan')
        setHinhThuc == 1 ? setIsVisible(false) : setIsVisible(true)

        setIsVisibleModalXacNhanThu(true);
        const daThu = xacNhanForm.getFieldValue('daThuHetTien')
        const khongThuDuoc = xacNhanForm.getFieldValue('isKhongThuDuocTien')
        daThu ? setDisableKhongThuDuoc(true) : setDisableKhongThuDuoc(false)
        khongThuDuoc ? setDisableDaThuTien(true) : setDisableDaThuTien(false)


    };

    const showModalHuyPhieuThu = () => {
        if (selectRows.length > 1 || selectRows.length < 1) {
            message.warning(" Chọn 1 dòng để thực hiện")
            return
        }
        setIsVisibleModalHuyPhieuThu(true)
    }

    /* ======================== CANCEL MODAL ======================== */
    const handleCancelEditPTT = () => {
        setIsModalVisiblePTT(false);
    };
    const cancelModalXemPTT = () => {
        setIsVisibleModalXemPTT(false);
    };

    const closeModalXacNhanThu = () => {
        setIsVisibleModalXacNhanThu(false);
        setIsvisibleCK(false)
        setValidateTongTien(false)
        setValidateChecked(false)
    };

    function closeModalHuyPhieuThu() {
        setIsVisibleModalHuyPhieuThu(false)
    }

    const hanldeBoChon = () => {
        setSelectedRowKeys([]);
        setSelectRows([]);
    };

    /* ======================== HANDLE FORM ======================== */
    const handleSubmitSuaForm = async (values) => {
        if (!values.tongSoTien) {
            setValidateTongTienThu(true)
            return
        }

        if (validateChungTu) {
            setDisableLuuButton(true)
            return
        }
        if (values.daThuHetTien && values.isKhongThuDuocTien) {
            message.error('Chi chon 1')
            return
        }
        setDisableLuuButton(false)
        const params = {
            id: selectRows[0].id,
            ngayTao: moment(values.ngayTao).format('YYYY-MM-DD'),
            tenKhachHang: values.tenKhachHang,
            diachi: values.diaChi,
            lyDoThu: values.noiDung,
            tongSoTien: Number(values.tongSoTien) || 0,
            soTienDaThu: values.soTienDaThu || 0,
            soTienThuThucTe: values.soTienThuThucTe || 0,
            ngayThu: moment(values.ngayThu).format('YYYY-MM-DD'),
            isKhongThuDuocTien: values.isKhongThuDuocTien || false,
            daThuHetTien: values.daThuHetTien || false,
            chungTuKemTheo: Number(values.chungTuKemTheo) || 0,
            hinhThucThanhToanId: values.hinhThucThanhToan,
            soTaiKhoan: values.soTaiKhoan || null,
            nganHangId: values.nganHang || null,
            chiNhanhNganHang: values.chiNhanh || null,
            isXuatHoaDon: values.xuatHoaDon,
            trangThai: 1
        }
        try {
            const res = await phieuThuApi.updatePTT(params)
            if (res.succeeded && res.data) {
                message.success('Lưu phiếu thu thành công!');
                suaForm.resetFields()
                handleCancelEditPTT()
                hanldeBoChon()
                // setTimeout(() => {
                //     window.location.reload()
                // })
                // showModalXemPTT()
                setDisableInButton(false)
                setDataList(dataList.map(item => item.id === res.data ? { ...item, ...params } : item))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSuaButton = () => {
        cancelModalXemPTT()
        showModalEditPTT()
    }


    const handleSubmitXacNhanForm = async (values) => {
        const params = {
            id: selectRows[0].id,
            ngayTao: moment(values.ngayTao).format('YYYY-MM-DD'),
            tenKhachHang: values.tenKhachHang,
            diachi: values.diaChi,
            lyDoThu: values.noiDung,
            tongSoTien: Number(values.tongSoTien),
            soTienDaThu: Number(values.soTienDaThu),
            soTienThuThucTe: Number(values.soTienThuThucTe),
            ngayThu: moment(values.ngayThu).format('YYYY-MM-DD'),
            isKhongThuDuocTien: values.isKhongThuDuocTien || false,
            daThuHetTien: values.daThuHetTien || false,
            chungTuKemTheo: values.chungTuKemTheo || 0,
            hinhThucThanhToanId: values.hinhThucThanhToan,
            soTaiKhoan: values.soTaiKhoan || null,
            nganHangId: values.nganHang || null,
            chiNhanhNganHang: values.chiNhanh || null,
            isXuatHoaDon: values.xuatHoaDon,
            trangThai: 2
        }
        if (values.daThuHetTien && values.isKhongThuDuocTien) {
            message.error('Chỉ được chọn 1 giá trị để thực hiện!!!')
            return
        }
        if (values.soTienThuThucTe > 0 && values.daThuHetTien || values.soTienThuThucTe > 0 && values.isKhongThuDuocTien && values.hinhThucThanhToan == 2) {
            try {
                const res = await phieuThuApi.updatePTT(params)
                if (res.succeeded && res.data) {
                    message.success('Xác nhận thu thành công!');
                    xacNhanForm.resetFields()
                    closeModalXacNhanThu()
                    hanldeBoChon()
                    setDataList(dataList.map(item => item.id === res.data ? { ...item, ...params } : item))
                }
            } catch (error) {
                console.log(error)
            }
        }
        else {
            message.error('Điều kiện xác nhận thu không hợp lệ')
            return
        }

    }

    async function submitHuyPhieuThu() {
        const ids = [selectRows[0].id]
        const params = {
            ids,
            trangThai: 3
        }
        try {
            const res = await phieuThuApi.updateTTPTT(params)
            if (res.succeeded && res.data) {
                setDataList(dataList.map(item => item.id == res.data ? { ...item, trangThai: params.trangThai } : item))
                message.success('Hủy phiếu thu thành công!');
                hanldeBoChon()
                closeModalHuyPhieuThu()
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeDaThu = (value) => {
        value ? setDisableKhongThuDuoc(true) : setDisableKhongThuDuoc(false)
        setValidateChecked(false)
    }

    const handleChangeKhongThuDuoc = (value) => {
        value ? setDisableDaThuTien(true) : setDisableDaThuTien(false)
        setValidateChecked(false)
    }

    function handleChange(value) {
        value == 1 ? setIsVisible(false) : setIsVisible(true)
        value == 1 ? setIsvisibleCK(false) : setIsvisibleCK(true)
    }

    function handleChangeChungTu(values) {
        const val = values.target.value

        if (val == '00' || val == '0') {
            setValidateChungTu(true)
            setDisableLuuButton(true)
            return
        }
        suaForm.setFieldsValue({
            chungTuKemTheo: val.replace(/[^0-9\,\.]/g, '').replace('--', '')
        })
        setValidateChungTu(false)
        setDisableLuuButton(false)

    }
    const formatdate = 'DD/MM/YYYY'

    let printDocument = () => {
        try {
            // console.log(selectRows[0])
            // phieuThuApi.getPTTId(selectRows[0].id).then((res) => {
            //     const link = document.createElement("a");
            //     link.href = 'data:application/pdf;base64,' + res.fileContents;
            //     link.download = res.fileDownloadName;
            //     link.click();
            //     message.success('Bạn đã in thành công Phiếu yêu cầu: ' + selectRows[0].soPhieuThu);
            // })
            // phieuYeuCauApi.printPYC(item.id).then((res) => {
            //     const link = document.createElement("a");
            //     link.href = 'data:application/pdf;base64,' + res.fileContents;
            //     link.download = res.fileDownloadName;
            //     link.click();
            //     message.success('Bạn đã in thành công Phiếu yêu cầu: ' + item.soPhieuYeuCau);
            // });
        } catch (error) {
            console.log(error)
        }
    };

    const doiTien = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '').replace('-', '').replace('.', '').replace(',', '')
        suaForm.setFieldsValue({ tongSoTien: val });
        suaForm.setFieldsValue({ tongSoTienTamThuBangChu: docTien.doc(val) });
        if (val == '') {
            suaForm.setFieldsValue({ tongSoTien: 0 });
            suaForm.setFieldsValue({ tongSoTienTamThuBangChu: docTien.doc(val) });
            setValidateTongTien(true)
            setDisableLuuButton(true)
            // setDisableButtonSubmit(true)
            return
        }
        if (val == ',' || val == '.') {
            suaForm.setFieldsValue({ tongSoTien: 0 });
            suaForm.setFieldsValue({ tongSoTienTamThuBangChu: docTien.doc(val) });
            return
        }

        if (val.charAt(0) == 0) {
            suaForm.setFieldsValue({ tongSoTien: val.slice(1) })
            suaForm.setFieldsValue({ tongSoTienTamThuBangChu: docTien.doc(val) });
            return
        }


        // setDisableButtonSubmit(false)
        setDisableLuuButton(false)
        setValidateTongTienThu(false)

    }

    const doiTienThuThucTeXacNhanForm = (values) => {
        const val = values.target.value.replace(/[^0-9]/g, '').replace('-', '').replace('.', '').replace(',', '')
        xacNhanForm.setFieldsValue({ soTienThuThucTe: val });
        xacNhanForm.setFieldsValue({ soTienThuThucTeBangChu: docTien.doc(val) });

        if (val == '') {
            xacNhanForm.setFieldsValue({ soTienThuThucTe: 0 });
            xacNhanForm.setFieldsValue({ soTienThuThucTeBangChu: docTien.doc(val) });
            return
        }
        if (val == ',' || val == '.') {
            xacNhanForm.setFieldsValue({ soTienThuThucTe: 0 });
            xacNhanForm.setFieldsValue({ soTienThuThucTeBangChu: docTien.doc(val) });
            return
        }
        if (val.charAt(0) == 0) {
            xacNhanForm.setFieldsValue({ soTienThuThucTe: val.slice(1) })
            xacNhanForm.setFieldsValue({ soTienThuThucTeBangChu: docTien.doc(val) });
            return
        }

        setValidateSoTienThuThucTe(false)
    };
    const doiTienThuThucTe = (values) => {
        const val = values.target.value.replace(/[^0-9]/g, '').replace('-', '').replace('.', '').replace(',', '')
        suaForm.setFieldsValue({ soTienThuThucTe: val });
        suaForm.setFieldsValue({ soTienThuThucTeBangChu: docTien.doc(val) });

        if (val == '') {
            suaForm.setFieldsValue({ soTienThuThucTe: 0 });
            suaForm.setFieldsValue({ soTienThuThucTeBangChu: docTien.doc(val) });
            return
        }
        if (val == ',' || val == '.') {
            suaForm.setFieldsValue({ soTienThuThucTe: 0 });
            suaForm.setFieldsValue({ soTienThuThucTeBangChu: docTien.doc(val) });
            return
        }
        if (val.charAt(0) == 0) {
            suaForm.setFieldsValue({ soTienThuThucTe: val.slice(1) })
            suaForm.setFieldsValue({ soTienThuThucTeBangChu: docTien.doc(val) });
            return
        }

        setValidateSoTienThuThucTe(false)
    };

    function handleOnChange(page, pageSize) {
        setPageIndex(page);
        setPageSize(pageSize);
    }

    return (
        <div className={styles.container}>
            <Content className={styles.contentContainer}>
                <div className={styles.titleContent}>

                    <h2>Danh sách phiếu thu</h2>
                    <Button
                        size='large'
                        type='default'
                    >
                        <Link href='/ds-phieu-yeu-cau'>
                            <a>Tạo Mới</a>
                        </Link>
                    </Button>
                </div>
                <div className={styles.searchWrapper}>
                    <Input bordered={false}
                        prefix={<SearchOutlined style={{ fontSize: 20 }} />}
                        placeholder="Tìm kiếm..." onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: 10 }} />
                </div>

                <div className={styles.tableContent}>
                    <Table
                        rowKey="id"
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        // dataSource={dataList?.filter(item => item.createdBy == userEmail).reverse()}
                        dataSource={dataList}
                        pagination={{
                            total: data?.recordsTotal,
                            onChange: handleOnChange,
                            size: 'small',
                            defaultPageSize: pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30'],
                        }}
                    />
                </div>
            </Content>
            {selectRows.length > 0 ?
                <Affix>
                    <div className={styles.affixButtonGroup}>
                        <Button
                            size='large'
                            icon={<FundOutlined />}
                            onClick={showModalXemPTT}
                        >
                            Chi tiết
                        </Button>
                        {selectRows[0].trangThai == 1 &&
                            <Button
                                size='large'
                                onClick={showModalXacNhanThu}
                                icon={<PrinterOutlined />}>
                                Xác nhận thu
                            </Button>
                        }
                        <Button
                            size='large'
                            icon={<PrinterOutlined />}
                            onClick={printDocument}>
                            In
                        </Button>

                        {selectRows[0].trangThai != 3 &&
                            <Button
                                size='large'
                                type='danger'
                                onClick={showModalHuyPhieuThu}
                            >Hủy
                            </Button>
                        }
                    </div>
                </Affix >
                : <Affix>
                    <div className={styles.affixButtonGroup}>
                        <Button
                            size='large'
                        >
                            <Link href='/'>
                                <a>Đóng</a>
                            </Link>
                        </Button>
                    </div>
                </Affix>
            }

            {/* ====================== Modal XEM ====================== */}
            <Modal
                visible={isVisibleModalXemPTT}
                closable={null}
                footer={false}
                className={styles.modalContent}
            >
                <Form
                    className={styles.formContent}
                    form={xemForm}
                    name='phieu-tam-thu'
                    layout='vertical'>
                    <div className={styles.modalTitle}>
                        <Typography.Title level={3}>Chi tiết Phiếu Tạm Thu</Typography.Title>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='soPhieuThu' label='Phiếu tạm thu'
                            className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}
                            />
                        </Form.Item>
                        <Form.Item name='ngayTao' label='Ngày tạo' className={styles.formItem}>
                            <DatePicker
                                disabled
                                format={formatdate}

                                className={styles.formItemDatePicker}
                                suffix={<CalendarOutlined />}
                                style={{ color: '#000' }}
                            />
                        </Form.Item>
                        <Form.Item name='nguoiLap' label='Người lập phiếu' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                suffix={<UserAddOutlined
                                    style={{ color: '#000' }}
                                />}
                            />
                        </Form.Item>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='soPhieuYeuCau' label='Số phiếu yêu cầu' className={styles.formItem}>
                            <Input disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                        <Form.Item name='ngayTaoPYC'
                            label='Ngày tạo phiếu' className={styles.formItem}>
                            <DatePicker
                                disabled
                                suffix={<CalendarOutlined />}
                                format={formatdate}
                                className={styles.formItemDatePicker}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='tenKhachHang' label='Tên khách hàng nộp' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>

                        <Form.Item name='diaChi' label='Địa chỉ' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                    </div>

                    <Form.Item name='noiDung' label='Nội dung' className={styles.formItem}
                        rules={[
                            {
                                required: true,
                                message: 'Nội dung không được để trống'
                            },
                            {
                                max: 4000,
                                message: 'Bạn nhập quá số ký tự'
                            }
                        ]}>
                        <Input
                            className={styles.formItemInput}
                            disabled
                            style={{ color: '#000' }}

                        />
                    </Form.Item>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='tongSoTien' label='Tổng số tiền tạm thu' className={styles.formItem}>
                            <InputNumber
                                disabled
                                min={0} controls={false}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className={styles.formItemInput}
                            />
                        </Form.Item>
                        <Form.Item name='tongSoTienTamThuBangChu' className={styles.formItem} label='Số tiền bằng chữ'>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                        <Form.Item name='soTienDaThu' className={styles.formItem} label='Tổng số tiền đã thu'>
                            <InputNumber
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}

                                disabled
                                className={styles.formItemInput}
                            />
                        </Form.Item>
                    </div>

                    <div className={styles.formItemWrapper}>
                        <Form.Item name='soTienThuThucTe' className={styles.formItem} label='Tổng số tiền thu thực tế'>
                            <InputNumber
                                disabled
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}

                                className={styles.formItemInput}
                            />
                        </Form.Item>
                        <Form.Item name='soTienThuThucTeBangChu' className={styles.formItem} label='Số tiền bằng chữ'>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                        <Form.Item name='ngayThu' label='Ngày thu' className={styles.formItem}>
                            <DatePicker
                                disabled
                                format={formatdate}
                                suffix={<CalendarOutlined />}
                                className={styles.formItemDatePicker}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                    </div>

                    <div style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <Form.Item name='isKhongThuDuocTien'
                            style={{ border: 'none', marginBottom: 0 }}
                            className={styles.formItem}
                            valuePropName='checked'>
                            <Checkbox disabled
                                style={{ color: '#000 !important' }}
                            >Không thu được tiền</Checkbox>
                        </Form.Item>
                        <Form.Item name='daThuHetTien' style={{ border: 'none', marginBottom: 8 }}
                            className={styles.formItem}
                            valuePropName='checked'>
                            <Checkbox disabled
                                style={{ color: '#000' }}
                            >Đã thu hết tiền</Checkbox>
                        </Form.Item>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='chungTuKemTheo'
                            label='Chứng từ kèm theo' className={styles.formItem}>
                            <InputNumber
                                controls={false} disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                        <Form.Item name='xuatHoaDon' className={styles.formItem}
                            label='Xuất hóa đơn'
                        >
                            <Select
                                disabled
                                bordered={false}
                                className={styles.formItemSelect}
                                style={{ color: '#000' }}

                            >
                                <Option value={true}>Có</Option>
                                <Option value={false}>Không</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name='hinhThucThanhToan' className={styles.formItem} label='Hình thức thanh toán'>
                            <Select
                                onChange={handleChange}
                                bordered={false}
                                className={styles.formItemSelect} disabled
                                style={{ color: '#000' }}

                            >
                                <Option value={1}>Tiền mặt</Option>
                                <Option value={2}>Chuyển khoản</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {isVisible &&
                        <div className={styles.formItemWrapper}>
                            <Form.Item name='soTaiKhoan' className={styles.formItem} label='Số tài khoản'>
                                <Input
                                    className={styles.formItemInput} disabled
                                />
                            </Form.Item>
                            <Form.Item name='nganHang' label='Ngân hàng' className={styles.formItem}>
                                <Select
                                    disabled
                                    bordered={false}
                                    className={styles.formItemInput}
                                >
                                   {
                                            banks?.map(item =>
                                                <Option key={item.id} value={item.id}>{item.ma}-{item.ten}</Option>
                                                )
                                        }
                                </Select>
                            </Form.Item>
                            <Form.Item name='chiNhanh' label='Chi nhánh' className={styles.formItem}>
                                <Input disabled
                                    className={styles.formItemInput}
                                />
                            </Form.Item>
                        </div>
                    }

                    <div className={styles.formButtonGroup}>
                        {selectRows[0]?.trangThai == 1 &&
                            <>
                                <Button
                                    style={{ border: '1px solid #D1D5DA' }}
                                    icon={<EditOutlined />}
                                    onClick={handleSuaButton}                                        >
                                    Sửa
                                </Button>
                                <Button
                                    style={{ border: '1px solid #D1D5DA' }}
                                    onClick={showModalXacNhanThu}          >
                                    Xác nhận thu
                                </Button>
                                <Button
                                    style={{ border: '1px solid #D1D5DA' }}                          >
                                    In
                                </Button>
                            </>
                        }

                        {selectRows[0]?.trangThai == 2 &&
                            <>
                                <Button
                                    style={{ border: '1px solid #D1D5DA' }}
                                >
                                    Lưu
                                </Button>
                                <Button
                                    style={{ border: '1px solid #D1D5DA' }}
                                >
                                    In
                                </Button>
                            </>
                        }
                        <Button
                            type='danger'
                            icon={<CloseOutlined />}
                            onClick={cancelModalXemPTT}
                        >
                            Đóng
                        </Button>

                    </div>
                </Form>
            </Modal>
            {/* ====================== Modal SUA ====================== */}
            <Modal
                visible={isModalVisiblePTT}
                closable={null}
                footer={false}
                className={styles.modalContent}
            >
                <Form
                    initialValues={
                        {
                            tongSoTienTamThuBangChu: docTien.doc(suaForm.getFieldValue('tongSoTien')),
                            soTienThuThucTeBangChu: docTien.doc(suaForm.getFieldValue(0))
                        }
                    }
                    className={styles.formContent}
                    form={suaForm}
                    name='sua-phieu-tam-thu'
                    layout='vertical'
                    onFinish={handleSubmitSuaForm}>
                    <div className={styles.modalTitle}>
                        <Typography.Title level={3}>Phiếu Thu</Typography.Title>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='soPhieuThu' label='Phiếu tạm thu' className={styles.formItem}>
                            <Input
                                className={styles.formItemInput} disabled
                            />
                        </Form.Item>
                        <Form.Item name='ngayTao' label='Ngày tạo' className={styles.formItem}>
                            <DatePicker
                                format={formatdate}
                                allowClear={false}
                                className={styles.formItemDatePicker}
                                suffix={<CalendarOutlined />} />
                        </Form.Item>

                        <Form.Item name='nguoiLap' label='Người lập phiếu' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                suffix={<UserAddOutlined />}
                            />
                        </Form.Item>

                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='soPhieuYeuCau' label='Số phiếu yêu cầu' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                            />
                        </Form.Item>
                        <Form.Item name='ngayTaoPYC' className={styles.formItem}
                            label='Ngày tạo phiếu'>
                            <DatePicker
                                format={formatdate}
                                disabled
                                suffix={<CalendarOutlined />}
                                className={styles.formItemDatePicker}
                            />
                        </Form.Item>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='tenKhachHang' label='Tên khách hàng nộp' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                            />
                        </Form.Item>
                        <Form.Item name='diaChi' label='Địa chỉ' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item name='noiDung' label='Nội dung' className={styles.formItem}
                        rules={[{
                            required: true,
                            message: ' Phải nhập nội dung'
                        }]}
                    >
                        <Input
                            className={styles.formItemInput}
                        />
                    </Form.Item>

                    <div className={styles.formItemWrapper} style={{ position: 'relative' }}>
                        <Form.Item name='tongSoTien' label='Tổng số tiền tạm thu' className={styles.formItem}>
                            <Input
                                disabled
                                maxLength={16}
                                className={styles.formItemInput}
                                onChange={e => doiTien(e)}
                            />
                        </Form.Item>
                        {validateTongTienThu ? <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>  Tổng số tiền phải lớn hơn 0 </p> : ''}
                        {validateTongTienLength ? <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>  Tổng số tiền chỉ được nhập 20 số</p> : ''}
                        {validateTongTienNhapSo ? <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>  Tổng số tiền phải là số</p> : ""}
                        <Form.Item name='tongSoTienTamThuBangChu' label='Số tiền bằng chữ' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                            />
                        </Form.Item>
                        <Form.Item name='soTienDaThu' label='Tổng số tiền đã thu' className={styles.formItem}>
                            <InputNumber
                                disabled
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className={styles.formItemInput}
                            />
                        </Form.Item>
                    </div>
                    <div className={styles.formItemWrapper} style={{ position: 'relative' }}>
                        <Form.Item name='soTienThuThucTe' className={styles.formItem} label='Tổng số tiền thu thực tế'>
                            <Input
                                maxLength={16}
                                className={styles.formItemInput}
                                onChange={e => doiTienThuThucTe(e)} />
                        </Form.Item>
                        {
                            validateSoTienThuThucTe &&
                            <p style={{ color: 'red', position: 'absolute', top: '80%', left: 0 }}>Số tiền thu thực tế phải lớn hơn hoặc bằng 0</p>
                        }
                        <Form.Item name='soTienThuThucTeBangChu' className={styles.formItem} label='Số tiền bằng chữ'>
                            <Input
                                disabled
                                className={styles.formItemInput}
                            />
                        </Form.Item>
                        <Form.Item name='ngayThu' label='Ngày thu' className={styles.formItem}>
                            <DatePicker
                                allowClear={false}
                                format={formatdate}
                                suffix={<CalendarOutlined />}
                                className={styles.formItemDatePicker}
                            />
                        </Form.Item>
                    </div>

                    <div style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <Form.Item name='isKhongThuDuocTien'
                            style={{ border: 'none', marginBottom: 0 }}
                            className={styles.formItem}
                            valuePropName='checked'>
                            <Checkbox disabled={disableKhongThuDuoc} onChange={e => handleChangeKhongThuDuoc(e.target.checked)}>Không thu được tiền</Checkbox>
                        </Form.Item>
                        <Form.Item name='daThuHetTien' style={{ border: 'none', marginBottom: 8 }}
                            className={styles.formItem}
                            valuePropName='checked'>
                            <Checkbox disabled={disableDaThuTien} onChange={e => handleChangeDaThu(e.target.checked)}>Đã thu hết tiền</Checkbox>
                        </Form.Item>
                    </div>

                    <div className={styles.formItemWrapper} style={{ position: 'relative' }}>
                        <Form.Item name='chungTuKemTheo'
                            label='Chứng từ kèm theo' className={styles.formItem}
                        >
                            <Input
                                maxLength={2}
                                onChange={e => handleChangeChungTu(e)}
                                className={styles.formItemInput}
                            />
                        </Form.Item>
                        {
                            validateChungTu &&
                            <p style={{ color: 'red', position: 'absolute', top: '70%', left: 0 }}>Số chứng từ không hợp lệ</p>
                        }
                        <Form.Item name='xuatHoaDon' className={styles.formItem}
                            label='Xuất hóa đơn'
                            rules={[{
                                required: true,
                                message: 'Chọn'
                            }]}
                        >
                            <Select
                                bordered={false}
                                className={styles.formItemSelect}
                            >
                                <Option value={true}>Có</Option>
                                <Option value={false}>Không</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name='hinhThucThanhToan' className={styles.formItem} label='Hình thức thanh toán'>
                            <Select
                                bordered={false}
                                onChange={handleChange}
                                className={styles.formItemSelect}
                            >
                                <Option value={1}>Tiền mặt</Option>
                                <Option value={2}>Chuyển khoản</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {isVisible &&
                        <div className={styles.formItemWrapper}>
                            <Form.Item name='soTaiKhoan' className={styles.formItem} label='Số tài khoản'>
                                <Input
                                    maxLength={12}
                                    onChange={e => suaForm.setFieldsValue({ soTaiKhoan: e.target.value.replace(/[^0-9\,\.]/g, '').replace('--', '') })}
                                    className={styles.formItemInput}
                                />
                            </Form.Item>
                            <Form.Item name='nganHang' label='Ngân hàng' className={styles.formItem}>
                                <Select
                                    bordered={false}
                                    className={styles.formItemInput}
                                >
                                    {
                                        banks?.map(item =>
                                            <Option key={item.id} value={item.id}>{item.ma}-{item.ten}</Option>
                                        )
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item name='chiNhanh' label='Chi nhánh' className={styles.formItem}>
                                <Input
                                    maxLength={100}
                                    className={styles.formItemInput}
                                />
                            </Form.Item>
                        </div>
                    }

                    <div className={styles.formButtonGroup}>
                        <Button style={{ border: '1px solid #D1D5DA' }}
                            icon={<SaveFilled />}
                            htmlType='submit'
                            disabled={disableLuuButton}
                        >
                            Lưu
                        </Button>
                        {/* {selectRows[0]?.trangThai == 1 &&
                            <Button style={{ border: '1px solid #D1D5DA' }}
                                icon={<CheckCircleOutlined />}
                            >
                                Xác nhận thu
                            </Button>
                        } */}

                        <Button
                            type='default'
                            style={{ border: '1px solid #D1D5DA' }}
                            icon={<PrinterOutlined />}
                            disabled={disableInButton}
                        >
                            In
                        </Button>
                        <Button
                            type='danger'
                            icon={<CloseOutlined />}
                            onClick={handleCancelEditPTT}
                        >
                            Đóng
                        </Button>
                    </div>
                </Form>
            </Modal>
            {/* ====================== Modal XAC NHAN THU ====================== */}
            <Modal
                visible={isVisibleModalXacNhanThu}
                closable={null}
                footer={false}
                className={styles.modalContent}
            >
                <Form
                    className={styles.formContent}
                    form={xacNhanForm}
                    name='phieu-tam-thu'
                    layout='vertical'
                    onFinish={handleSubmitXacNhanForm}>
                    <div className={styles.modalTitle}>
                        <Typography.Title level={3}>Xác nhận Thu </Typography.Title>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='soPhieuThu' label='Phiếu tạm thu'
                            className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}
                            />
                        </Form.Item>
                        <Form.Item name='ngayTao' label='Ngày tạo' className={styles.formItem}>
                            <DatePicker
                                disabled
                                format={formatdate}
                                className={styles.formItemDatePicker}
                                suffix={<CalendarOutlined />} />
                        </Form.Item>
                        <Form.Item name='nguoiLap' label='Người lập phiếu' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                suffix={<UserAddOutlined />}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='soPhieuYeuCau' label='Số phiếu yêu cầu' className={styles.formItem}>
                            <Input disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}
                            />
                        </Form.Item>
                        <Form.Item name='ngayTaoPYC'
                            label='Ngày tạo phiếu' className={styles.formItem}>
                            <DatePicker
                                format={formatdate}
                                disabled
                                suffix={<CalendarOutlined />}
                                className={styles.formItemDatePicker}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                    </div>
                    <div className={styles.formItemWrapper}>
                        <Form.Item name='tenKhachHang' label='Tên khách hàng nộp' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                        <Form.Item name='diaChi' label='Địa chỉ' className={styles.formItem}>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                    </div>

                    <Form.Item name='noiDung' label='Nội dung' className={styles.formItem}
                        rules={[
                            {
                                required: true,
                                message: 'Nội dung không được để trống'
                            },
                            {
                                max: 4000,
                                message: 'Bạn nhập quá số ký tự'
                            }
                        ]}>
                        <Input
                            className={styles.formItemInput}
                            disabled
                            style={{ color: '#000' }}

                        />
                    </Form.Item>

                    <div className={styles.formItemWrapper}>
                        <Form.Item name='tongSoTien' label='Tổng số tiền tạm thu' className={styles.formItem}>
                            <InputNumber
                                disabled
                                min={0} controls={false}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                        <Form.Item name='tongSoTienTamThuBangChu' className={styles.formItem} label='Số tiền bằng chữ'>
                            <Input
                                disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                        <Form.Item name='soTienDaThu' className={styles.formItem} label='Tổng số tiền đã thu'>
                            <InputNumber
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}

                                disabled
                                className={styles.formItemInput}
                                style={{ color: '#000' }}

                            />
                        </Form.Item>
                    </div>

                    <div className={styles.formItemWrapper} style={{ position: 'relative' }}>
                        <Form.Item name='soTienThuThucTe' className={styles.formItem} label='Tổng số tiền thu thực tế'>
                            <Input
                                maxLength={16}
                                className={styles.formItemInput}
                                onChange={e => doiTienThuThucTeXacNhanForm(e)}
                                style={{ color: '#000' }}
                            />
                        </Form.Item>
                        {validateTongTien && <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>Tổng tiền phải lớn hơn 0</p>}
                        <Form.Item name='soTienThuThucTeBangChu' className={styles.formItem} label='Số tiền bằng chữ'>
                            <Input
                                disabled
                                style={{ color: '#000' }}

                                className={styles.formItemInput}
                            />
                        </Form.Item>
                        <Form.Item name='ngayThu' label='Ngày thu' className={styles.formItem}>
                            <DatePicker
                                format={formatdate}
                                allowClear={false}
                                suffix={<CalendarOutlined />}
                                className={styles.formItemDatePicker}
                            />
                        </Form.Item>
                    </div>
                    <div style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <Form.Item name='isKhongThuDuocTien'
                            style={{ border: 'none', marginBottom: 0 }}
                            className={styles.formItem}
                            valuePropName='checked'>
                            <Checkbox disabled={disableKhongThuDuoc} onChange={e => handleChangeKhongThuDuoc(e.target.checked)}>Không thu được tiền</Checkbox>
                        </Form.Item>
                        <Form.Item name='daThuHetTien' style={{ border: 'none', marginBottom: 8 }}
                            className={styles.formItem}
                            valuePropName='checked'>
                            <Checkbox disabled={disableDaThuTien} onChange={e => handleChangeDaThu(e.target.checked)} >Đã thu hết tiền</Checkbox>
                        </Form.Item>
                    </div>

                    <div className={styles.formItemWrapper}>
                        <Form.Item name='chungTuKemTheo'
                            label='Chứng từ kèm theo' className={styles.formItem}>
                            <InputNumber
                                controls={false} disabled
                                className={styles.formItemInput}
                            />
                        </Form.Item>
                        <Form.Item name='xuatHoaDon' className={styles.formItem}
                            label='Xuất hóa đơn'
                        >
                            <Select
                                disabled
                                bordered={false}
                                className={styles.formItemSelect}
                                style={{ color: '#000' }}
                            >
                                <Option value={true}>Có</Option>
                                <Option value={false}>Không</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name='hinhThucThanhToan' className={styles.formItem} label='Hình thức thanh toán'>
                            <Select
                                bordered={false}
                                onChange={handleChange}
                                className={styles.formItemSelect}
                            >
                                <Option value={1}>Tiền mặt</Option>
                                <Option value={2}>Chuyển khoản</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {/* <div style={{ position: 'relative' }}>
                        {
                            isvisibleCK &&
                            <p style={{ color: 'red', position: 'absolute', left: 0, top: '100%' }}>Hình thức thanh toán phải là chuyển khoản</p>
                        }
                    </div> */}

                    {isVisible &&
                        <div className={styles.formItemWrapper}>
                            <Form.Item name='soTaiKhoan' className={styles.formItem} label='Số tài khoản'>
                                <Input
                                    className={styles.formItemInput}
                                    onChange={e => xacNhanForm.setFieldsValue({ soTaiKhoan: e.target.value.replace(/[^0-9\,\.]/g, '').replace('-', '').replace(',', '').replace('.', '') })}

                                />
                            </Form.Item>
                            <Form.Item name='nganHang' label='Ngân hàng' className={styles.formItem}>
                                <Select
                                    bordered={false}
                                    className={styles.formItemInput}
                                >
                                     {
                                            banks?.map(item =>
                                                <Option key={item.id} value={item.id}>{item.ma}-{item.ten}</Option>
                                                )
                                        }
                                </Select>
                            </Form.Item>
                            <Form.Item name='chiNhanh' label='Chi nhánh' className={styles.formItem}>
                                <Input
                                    className={styles.formItemInput}
                                />
                            </Form.Item>
                        </div>
                    }

                    <div className={styles.formButtonGroup}>
                        <Button
                            style={{ border: '1px solid #D1D5DA' }}
                            icon={<EditOutlined />}
                            // onClick={handleXacNhanThuButton}      
                            htmlType='submit'                                  >
                            Lưu
                        </Button>
                        <Button
                            type='danger'
                            icon={<CloseOutlined />}
                            onClick={closeModalXacNhanThu}
                        >
                            Đóng
                        </Button>
                    </div>
                </Form>
            </Modal>
            {/* ====================== Modal HUY PHIEU THU ====================== */}
            <Modal
                visible={isVisibleModalHuyPhieuThu}
                footer={false}
                closable={null}>
                <div className={styles.modalTitle} style={{ marginBottom: 0 }}>
                    <h2>Hủy phiếu thu</h2>
                </div>
                <p style={{ textAlign: 'center' }}>Bạn muốn hủy phiếu thu {`"${selectRows[0]?.soPhieuTamThu || ""}"`} phải k</p>
                <div className={styles.modalHuyPTTButton}>
                    <Button type='primary' onClick={submitHuyPhieuThu}>Hủy phiếu</Button>
                    <Button type='danger' onClick={closeModalHuyPhieuThu}>Đóng</Button>
                </div>
            </Modal>

        </div >
    );
}

QuanLyPhieuThu.Layout = AdminLayout; ///
export default QuanLyPhieuThu;
