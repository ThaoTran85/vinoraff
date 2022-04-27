import { FileAddOutlined, PrinterOutlined, SaveOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
    Button, DatePicker,
    Form,
    Input,
    Layout, message, Modal, Select,
    Table,
    Typography,
    Upload
} from 'antd';
import 'antd/dist/antd.css';
import AdminLayout from 'components/layout/admin';
import React from 'react';
import styles from './bckhaosat.module.css';
import { DocTienBangChu } from 'util';
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { danhMucApi, phieuYeuCauApi } from 'api-client';
import useSWR from 'swr';
import moment from 'moment';
import { baoCaoKhaoSatApi } from 'api-client/baocaokhaosat';
import link from 'next/link';
import { useRouter } from 'next/router';
import { upLoadImageApi } from 'api-client/upload';
const { Header, Sider, Content } = Layout;
const { Option } = Select;

/* COLUMNS */
const columns = [
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
function BCKhaosat() {
    const route = useRouter()
    const [addForm] = Form.useForm()
    const [form] = Form.useForm()
    const currentTime = moment(new Date().getTime())
    const daTa = JSON.parse(sessionStorage.getItem('PYC')) || {};
    const { id, tenKhachHang, soPhieuYeuCau, nguoiLienHeDiKhaoSat, thoiDiemThamDinh, diaChi } = daTa
    let docTien = new DocTienBangChu();
    const formatDate = 'DD/MM/YYYY'

    /** ===================================== STATE ===================================== */
    const [thoiHans, setThoiHans] = useState([])
    const [loaiTaiSans, setLoaiTaiSans] = useState([])
    const [hinhDangs, setHinhDangs] = useState([])
    const [loaiCongTrinhs, setLoaiCongTrinhs] = useState([])
    const [phapLys, setPhapLys] = useState([])
    const [taiSans, setTaiSans] = useState([])
    const [tongQuanTaiSan, setTongQuanTaiSan] = useState([])
    const [hinhChups, setHinhChups] = useState([])
    const [matTienTS, setMatTienTS] = useState([])
    const [duongTiepGiap, setDuongTiepGiap] = useState([])
    const [benTrongTaiSan, setBenTrongTaiSan] = useState([])
    const [soDoViTri, setSoDoViTri] = useState([])
    const [soDoVeTay, setSoDoVeTay] = useState([])
    const [frontCar, setFrontCar] = useState([])
    const [backCar, setbackCar] = useState([])
    const [soKM, setsoKM] = useState([])
    const [hinhChupCanSo, setHinhChupCanSo] = useState([])
    const [benTrongXe, setBenTrongXe] = useState([])
    const [trangThaiPD, setTrangThaiPD] = useState([])
    /** ===================================== VISIBLE ===================================== */
    const [isVisibleModalAdd, setIsVisibleModalAdd] = useState(false)
    const [isVisiblePhuongTien, setIsVisiblePhuongTien] = useState(false)
    const [isVisibleModalPheDuyet, setIsVisibleModalPheDuyet] = useState(false)

    /** ===================================== DISABLED ===================================== */
    const [disableCoThoiHan, setDisableCoThoiHan] = useState(true)
    const [disableHinhDang, setDisableHinhDang] = useState(true)
    const [disableLuuButton, setDisableLuuButton] = useState(false)
    const [disableLoaiTaiSan, setDisableLoaiTaiSan] = useState(false)

    /** ===================================== VALIDATE ===================================== */
    const [validateTongGiaTri, setValidateTongGiaTri] = useState(false)

    /** ===================================== GET DATA ===================================== */
    /*
     * Get PYC
     */
    useEffect(() => {
        async function getPYc() {
            try {
                const res = await phieuYeuCauApi.getPYCId(id)
                if (res.succeeded && res.data) {
                    setTaiSans(res.data?.taiSans)
                    if (res.data?.taiSans.length == 1) {
                        form.setFieldsValue({
                            loaiTS: res.data?.taiSans[0].loaiTaiSanId
                        })
                        setDisableLoaiTaiSan(true)
                        form.getFieldValue('loaiTS') == 1 ? setIsVisiblePhuongTien(true) : setIsVisiblePhuongTien(false)
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        getPYc()
    }, [])

    useEffect(() => {
        async function getLoaiCongTrinhs() {
            const res = await danhMucApi.getDanhMucs('loai-cong-trinh')
            if (res.succeeded && res.data) {
                setLoaiCongTrinhs(res.data)
            }
        }
        getLoaiCongTrinhs()
    }, [setLoaiCongTrinhs])

    useEffect(() => {
        async function getHinhDangs() {
            const res = await danhMucApi.getDanhMucs('hinh-dang-thua-dat')
            if (res.succeeded && res.data) {
                setHinhDangs(res.data)
            }
        }
        getHinhDangs()
    }, [setHinhDangs])

    useEffect(() => {
        async function getThoiHans() {
            try {
                const res = await danhMucApi.getDanhMucs('thoi-han-su-dung')
                if (res.succeeded && res.data) {
                    setThoiHans(res.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getThoiHans()
    }, [setThoiHans])

    useEffect(() => {
        async function getLoaiTaiSans() {
            const res = await danhMucApi.getDanhMucs('loai-tai-san')
            if (res.succeeded && res.data) {
                setLoaiTaiSans(res.data)
            }
        }
        getLoaiTaiSans()
    }, [setLoaiTaiSans])

    /** =================== HANDLE SHOW MODAL =================== */
    const showModalAdd = () => {
        setIsVisibleModalAdd(true)
    }
    const showModalPheDuyet = () => {
        setIsVisibleModalPheDuyet(true)
    }

    /** =================== HANDLE CANCEL MODAL =================== */
    const cancelModalAdd = () => {
        setIsVisibleModalAdd(false)
        addForm.resetFields()
    }
    const cancelModalPheDuyet = () => {
        setIsVisibleModalPheDuyet(false)
    }
    async function uploadImage(key, options) {
        const { file } = options;
        const formdata = new FormData();
        formdata.append('formFile', file); //add field File

        try {
            const res = await upLoadImageApi.uploadFile(formdata)
            if (res.data) {
                const linkImg = 'http://45.119.215.79/thamdinhgia' + res.data
                const loaiHinhAnhBCKhaoSat = key == 'tongQuanTaiSan' ? 1 :
                    key == 'matTienTS' ? 2 :
                        key == 'duongTiepGiap' ? 3 :
                            key == 'benTrongTaiSan' ? 4 :
                                key == 'soDoViTri' ? 5 :
                                    key == 'soDoVeTay' ? 6 :
                                        key == 'frontCar' ? 7 :
                                            key == 'backCar' ? 8 :
                                                key == 'soKM' ? 9 :
                                                    key == 'hinhChupCanSo' ? 10 : 11
                const newData = {
                    url: linkImg,
                    loaiHinhAnhBCKhaoSat

                }
                setHinhChups([...hinhChups, newData])
                // switch (key) {
                //     case 'tongQuanTaiSan':
                //         const newData = {
                //             url: linkImg,
                //             loaiHinhAnhBCKhaoSat: 1
                //         }
                //         setTongQuanTaiSan([...tongQuanTaiSan, newData])
                //         setHinhChups([...hinhChups, newData])
                //         console.log(tongQuanTaiSan)
                //         console.log(newData)
                //         break;

                //     case 'matTienTS':
                //         setMatTienTS(prev => [...prev, { url: linkImg, loaiHinhAnhBCKhaoSat: 2 }])
                //         // setHinhChups(prev => [...prev, { url: linkImg, loaiHinhAnhBCKhaoSat: 2 }])
                //         break;

                //     case 'duongTiepGiap':
                //         setDuongTiepGiap([...duongTiepGiap, linkImg])
                //         break;

                //     case 'benTrongTaiSan':
                //         setBenTrongTaiSan([...benTrongTaiSan, linkImg])
                //         break;

                //     case 'soDoViTri':
                //         setSoDoViTri([...soDoViTri, linkImg])
                //         break;
                //     case 'soDoVeTay':
                //         setSoDoVeTay([...soDoVeTay, linkImg])
                //         break;

                //     case 'frontCar':
                //         setFrontCar([...frontCar, linkImg])
                //         break;

                //     case 'backCar':
                //         setbackCar([...backCar, linkImg])
                //         break;

                //     case 'soKM':
                //         setsoKM([...soKM, linkImg])
                //         break;

                //     case 'hinhChupCanSo':
                //         setHinhChupCanSo([...hinhChupCanSo, linkImg])
                //         break;
                //     case 'benTrongXe':
                //         setBenTrongXe([...benTrongXe, linkImg])
                //         break;

                //     default:
                //         break;
                // }
            }
            else {
                message.error(res.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    console.log(hinhChups)
    /** =================== HANDLE FORM =================== */
    const handleSubmit = async (values) => {

        if (trangThaiPD?.length == 0) showModalPheDuyet()
        else {
            cancelModalPheDuyet()
            const params = {
                phieuYeuCauId: id,
                ngayTao: values.ngayTao,
                maBaoCaoKhaoSat: values.maBaoCaoKhaoSat,
                phaplys: [
                    ...phapLys
                ],
                viTri: values.viTri,
                giaoThong: values.giaoThong,
                huongChinh: values.huongChinh,
                dacDiemThuaDats: [
                    {
                        dienTichDat: values.dienTichDat,
                        chieuRong: values.chieuRong,
                        chieuDai: values.chieuDai,
                        mucDichSuDung: values.mucDichSuDung,
                        thoiHanSuDung: Number(values.thoiHanSuDung) || 0,
                        thongTinThoiHanSuDung: values.thongTinThoiHanSuDung,
                        nguonGocSuDungDat: values.nguonGocSuDungDat,
                        hinhDang: Number(values.hinhDang) || 0,
                        thongTinHinhDang: values.thongTinHinhDang,
                        hienTrangSuDung: values.hienTrangSuDung,
                        luuYKhac: values.luuYKhac,
                    }
                ],
                dacDiemCongTrinhs: [
                    {
                        loaiCongTrinh: Number(values.loaiCongTrinh) || 0,
                        soTang: values.soTang,
                        dienTichXayDung: values.dienTichXayDung,
                        dienTichSuDung: values.dienTichSuDung,
                        namSuDung: values.namSuDung,
                        isCaiTaoSuaChua: true,
                        ketCau: values.ketCau,
                        tienIchKhac: values.tienIchKhac,
                        luuYKhac: values.luuYKhac,
                        loaiCongTrinhKhac: values.loaiCongTrinhKhac,
                    }
                ],
                tongGiaTri: Number(values.tongGiaTri),
                fileDinhGia: "string",
                picture: values.picture,
                trangThai: trangThaiPD,
                loaiTaiSanId: values.loaiTS
            }
            try {
                const res = await baoCaoKhaoSatApi.createBCKS(params)
                if (res.succeeded && res.data) {
                    message.success('Tạo báo cáo khảo sát thành công !!!!!')
                    form.resetFields()
                    route.push('/ds-bao-cao-tham-dinh')
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const submitAddForm = (values) => {
        const key = new Date().getTime()
        const newData = {
            ...values, key
        }
        if (validateTongGiaTri) {
            setDisableLuuButton(true)
            return
        }
        setPhapLys([...phapLys, newData])
        console.log(values)
        addForm.resetFields()

        // const name = dataSource.findIndex(item => item.tenVanBan.toLowerCase().includes(values.tenVanBan.toLowerCase()))
        // console.log('name', name)
        // if (!name) {
        //     message.error('Văn bản đã tồn tại!!!!')
        //     return;
        // }
        // const newData = [...dataSource, values]
        // setDataSource(newData)
    }
    const handlePrintButton = () => {
        console.log('print')
    }
    function onSelectChange(e) {
        e == 1 ? setIsVisiblePhuongTien(true) : setIsVisiblePhuongTien(false)
    }
    function handleThoiHanChange(e) {
        if (e == 1) {
            setDisableCoThoiHan(true)
            return
        }
        setDisableCoThoiHan(false)
    }
    function handleHinhDangChange(e) {
        if (e == 4) {
            setDisableHinhDang(false)
        }
        else {
            setDisableHinhDang(true)
        }
    }
    function handleTongGiaTri(e) {
        const val = e.target.value
        form.setFieldsValue({ tongGiaTri: val.replace(/[^0-9]/g, '').replace(',', '').replace('.', '') });
        form.setFieldsValue({ tongGiaTriBangChu: docTien.doc(val) });

        if (val == '') {
            setValidateTongGiaTri(true)
            setDisableLuuButton(true)
            form.setFieldsValue({ tongGiaTri: 0 });
            form.setFieldsValue({ tongGiaTriBangChu: docTien.doc(val) });
            return
        }
        if (val == ',' || val == '.') {
            setValidateTongGiaTri(true)
            setDisableLuuButton(true)
            form.setFieldsValue({ tongGiaTri: 0 });
            form.setFieldsValue({ tongGiaTriBangChu: docTien.doc(val) });
            return
        }

        if (val.charAt(0) == 0) {
            form.setFieldsValue({ tongGiaTri: val.slice(1) });
            return
        }
        setDisableLuuButton(false)
        setValidateTongGiaTri(false)
        // form.setFieldsValue({ tongGiaTri: val.replace(/[^0-9]/g, '') })
    }
    function onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    function handleChangeYesButton() {
        console.log('log')
        setTrangThaiPD(2)
        cancelModalPheDuyet()
    }
    function handleChangeNoButton() {
        console.log('log')

        setTrangThaiPD(1)
        cancelModalPheDuyet()
    }
    return (
        <div className={styles.container}>
            <Content className={styles.contentContainer}>
                <div className={styles.contentContent}>
                    <div className={styles.contentTitle}>
                        <h1>Báo cáo khảo sát</h1>
                    </div>

                    <div className={styles.formContainer}>
                        <Form
                            layout='vertical'
                            name='bcks'
                            form={form}
                            onFinish={handleSubmit}
                            initialValues={{
                                trangThai: 'Khởi tạo',
                                ngayTao: currentTime,
                                tenKhachHang: tenKhachHang,
                                soPhieuYeuCau,
                                ngayKhaoSatDuKien: moment(thoiDiemThamDinh),
                                nguoiThucHien: nguoiLienHeDiKhaoSat,
                                diaDiem: diaChi,
                            }}
                            className={styles.formContent}>
                            <div className={styles.formItemWrapper}>
                                <Form.Item
                                    label='Trạng thái'
                                    name='trangThai'
                                    className={styles.formItem}
                                >
                                    <Input
                                        disabled
                                        className={styles.formItemInput} />
                                </Form.Item>
                                <Form.Item
                                    label='Mã báo cáo'
                                    className={styles.formItem}
                                    name='maBaoCaoKhaoSat'
                                >
                                    <Input
                                        disabled
                                        className={styles.formItemInput} />
                                </Form.Item>

                                <Form.Item
                                    label='Ngày báo cáo'
                                    name='ngayTao'
                                    className={styles.formItem}
                                    rules={[{
                                        required: true,
                                        message: 'Bắt buộc nhập!!!'
                                    }]}>
                                    <DatePicker
                                        allowClear={false}
                                        format={formatDate}
                                        className={styles.formItemDatePicker} />
                                </Form.Item>
                            </div>

                            <div className={styles.formItemWrapper}>
                                <Form.Item
                                    className={styles.formItem}
                                    label='Tên Khách hàng'
                                    name='tenKhachHang'>
                                    <Input
                                        className={styles.formItemInput}
                                        disabled />
                                </Form.Item>
                                <Form.Item name='soPhieuYeuCau'
                                    label='Số phiếu yêu cầu'
                                    className={styles.formItem}>
                                    <Input placeholder='Vui lòng nhập'
                                        disabled
                                        className={styles.formItemInput} />
                                </Form.Item>
                                <Form.Item name='ngayKhaoSatDuKien'
                                    label='Ngày khảo sát'
                                    className={styles.formItem}>
                                    <DatePicker placeholder='Vui lòng nhập'
                                        disabled
                                        format={formatDate}
                                        className={styles.formItemDatePicker} />
                                </Form.Item>
                            </div>

                            <div className={styles.formItemWrapper}>
                                <Form.Item name='nguoiThucHien'
                                    label='Người thực hiện khảo sát'
                                    className={styles.formItem}>
                                    <Input className={styles.formItemInput} disabled />
                                </Form.Item>
                                <Form.Item name='diaDiem'
                                    label='Địa điểm khảo sát'
                                    className={styles.formItem}
                                >
                                    <Input className={styles.formItemInput} disabled />
                                </Form.Item>
                                <Form.Item
                                    label='Loại tài sản'
                                    name='loaiTS'
                                    className={styles.formItem}
                                    rules={[{
                                        required: true,
                                        message: 'Bắt buộc nhập!!!'
                                    }]}>

                                    <Select
                                        className={styles.formItemSelect}
                                        disabled={disableLoaiTaiSan}
                                        onChange={e => onSelectChange(e)}>
                                        {
                                            loaiTaiSans?.map(item =>
                                                <Option value={item.value} key={item.value}>{item.description}</Option>
                                            )}
                                    </Select>

                                </Form.Item>
                            </div>

                            <h2>Thông tin tài sản thẩm định giá</h2>
                            <h2>A. Pháp lý tài sản</h2>
                            <div>
                                <Table columns={columns} dataSource={phapLys} />
                                {
                                    phapLys?.length < 5 &&
                                    <Button type='primary' icon={<PlusOutlined />} onClick={showModalAdd}>Thêm</Button>

                                }
                            </div>
                            <h2>B. Đặc điểm chung của tài sản</h2>
                            {isVisiblePhuongTien &&
                                <>
                                    <Form.Item name='viTri' label='Vị trí bất động sản'
                                        className={styles.formItem}
                                        rules={[{
                                            required: true,
                                            message: 'Bắt buộc nhập!!!'
                                        }]}>
                                        <Input className={styles.formItemInput} />
                                    </Form.Item>
                                    <Form.Item name='giaoThong' label='Giao thông'
                                        className={styles.formItem}
                                        rules={[{
                                            required: true,
                                            message: 'Bắt buộc nhập!!!'
                                        }]}>
                                        <Input className={styles.formItemInput} />
                                    </Form.Item>
                                    <Form.Item name='huongChinh' label='Hướng chính'
                                        className={styles.formItem}
                                        rules={[{
                                            required: true,
                                            message: 'Bắt buộc nhập!!!'
                                        }]}>
                                        <Input className={styles.formItemInput} />
                                    </Form.Item>
                                </>}

                            <h2>C. Đặc điểm thửa đất</h2>
                            {isVisiblePhuongTien &&
                                <>
                                    <div className={styles.formItemWrapper}>
                                        <Form.Item name='dienTichDat' label='Diện tích đất'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Input className={styles.formItemInput} maxLength={20} />
                                        </Form.Item>
                                        <Form.Item name='chieuDai' label='Chiều dài'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Input className={styles.formItemInput} maxLength={20} />
                                        </Form.Item>
                                        <Form.Item name='chieuRong' label='Chiều rộng'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Input className={styles.formItemInput} maxLength={20} />
                                        </Form.Item>
                                    </div>

                                    <Form.Item name='mucDichSuDung' label='Mục đích sử dụng'
                                        className={styles.formItem}
                                        rules={[{
                                            required: true,
                                            message: 'Bắt buộc nhập!!!'
                                        }]}>
                                        <Input className={styles.formItemInput} maxLength={1000} />
                                    </Form.Item>
                                    <div className={styles.formItemWrapper}>
                                        <Form.Item name='thoiHanSuDung' label='Thời hạn sử dụng'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Select
                                                className={styles.formItemSelect}
                                                onChange={e => handleThoiHanChange(e)}>
                                                {
                                                    thoiHans?.map(item =>
                                                        <Option value={item.value} key={item.value}>{item.description}</Option>)
                                                }
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name='thongTinThoiHanSuDung' label='Thông tin cụ thể'
                                            className={styles.formItem}>
                                            <Input className={styles.formItemInput}
                                                disabled={disableCoThoiHan}
                                            />
                                        </Form.Item>
                                    </div>

                                    <Form.Item name='nguonGocSuDungDat' label='Nguồn gốc sử dụng'
                                        className={styles.formItem}
                                        rules={[{
                                            required: true,
                                            message: 'Bắt buộc nhập!!!'
                                        }]}>
                                        <Input className={styles.formItemInput} />
                                    </Form.Item>
                                    <div className={styles.formItemWrapper}>
                                        <Form.Item name='hinhDang' label='Hình dáng'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Select
                                                onChange={e => handleHinhDangChange(e)}>
                                                {hinhDangs?.map(item =>
                                                    <Option key={item.value} value={item.value}>{item.description}</Option>)}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name='thongTinHinhDang' label='Mô tả cụ thể'
                                            className={styles.formItem}
                                        >
                                            <Input className={styles.formItemInput} disabled={disableHinhDang} />
                                        </Form.Item>
                                    </div>
                                    <Form.Item name='hienTrangSuDung' label='Hiện trạng sử dụng'
                                        className={styles.formItem}
                                        rules={[{
                                            required: true,
                                            message: 'Bắt buộc nhập!!!'
                                        }]}>
                                        <Input className={styles.formItemInput} />
                                    </Form.Item>
                                    <Form.Item name='luuYKhac' label='Lưu ý khác'
                                        className={styles.formItem}
                                        rules={[{
                                            required: true,
                                            message: 'Bắt buộc nhập!!!'
                                        }]}>
                                        <Input className={styles.formItemInput} />
                                    </Form.Item>
                                </>
                            }

                            <h2>D. Đặc điểm chi tiết về công trình nhà cửa, vật kiến trúc</h2>
                            {isVisiblePhuongTien &&
                                <>
                                    <div className={styles.formItemWrapper}>
                                        <Form.Item name='loaiCongTrinh' label='Loại công trình'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Select>
                                                {
                                                    loaiCongTrinhs?.map(item =>
                                                        <Option value={item.value} key={item.value}>{item.description}</Option>)
                                                }
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name='soTang' label='Số tầng'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Input className={styles.formItemInput} maxLength={20} />
                                        </Form.Item>
                                    </div>

                                    <div className={styles.formItemWrapper}>
                                        <Form.Item name='dienTichXayDung' label='Diện tích xây dựng'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Input className={styles.formItemInput} maxLength={20} />
                                        </Form.Item>
                                        <Form.Item name='dienTichSuDung' label='Diện tích sử dụng'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Input className={styles.formItemInput} maxLength={20} />
                                        </Form.Item>
                                    </div>
                                    <div className={styles.formItemWrapper}>
                                        <Form.Item name='namSuDung' label='Năm sử dụng'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Input className={styles.formItemInput} />
                                        </Form.Item>
                                        <Form.Item name='isCaiTaoSuaChua' label='Cải tạo sửa chữa'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Select className={styles.formItemSelect} >
                                                <Option value={true}>Có</Option>
                                                <Option value={false}>Không</Option>
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    <Form.Item name='ketCau' label='Kết cấu'
                                        className={styles.formItem}
                                        rules={[{
                                            required: true,
                                            message: 'Bắt buộc nhập!!!'
                                        }]}>
                                        <Input className={styles.formItemInput} maxLength={1000} />
                                    </Form.Item>
                                    <div className={styles.formItemWrapper}>
                                        <Form.Item name='tienIchKhac' label='Tiện ích khác'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Input className={styles.formItemInput} maxLength={1000} />
                                        </Form.Item>
                                        <Form.Item name='luuYKhac' label='Lưu ý khác'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Input className={styles.formItemInput} maxLength={1000} />
                                        </Form.Item>
                                        <Form.Item name='loaiCongTrinhKhac' label='Loại công trình khác'
                                            className={styles.formItem}
                                            rules={[{
                                                required: true,
                                                message: 'Bắt buộc nhập!!!'
                                            }]}>
                                            <Input className={styles.formItemInput} maxLength={1000} />
                                        </Form.Item>
                                    </div>
                                </>

                            }
                            <h2>Kết quả thẩm định giá</h2>
                            <div className={styles.formItemWrapper} style={{ position: 'relative' }}>
                                <Form.Item name='tongGiaTri'
                                    label='Tổng giá trị tài sản'
                                    className={styles.formItem}
                                    rules={[{
                                        required: true,
                                        message: 'Bắt buộc nhập!!!'
                                    }]}>
                                    <Input placeholder='Vui lòng nhập'
                                        maxLength={16}
                                        onChange={handleTongGiaTri}
                                        className={styles.formItemInput} style={{ width: '100%' }} />
                                </Form.Item>
                                {
                                    validateTongGiaTri &&
                                    <p style={{ color: 'red', position: 'absolute', top: '75%', left: 0 }}>Tổng tài sản phải lớn hơn 0</p>

                                }
                                <Form.Item name='tongGiaTriBangChu'
                                    label='Bằng chữ'
                                    className={styles.formItem}>
                                    <Input placeholder='Vui lòng nhập'
                                        className={styles.formItemInput} />
                                </Form.Item>
                            </div>
                            <h2>Ảnh chụp tài sản</h2>

                            <Form.Item
                                name='picture'
                                className={styles.formItem}
                                style={{ border: 'none' }}>
                                {/* <Upload
                                    listType="picture"
                                    accept="image/*"
                                    customRequest={uploadImage}
                                >
                                    <Button icon={<UploadOutlined />}
                                    >Upload</Button>
                                </Upload> */}

                                <div className={styles.upload}>
                                    <h3>Tổng quan tài sản</h3>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 1).map(item => {
                                                const key = new Date().getTime()
                                                return <img src={item.url} />
                                            })}
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('tongQuanTaiSan', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                                <div>
                                    <h3>Mặt tiền tài sản</h3>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 2).map(item => {
                                                const key = new Date().getTime()
                                                return < img src={item.url} />
                                            })
                                        }
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('matTienTS', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                                <div>
                                    <h3>Đường tiếp giáp với tài sản</h3>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 3).map(item => {
                                                const key = new Date().getTime()
                                                return < img src={item.url} />
                                            })
                                        }
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('duongTiepGiap', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                                <div>
                                    <p>Bên trong tài sản</p>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 4).map(item => {
                                                const key = new Date().getTime()
                                                return < img src={item.url} />
                                            })
                                        }
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('benTrongTaiSan', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                                <div>
                                    <p>Sơ đồ vị trí</p>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 5).map(item => {
                                                const key = new Date().getTime()
                                                return < img src={item.url} />
                                            })
                                        }
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('soDoViTri', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                                <div>
                                    <p>Sơ đồ vẽ tay</p>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 6).map(item => {
                                                const key = new Date().getTime()
                                                return < img src={item.url} />
                                            })
                                        }
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('soDoVeTay', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                                <div>
                                    <p>Phía trước xe</p>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 7).map(item => {
                                                const key = new Date().getTime()
                                                return < img src={item.url} />
                                            })
                                        }
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('frontCar', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                                <div>
                                    <p>Phía sau xe</p>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 8).map(item => {
                                                const key = new Date().getTime()
                                                return < img src={item.url} />
                                            })
                                        }
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('backCar', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                                <div>
                                    <p>Số kilomet đã chạy</p>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 9).map(item => {
                                                const key = new Date().getTime()
                                                return < img src={item.url} />
                                            })
                                        }
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('soKM', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                                <div>
                                    <p>Hình chụp cần số</p>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 10).map(item => {
                                                const key = new Date().getTime()
                                                return < img src={item.url} />
                                            })
                                        }
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('hinhChupCanSo', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                                <div>
                                    <p>Bên trong xe</p>
                                    <div className={styles.imageUpload}>
                                        {
                                            hinhChups?.length > 0 &&
                                            hinhChups.filter(item => item.loaiHinhAnhBCKhaoSat == 11).map(item => {
                                                const key = new Date().getTime()
                                                return < img src={item.url} />
                                            })
                                        }
                                    </div>
                                    <Upload onChange={onChange}
                                        customRequest={(options) => uploadImage('benTrongXe', options)}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </div>
                            </Form.Item>
                            <div className={styles.formButtonGroup}>
                                <Button
                                    icon={<SaveOutlined />}
                                    htmlType='submit'
                                    disabled={disableLuuButton}
                                >
                                    Lưu
                                </Button>
                                <Button
                                    icon={<PrinterOutlined />}
                                    onClick={handlePrintButton}
                                >
                                    In
                                </Button>
                                <Button
                                    type='danger'                                >
                                    <Link href='/'>
                                        <a>Đóng</a>
                                    </Link>
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div >
            </Content >

            <Modal
                visible={isVisibleModalAdd}
                footer={false}
                closable={null}>
                <Form
                    name='addForm'
                    form={addForm}
                    onFinish={submitAddForm}
                    layout='vertical'>
                    <div>
                        <Typography.Title level={2} style={{ textAlign: 'center' }}>Thêm văn bản</Typography.Title>
                    </div>
                    <Form.Item name='tenVanBan' label='Tên văn bản'
                        rules={[{
                            required: true,
                            message: 'Bắt buộc nhập!!!'
                        }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='soBanHanh' label='Số ban hành'
                        rules={[{
                            required: true,
                            message: 'Bắt buộc nhập!!!'
                        }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='coQuanCap' label='Cơ quan cấp'
                        rules={[{
                            required: true,
                            message: 'Bắt buộc nhập!!!'
                        }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='chuTaiSan' label='Chủ tài sản'
                        rules={[{
                            required: true,
                            message: 'Bắt buộc nhập!!!'
                        }]}>
                        <Input />
                    </Form.Item>
                    <div className={styles.formItemWrapper}>
                        <Button type='primary'
                            htmlType='submit'>Thêm</Button>
                        <Button type='danger'
                            onClick={cancelModalAdd}>Đóng</Button>
                    </div>
                </Form>
            </Modal>

            <Modal
                visible={isVisibleModalPheDuyet}
                footer={false}
                closable={null}>
                <p>Bạn có muốn gửi phê duyệt không</p>
                <div>
                    <Button onClick={handleChangeYesButton}>Có</Button>
                    <Button onClick={handleChangeNoButton}>Không</Button>
                </div>
            </Modal>
        </div >
    );
}

BCKhaosat.Layout = AdminLayout; ///
export default BCKhaosat;
