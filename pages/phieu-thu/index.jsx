import {
    CalendarOutlined, PrinterOutlined,
    SaveFilled,
    UserAddOutlined
} from '@ant-design/icons';
import {
    Alert,
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Layout,
    message,
    Select,
    Typography
} from 'antd';
import 'antd/dist/antd.css';
import { danhMucApi, phieuThuApi } from 'api-client';
import { nganHangApi } from 'api-client/nganHangApi';
import AdminLayout from 'components/layout/admin';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DocTienBangChu, isBuffer } from 'util';
import { phieuYeuCauApi } from '../../api-client/phieuyeucau';
import { useAuth } from '../../hooks/use-auth';
import styles from './phieuthu.module.css';
const { Content } = Layout;
const { Option } = Select;

function PhieuThu() {
    const [form] = Form.useForm();
    const router = useRouter()
    const { getUserInfo } = useAuth()
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleSoTienThuThucTe, setIsVisibleSoTienThuThucTe] = useState(false)
    const [disableButtonSubmit, setDisableButtonSubmit] = useState(false)
    const formatDate = 'DD/MM/YYYY';
    const daTa = JSON.parse(sessionStorage.getItem('PYC')) || {};

    const [user, setUser] = useState([])
    const [hinhThucThanhToan, setHinhThucThanhToan] = useState([])
    const [disabledSoTienThuThucTe, setDisabledSoTienThuThucTe] = useState(false)
    const [khongThuDuoc, setKhongThuDuoc] = useState(false)
    const [daThuTien, setDaThuTien] = useState(false)

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
    async function getData() {
        try {
            const res = await getUserInfo()
            if (res.status) {
                setUser(res.uInfo_name)
                form.setFieldsValue({
                    nguoiLap: user.length > 0 ? user : ''
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getHinhThucThanhToan() {
        const res = await danhMucApi.getDanhMucs('hinh-thuc-thanh-toan')
        if (res.succeeded && res.data) {
            setHinhThucThanhToan(res.data)
        }
    }

    getData()
    useEffect(() => {
        getHinhThucThanhToan()
        pycID()
        hinhThucThanhToanId == 1 ? setIsVisible(true) : setIsVisible(false)
    }, [])
    const {
        soPhieuYeuCau,
        soHopDong,
        ngayTao: ngayTaoPhieuYeuCau,
        tenKhachHang,
        diaChi,
        isXuatHoaDon,
        hinhThucThanhToanId,
        id,
        tamUng,
    } = daTa;

    const pycID = async () => {
        try {
            const res = await phieuYeuCauApi.getPYCId(id)
            if (res.succeeded && res.data) {
                let PTT = res.data?.phieuThus
                let newPTT = PTT.filter(item => item.trangThai == 2).map(item => item.soTienThuThucTe)
                if (newPTT.length > 0) {
                    form.setFieldsValue({
                        soTienDaThu: newPTT.reduce((tong, item) => tong + item),
                    })
                    setDaThuTien(false)
                    setKhongThuDuoc(false)
                }
                else {
                    form.setFieldsValue({
                        soTienDaThu: 0,
                    })
                    setDaThuTien(false)
                    setKhongThuDuoc(false)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const soTienThuThucTe = form.getFieldValue('soTienThuThucTe')

        if (soTienThuThucTe == 0) {
            form.setFieldsValue({
                khongThuDuoc: false,
                daThu: false
            })
            setDaThuTien(true)
            setKhongThuDuoc(true)
        }
    }, [])
    const getDate = new Date();
    const currentTime = moment(getDate.getTime());

    const handleSubmit = async (values) => {
        const params = {
            ngayTaoPhieuYeuCau: values.ngayTaoPhieuYeuCau,
            phieuYeuCauId: id,
            ngayTao: values.ngayTao,
            tenKhachHang: values.tenKhachHang,
            diachi: values.diaChi,
            lyDoThu: values.noiDung,
            tongSoTien: values.tongSoTien || 0,
            soTienDaThu: values.soTienDaThu || 0,
            soTienThuThucTe: values.soTienThuThucTe || 0,
            ngayThu: values.ngayThu,
            isKhongThuDuocTien: values.khongThuDuoc,
            daThuHetTien: values.daThu,
            chungTuKemTheo: values.chungTu || 0,
            hinhThucThanhToanId: values.hinhThucThanhToanId,
            soTaiKhoan: values.soTaiKhoan || null,
            nganHangId: values.nganHang || null,
            chiNhanhNganHang: values.chiNhanh || null,
            isXuatHoaDon: values.isXuatHoaDon,
            trangThai: 1
        };

        if (validateChungTu || validateTongTien || validateTienThuThucTe || validateChungThuLength) {
            // setDisableButtonSubmit(true)
            return
        }
        if (!values.tongSoTien) {
            setValidateTongTien(true)
            // message.error('S??? ti???n kh??ng h???p l???')
            return
        }

        setValidateTongTien(false)
        setValidateTienThuThucTe(false)
        try {
            const res = await phieuThuApi.createPTT(params)
            if (res.succeeded && res.data) {
                message.success('L??u phi???u thu th??nh c??ng!');
                form.resetFields()
                sessionStorage.clear()
                router.push('/ds-phieu-thu')
            } else {
                message.success(res.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    let docTien = new DocTienBangChu();

    const [validateTongTienNhapSo, setValidateTongTienNhapSo] = useState(false)
    const [validateTongTien, setValidateTongTien] = useState(false)
    const [validateTongTienLength, setValidateTongTienLength] = useState(false)

    const doiTien = (e) => {
        const val = e.target.value.replace('-', '').replace('.', '').replace(',', '').replace(/[^0-9]/g, '')

        form.setFieldsValue({ tongSoTien: val });
        form.setFieldsValue({ soTienBangChu: docTien.doc(val) });
        if (val == '') {
            form.setFieldsValue({ tongSoTien: 0 });
            form.setFieldsValue({ soTienBangChu: docTien.doc(val) });
            // setValidateTongTien(true)
            // setDisableButtonSubmit(true)
            return
        }
        if (val == ',' || val == '.') {
            form.setFieldsValue({ tongSoTien: 0 });
            form.setFieldsValue({ soTienBangChu: docTien.doc(val) });
            // setValidateTongTien(true)
            // setDisableButtonSubmit(true)
            return
        }

        if (val.charAt(0) == 0) {
            form.setFieldsValue({ tongSoTien: val.slice(1) })
            form.setFieldsValue({ soTienBangChu: docTien.doc(val) });
            return
        }

        setDisableButtonSubmit(false)
        setValidateTongTienNhapSo(false)
        setValidateTongTien(false)
    };
    const [validateTienThuThucTeNhapSo, setValidateTienThuThucTeNhapSo] = useState(false)
    const [validateTienThuThucTe, setValidateTienThuThucTe] = useState(false)
    const [validateTienThuThucTeLength, setValidateTienThuThucTeLength] = useState(false)
    const doiTienThuThucTe = (values) => {
        const val = values.target.value.replace(/[^0-9\,\.]/g, '').replace('-', '').replace('.', '').replace(',', '')
        form.setFieldsValue({ soTienThuThucTe: val });
        form.setFieldsValue({ soTienThuThucTebangChu: docTien.doc(val) });
        if (val.length > 16) {
            setValidateTienThuThucTeLength(true)
            return
        }
        if (val == '') {
            form.setFieldsValue({
                soTienThuThucTe: 0,
            });
            form.setFieldsValue({ soTienThuThucTebangChu: docTien.doc(val) });
            return
        }
        if (val == ',' || val == '.') {
            // form.setFieldsValue({
            //     soTienThuThucTe: 0,
            // });
            // form.setFieldsValue({ soTienThuThucTebangChu: docTien.doc(val) });
            return
        }
        if (val.charAt(0) == 0) {
            form.setFieldsValue({ soTienThuThucTe: val.slice(1) })
            form.setFieldsValue({ soTienThuThucTebangChu: docTien.doc(val) });
            return
        }

        setDisableButtonSubmit(false)
        setValidateTienThuThucTeNhapSo(false)
        setValidateTienThuThucTe(false)
        setValidateTienThuThucTeLength(false)
        setDaThuTien(false)
        setKhongThuDuoc(false)


    };
    const handleChange = (values) => {
        if (values == 2) {
            setIsVisible(true)
        }
        else {
            setIsVisible(false)
        }

    };

    useEffect(() => {
        hinhThucThanhToanId == 2 ? setIsVisible(true) : setIsVisible(false)
    }, []);

    const handleResetField = () => {
        form.resetFields();
    };

    const onCheckBoxDaThuChange = (values) => {
        values.target.checked ? setKhongThuDuoc(true) : setKhongThuDuoc(false)
    }
    const onCheckBoxkhongThuDuocChange = (values) => {
        values.target.checked ? setDaThuTien(true) : setDaThuTien(false)
    }

    const [validateChungTu, setValidateChungTu] = useState(false)
    const [validateChungThuLength, setValidateChungThuLength] = useState(false)
    function handleChangeChungTu(values) {
        const val = values.target.value
        if (val == '00' || val == '0') {
            setValidateChungTu(true)
            setDisableButtonSubmit(true)
            return
        }

        form.setFieldsValue({
            chungTu: val.replace(/[^0-9\,\.]/g, '').replace('-', '').replace('.', '').replace(',', '')
        })

        setDisableButtonSubmit(false)
        setValidateChungTu(false)
    }

    return (
        <div className={styles.container}>
            <Content className={styles.contentContainer}>
                <div className={styles.contentTitle}>
                    <Typography.Title level={1}>PHI???U THU</Typography.Title>
                </div>

                <div className={styles.formContainer}>
                    <Form
                        initialValues={{
                            ngayTao: moment(currentTime),
                            ngayThu: moment(currentTime),
                            daThu: false,
                            khongThuDuoc: false,
                            soPhieuYeuCau: soPhieuYeuCau,
                            soHopDong: soHopDong,
                            ngayTaoPhieuYeuCau: moment(ngayTaoPhieuYeuCau),
                            tenKhachHang: tenKhachHang,
                            diaChi: diaChi,
                            isXuatHoaDon: isXuatHoaDon,
                            hinhThucThanhToanId: hinhThucThanhToanId,
                            soTienThuThucTe: 0,
                            soTienThuThucTebangChu: docTien.doc(0),
                            tongSoTien: tamUng,
                            soTienBangChu: docTien.doc(tamUng) || '',
                            trangThai: 'Kh???i t???o'
                        }}
                        className={styles.formContent}
                        form={form}
                        name="phieu-tam-thu"
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <div className={styles.formItemWrapper}>
                            <Form.Item
                                name="trangThai"
                                label="Tr???ng th??i"
                                className={styles.formItem}

                            >
                                <Input className={styles.formItemInput} disabled style={{ color: '#000' }} />
                            </Form.Item>
                            <Form.Item
                                name="phieuTamThu"
                                label="S??? phi???u"
                                className={styles.formItem}

                            >
                                <Input className={styles.formItemInput} disabled style={{ color: '#000' }} />
                            </Form.Item>
                            <Form.Item
                                name="ngayTao"
                                label="Ng??y t???o"
                                className={styles.formItem}
                            >
                                <DatePicker
                                    allowClear={false}
                                    className={styles.formItemDatePicker}
                                    format={formatDate}
                                    suffix={<CalendarOutlined />}
                                />
                            </Form.Item>
                            <Form.Item
                                name="nguoiLap"
                                label="Ng?????i l???p phi???u"
                                className={styles.formItem}
                            >
                                <Input
                                    disabled
                                    className={styles.formItemInput}
                                    suffix={<UserAddOutlined />}
                                    style={{ color: '#000' }}
                                />
                            </Form.Item>
                        </div>
                        <div className={styles.formItemWrapper}>
                            <Form.Item
                                name="soPhieuYeuCau"
                                label="S??? phi???u y??u c???u"
                                className={styles.formItem}
                            >
                                <Input disabled style={{ color: '#000' }} />
                            </Form.Item>
                            <Form.Item
                                name="soHopDong"
                                label="S??? h???p ?????ng"
                                className={styles.formItem}
                            >
                                <Input disabled className={styles.formItemDatePicker} style={{ color: '#000' }} />
                            </Form.Item>
                            <Form.Item
                                name="ngayTaoPhieuYeuCau"
                                label="Ng??y t???o phi???u"
                                className={styles.formItem}
                            >
                                <DatePicker
                                    disabled
                                    suffix={<CalendarOutlined />}
                                    className={styles.formItemDatePicker}
                                    format={formatDate}
                                    style={{ color: '#000' }}
                                />
                            </Form.Item>
                        </div>

                        <div className={styles.formItemWrapper}>
                            <Form.Item
                                name="tenKhachHang"
                                label="T??n kh??ch h??ng n???p"
                                className={styles.formItem}
                            >
                                <Input disabled className={styles.formItemInput} style={{ color: '#000' }} />
                            </Form.Item>

                            <Form.Item name="diaChi" label="?????a ch???" className={styles.formItem}>
                                <Input disabled className={styles.formItemInput} style={{ color: '#000' }} />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="noiDung"
                            label="N???i dung"
                            className={styles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'N???i dung kh??ng ???????c ????? tr???ng',
                                },
                                {
                                    max: 4000,
                                    message: 'B???n nh???p qu?? s??? k?? t???',
                                },
                            ]}
                        >
                            <Input placeholder="N???i dung" className={styles.formItemInput} onChange={e => form.setFieldsValue({
                                noiDung: e.target.value.replace('/', '').replace('\\', '')
                            })} />
                        </Form.Item>

                        <div className={styles.formItemWrapper} style={{ position: 'relative' }}>
                            <Form.Item
                                name="tongSoTien"
                                label="T???ng s??? ti???n t???m thu"
                                className={styles.formItem}
                            >
                                <Input
                                    maxLength={16}
                                    className={styles.formItemInput}
                                    onChange={e => doiTien(e)}
                                />
                            </Form.Item>
                            {validateTongTien ? <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>  T???ng s??? ti???n ph???i l???n h??n 0 </p> : ''}
                            {validateTongTienLength ? <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>  T???ng s??? ti???n ch??? ???????c nh???p 20 s???</p> : ''}
                            {validateTongTienNhapSo ? <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>  T???ng s??? ti???n ph???i l?? s???</p> : ""}

                            <Form.Item
                                name="soTienBangChu"
                                className={styles.formItem}
                                label="S??? ti???n b???ng ch???"
                            >
                                <Input disabled className={styles.formItemInput} style={{ color: '#000' }} />
                            </Form.Item>

                            <Form.Item
                                name="soTienDaThu"
                                label="S??? ti???n ???? thu"
                                className={styles.formItem}
                            >
                                <InputNumber
                                    disabled
                                    controls={false}
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    className={styles.formItemInput}
                                />
                            </Form.Item>
                        </div>

                        <div className={styles.formItemWrapper} style={{ position: 'relative' }}>
                            <Form.Item
                                name="soTienThuThucTe"
                                label="S??? ti???n thu th???c t???"
                                className={styles.formItem}
                            >
                                <Input
                                    disabled={disabledSoTienThuThucTe}
                                    maxLength={16}
                                    className={styles.formItemInput}
                                    onChange={e => doiTienThuThucTe(e)}
                                    style={{ color: '#000' }}
                                />
                            </Form.Item>
                            {validateTienThuThucTe && <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>  T???ng s??? ti???n thu th???c t??? ph???i l???n h??n 0 </p>}
                            {validateTienThuThucTeLength && <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>  T???ng s??? ti???n thu th???c t??? ch??? ???????c nh???p 20 k?? t???</p>}
                            {validateTienThuThucTeNhapSo && <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>  T???ng s??? ti???n ph???i l?? s???</p>}
                            <Form.Item
                                name="soTienThuThucTebangChu"
                                label="S??? ti???n b???ng ch???"
                                className={styles.formItem}
                                placeholder='0'
                            >
                                <Input disabled className={styles.formItemInput} style={{ color: '#000' }} />
                            </Form.Item>
                            <Form.Item name="ngayThu" label="Ng??y thu" className={styles.formItem}
                            >
                                <DatePicker
                                    allowClear={false}
                                    suffix={<CalendarOutlined />}
                                    format={formatDate}
                                    className={styles.formItemDatePicker}
                                />
                            </Form.Item>
                        </div>

                        <div style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                            <Form.Item
                                name="khongThuDuoc"
                                className={styles.formItem}
                                style={{ border: 'none', marginBottom: 0 }}
                                valuePropName="checked"
                            >
                                <Checkbox onChange={onCheckBoxkhongThuDuocChange} disabled={khongThuDuoc}>Kh??ng thu ???????c ti???n</Checkbox>
                            </Form.Item>
                            <Form.Item
                                name="daThu"
                                className={styles.formItem}
                                style={{ border: 'none', marginBottom: 8 }}
                                valuePropName="checked"
                            >
                                <Checkbox onChange={onCheckBoxDaThuChange} disabled={daThuTien}>???? thu h???t ti???n</Checkbox>
                            </Form.Item>
                        </div>

                        <div className={styles.formItemWrapper} style={{ position: 'relative' }}>
                            <Form.Item
                                name="chungTu"
                                label="Ch???ng t??? k??m theo"
                                className={styles.formItem}
                            >
                                <Input
                                    style={{ width: '100%', paddingBottom: 4 }}
                                    maxLength={2}
                                    onChange={e => handleChangeChungTu(e)}
                                    className={styles.formItemInput}
                                />
                            </Form.Item>
                            {validateChungTu &&
                                <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>Ch???ng t??? ph???i l?? s??? l???n h??n 0</p>
                            }
                            {validateChungThuLength &&
                                <p style={{ color: 'red', position: 'absolute', left: 0, top: '75%' }}>Ch???ng t??? ch??? ???????c nh???p 2 k?? t???</p>
                            }
                            <Form.Item
                                name="isXuatHoaDon"
                                className={styles.formItem}
                                label="Xu???t h??a ????n"
                                rules={[
                                    {
                                        required: true,
                                        message: 'B???t bu???c ch???n',
                                    }
                                ]}
                            >
                                <Select
                                    bordered={false}
                                    style={{ paddingBottom: -20 }}
                                    className={styles.formItemSelect}
                                >
                                    <Option value={true}>C??</Option>
                                    <Option value={false}>Kh??ng</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="hinhThucThanhToanId"
                                label="H??nh th???c thanh to??n"
                                className={styles.formItem}
                            >
                                <Select
                                    bordered={false}
                                    onChange={handleChange}
                                    className={styles.formItemSelect}
                                >
                                    {hinhThucThanhToan?.map(item =>
                                        <Option key={item.value} value={item.value}>{item.description}</Option>
                                    )}
                                </Select>
                            </Form.Item>
                        </div>

                        {isVisible
                            &&
                            <div className={styles.formItemWrapper}>
                                <Form.Item name='soTaiKhoan' label='S??? t??i kho???n' className={styles.formItem}>
                                    <Input
                                        maxLength={12}
                                        className={styles.formItemInput}
                                        onChange={e => form.setFieldsValue({ soTaiKhoan: e.target.value.replace(/[^0-9\,\.]/g, '').replace('-', '').replace('.', '').replace(',', '') })}
                                    />
                                </Form.Item>
                                <Form.Item name='nganHang' label='Ng??n h??ng' className={styles.formItem}>
                                    <Select
                                        bordered={false}
                                        className={styles.formItemInput}
                                    >
                                        {
                                            banks?.map(item =>
                                                <Option value={item.id}>{item.ma}-{item.ten}</Option>
                                                )
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item name='chiNhanh' label='Chi nh??nh' className={styles.formItem}>
                                    <Input
                                        maxLength={100}
                                        className={styles.formItemInput}
                                    />
                                </Form.Item>
                            </div>
                        }

                        <div className={styles.formButtonGroup}>
                            <Button
                                icon={<SaveFilled />}
                                htmlType="submit"
                                disabled={disableButtonSubmit}
                            >
                                L??u
                            </Button>
                            <Button icon={<PrinterOutlined />}>
                                In
                            </Button>
                            <Button
                                type="danger"
                                onClick={handleResetField}
                            >
                                <Link href='/'>
                                    <a>
                                        ????ng
                                    </a>
                                </Link>
                            </Button>

                        </div>
                    </Form>
                </div>
            </Content >
        </div >
    );
}

PhieuThu.Layout = AdminLayout; ///
export default PhieuThu;
