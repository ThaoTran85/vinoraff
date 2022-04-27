import {
    CloseOutlined,
    DeleteOutlined,
    LockOutlined,
    PlusOutlined,
    PrinterOutlined,
    SaveOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import {
    Affix,
    Alert,
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Layout,
    message,
    Modal,
    notification,
    Row,
    Select,
    Table,
    Upload,
} from 'antd';
import 'antd/dist/antd.css';
import { phieuYeuCauApi, danhMucApi, donViYeuCauApi, upLoadApi} from 'api-client';
import AdminLayout from 'components/layout/admin';
import React, { useState, useEffect  } from 'react';
import styles from './phieuyeucau.module.css';
import moment from 'moment';
import { formatPrice } from '../../util/index';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { render } from 'react-dom';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const validateMessages = {
    required: 'Vui lòng nhập đầy đủ thông tin',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} phải lớn hơn ${min} và nhỏ hơn ${max}',
    },
};

export const formatterNumber = (val) => {
    if (!val) return 0;
    return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/\.(?=\d{0,2}$)/g, ",");
  }

export const formatterNumberNegative = (val) => {
    if (!val) return 0;
    return `${val}`.replace(/\$\s?|(\.*)/g, "");
  }
  
export const parserNumber = (val) => {
    if (!val) return 0;
    return Number.parseFloat(val.replace(/\$\s?|(\.*)/g, "").replace(/(\,{1})/g, ".")).toFixed(2)
  }

const TaoPhieuYeuCau1 = (Props) => {
    const router = useRouter()
    const [actionForm] = Form.useForm();
    const [FormTS] = Form.useForm();
    const [isDoanhNghiep, setIsDoanhNghiep] = useState(false);
    const [loaiTS, setLoaiTS] = useState(false);
    const [textLoaiTaiSan, setTextLoaiTaiSan] = useState('');
    const [isXuatHoaDon, setIsXuatHoaDon] = useState(false);
    const [dataListTS, setDataListTS] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [disableCreatePYC, setDisableCreatePYC] = useState(false);
    const [isShowTamUng, setShowTamUng] = useState('');
    const [isShowTongPhi, setShowTongPhi] = useState(false);
    const [isShowValidatorDateKS, setShowValidatorDateKS] = useState('');
    const dateFormat = 'DD/MM/YYYY';
    const getDate = new Date();
    const currentTime = moment(getDate.getTime());
    const [danhMucTS, setDanhMucTS] = useState([]);
    const [listNguonDonViYeuCau, setListNguonDonViYeuCau] = useState([]);
    const [ListChiNhanhDonViYeuCau ,setListChiNhanhDonViYeuCau] = useState([]);
    const [danhMucLoaiKhachHang, setLoaiKhachHang] = useState([]);
    const [danhMucHinhThuThanhToan, setHinhThuThanhToan] = useState([]);
    const [imgLink, setImgTS] = useState('');
    const [IDPYC, setIDPYC] = useState()
    const [isDisable, setIsdisable] = useState(false);
    const [eventClickTS, setventClickTS] = useState('')

    const [hiddenBtnSave,setHiddenBtnSave] = useState(true);
    const [hiddenQuickEdit,setHiddenQuickEdit] = useState(false);

    const [tongPhi_state, setTongPhi] = useState();
    const [giaSoBo_state, setGiaSoBo] = useState();
    const [tamUng_state, setTamUng] = useState();

    const onFinish = (values) => {
        let params = actionForm.getFieldValue();
        params.taiSans = dataListTS,
        params.trangThai = 1,
        params.tamUng =  typeof params.tamUng === 'string' ? Number(values.tamUng.replace(/,/g, "")) : params.tamUng
        params.tongPhi = typeof params.tongPhi === 'string' ?  Number(values.tongPhi.replace(/,/g, "")) : params.tongPhi
        params.giaSoBo = typeof params.giaSoBo === 'string' ? Number(values.giaSoBo.replace(/,/g, "")) : params.giaSoBo
        params.tyLeChiHoaHong = values.tyLeChiHoaHong &&  typeof params.tyLeChiHoaHong === 'string' ? Number(values.tyLeChiHoaHong) : 0
        params.soLuongChungThu = typeof params.soLuongChungThu === 'string' ? Number(params.soLuongChungThu) : params.soLuongChungThu
        if(params.tamUng <= 0){
            message.error('Số tiền tạm ứng phải lớn hơn 0');
            setShowTamUng('Số tiền tạm ứng phải lớn hơn 0');
            return
        }
        if(params.tamUng > params.tongPhi){
            message.error('Số tiền tạm ứng phải nhỏ hơn tổng phí');
            return
        }
        if(!IDPYC){
            phieuYeuCauApi.createPYC(params).then((res) => {
                if (res.succeeded && res.data) {
                    // success
                    setIsdisable(true)
                    setIDPYC(res.data)
                    setHiddenBtnSave(false)
                    message.success('Tạo phiếu yêu cầu thành công!');
                } else {
                    {
                        notification.info({
                            message: 'Tính năng đang phát triển',
                        });
                    }
                }
            });
        }
        else{
            saveQuickEditPYC()
        }
    };
    const quickEditPYC = () => {
        setIsdisable(false)
        setHiddenQuickEdit(true)
        
        setDataListTS(actionForm.getFieldValue('taiSans').map((item, index) => { return { ...item, key: index}}));
    }
    let printDocument = (id) => {
        try {
            phieuYeuCauApi.printPYC(id).then((res) => {
                const link = document.createElement("a");
                link.href = 'data:application/pdf;base64,' + res.fileContents;
                link.download = res.fileDownloadName;
                link.click();
                message.success('Bạn đã in thành công Phiếu yêu cầu: ');
            });
        } catch (error) {
            console.log(error)
        }
      };
    const saveQuickEditPYC = () => {
        let params = actionForm.getFieldValue();
        params.tyLeChiHoaHong = params.tyLeChiHoaHong &&  typeof params.tyLeChiHoaHong === 'string' ? Number(params.tyLeChiHoaHong) : 0
        params.soLuongChungThu = typeof params.soLuongChungThu === 'string' ? Number(params.soLuongChungThu) : params.soLuongChungThu
        params.tamUng =  typeof params.tamUng === 'string' ? Number(params.tamUng.replace(/,/g, "")) : params.tamUng
        params.tongPhi = typeof params.tongPhi === 'string' ?  Number(params.tongPhi.replace(/,/g, "")) : params.tongPhi
        params.giaSoBo = typeof params.giaSoBo === 'string' ? Number(params.giaSoBo.replace(/,/g, "")) : params.giaSoBo
        params.id = IDPYC
        params.taiSans = dataListTS
        if(params.tamUng > params.tongPhi){
            message.error('Số tiền tạm ứng phải nhỏ hơn tổng phí');
            return
        }
        phieuYeuCauApi.updatePYC(params).then((res) => {
            if (res.succeeded && res.data) {
                setTimeout(() => {
                    actionForm.resetFields();
                    router.push('/ds-phieu-yeu-cau')
                }, 1000)
                message.success('Lưu thông tin phiếu yêu cầu thành công!');
            } 
        });
    }

    const onFinishFailed = (value) => {
        notification.info({
            message: 'Tạo phiếu yêu cầu thất bại!',
        });
    };

    const onChangeChiNhanh = (event,value) => {
        actionForm.setFieldsValue({ chiNhanhDonViYeuCau:  value.children})
    }
    const getDanhMucsTS = async () => {
        try {
            const res = await danhMucApi.getDanhMucs('loai-tai-san');
            if (res.succeeded && res.data) {
                setDanhMucTS(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const getChiNhanh = async (event,value) => {
        actionForm.setFieldsValue({ nguonDonViYeuCau: value.children })

        try {
            const res = await donViYeuCauApi.getChiNhanhDonViYeuCau(value.value);
            if (res.succeeded && res.data) {  
                setListChiNhanhDonViYeuCau(res.data)
                console.log('ress:', res.data)
            
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getNguonDonViYeuCau = async () => {
        try {
            const res = await donViYeuCauApi.getDonViYeuCau();
            if (res.succeeded && res.data) {  
                setListNguonDonViYeuCau(res.data)
                console.log('ress:', listNguonDonViYeuCau)
            
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getTrangThaiPYC = async () => {
        try {
            const res = await danhMucApi.getDanhMucs('trang-thai-phieu-yeu-cau');
            if (res.succeeded && res.data) {
                console.log('trạng thái PYC:?', res.data)
                
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getLoaiKhachHang = async () => {
        try {
            const res = await danhMucApi.getDanhMucs('loai-khach-hang');
            if (res.succeeded && res.data) {
                setLoaiKhachHang(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getHinhThucThanhToan = async () => {
        try {
            const res = await danhMucApi.getDanhMucs('hinh-thuc-thanh-toan');
            if (res.succeeded && res.data) {
                setHinhThuThanhToan(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDanhMucsTS();
        getHinhThucThanhToan();
        getLoaiKhachHang();
        getTrangThaiPYC();
        getNguonDonViYeuCau();
    }, []);



    const onFinishTS = (values) => {
        setDisableCreatePYC(true);
        let data = FormTS.getFieldValue();
        if(eventClickTS == 'UPDATE'){
            let temp =  dataListTS.map((item , index) => index == data.key  ? { ...data } : item)
            setDataListTS(temp);
            FormTS.resetFields();
            FormTS.setFieldsValue({ isLienKe: false })
            setIsModalVisible(false);
        }
        else{
            FormTS.setFieldsValue({ key:  dataListTS.length });
            var newData = [...dataListTS, FormTS.getFieldValue()];
            setDataListTS(newData);
            FormTS.resetFields();
        }
    };

    const onCheckLK = (e) => {
        FormTS.setFieldsValue({
            isLienKe: e.target.checked,
            lienKeText: 'Có',
        });
    };

    const onSelectType = (value, e, key) => {
        if (key === 'LoaiKH') {
            value == 1 ? setIsDoanhNghiep(false) : setIsDoanhNghiep(true);
        }
        if (key === 'loaiTS') {
            setTextLoaiTaiSan(e.children);
            FormTS.setFieldsValue({
                loaiTaiSanText: e.children,
                // key: dataListTS.length,
            });
            value == 1 ? setLoaiTS(true) : setLoaiTS(false);
        }
        if (key === 'xuatHoaDon') {
            value == true ? setIsXuatHoaDon(true) : setIsXuatHoaDon(false);
        }
    };

    const addNewTypeTS = (key) => {
        setventClickTS(key)
        if(key == 'ADD_NEW'){
            FormTS.resetFields();
        }
        showModal();
    };

    const handleEditRow = (_,record,index) => {
        FormTS.setFieldsValue(record)
        addNewTypeTS('UPDATE')
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const changeDateNKSDK = (date, dateString) => {
        let dateNow = moment().format('DD/MM/YYYY');
        if (dateNow > dateString) {
            setShowValidatorDateKS('Ngày khảo sát dự kiến nhỏ hơn ngày hiện tại. Bạn cần cập nhật lại');
        } else {
            setShowValidatorDateKS('');
        }
    };
   
    const phoneLienHeKhaoSat = (event) => {
        const val = event.target.value
        if (val == '') {
            actionForm.setFieldsValue({ soDienThoaiNguoiLienHeDiKhaoSat: 0 });
            return
        }
        if (val.charAt(1) == 0) {
            actionForm.setFieldsValue({ soDienThoaiNguoiLienHeDiKhaoSat: 0 });
            return
        }
        actionForm.setFieldsValue({ soDienThoaiNguoiLienHeDiKhaoSat: val.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "")});
    }
    const phoneDvYeuCau = (event) => {
        const val = event.target.value
        if (val == '') {
            actionForm.setFieldsValue({ soDienThoaiDvYeuCau: 0 });
            return
        }
        if (val.charAt(1) == 0) {
            actionForm.setFieldsValue({ soDienThoaiDvYeuCau: 0 });
            return
        }
        actionForm.setFieldsValue({ soDienThoaiDvYeuCau: val.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "")});
    }

    const handleTamUng = (e) => {
        const val = e.target.value
        let tong_phi = tongPhi_state;
        let tamUnga = Number(e.target.value.replace(/,/g, ""));
        setTamUng(tamUnga)
        if (tamUnga <= 0) {
            setShowTamUng('Số tiền tạm ứng phải lớn hơn 0');
            actionForm.setFieldsValue({ tamUng: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
            return
        }
        else if (tamUnga > tong_phi) {
            // setShowTamUng('Số tiền tạm ứng phải nhỏ hơn tổng phí');
            actionForm.setFieldsValue({ tamUng: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
            return
        }

        else if (val == '') {
            actionForm.setFieldsValue({ tamUng: 0 });
            return
        }

        else if (val.charAt(0) == 0) {
            actionForm.setFieldsValue({ tamUng: val.slice(1) });
            return
        }
            setShowTamUng('');
            actionForm.setFieldsValue({ tamUng: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
    }

    const handleTongPhi = (e) => {
        const val = e.target.value
        let tong_phi = Number(e.target.value.replace(/,/g, ""));
        setTongPhi(tong_phi)
        if (tong_phi <= 0 ) {
            setShowTongPhi(true);
            actionForm.setFieldsValue({ tongPhi: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
            return
        }
        else if (val == '') {
            actionForm.setFieldsValue({ tongPhi: 0 });
            return
        }

        else if (val.charAt(0) == 0) {
            actionForm.setFieldsValue({ tongPhi: val.slice(1) });
            return
        }
            setShowTongPhi(false);
            actionForm.setFieldsValue({ tongPhi: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
    }

    const handleGiaSoBo = (e) => {
        const val = e.target.value
        let gia_so_bo = Number(e.target.value.replace(/,/g, ""));
        setGiaSoBo(gia_so_bo)
        if(gia_so_bo <= 0) {
            actionForm.setFieldsValue({ giaSoBo: val.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
            return
        }
        if (val == '') {
            actionForm.setFieldsValue({ giaSoBo: 0 });
            return
        }
        if (val.charAt(0) == 0) {
            actionForm.setFieldsValue({ giaSoBo: val.slice(1) });
            return
        }
            actionForm.setFieldsValue({ giaSoBo: val.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
    }

    const uploadImage = async (options) => {
        const { onSuccess, file } = options;
        onSuccess('Ok');
        const formdata = new FormData();
        formdata.append('formFile', file); //add field File
        upLoadApi.uploadImage(formdata).then((res) => {
            console.log('res.data.data', res.data.data);
            actionForm.setFieldsValue({ taiLieuDinhKem: res.data.data})
            let linkImg = 'http://45.119.215.79/thamdinhgia' + res.data.data
            setImgTS(linkImg)
        });
    };

    const columns = [
        {
            title: 'Loại tài sản',
            dataIndex: 'loaiTaiSanText',
            key: 'loaiTaiSanText',
            // render: (_,record,index) => <p> { record.loaiTaiSanText ? record.loaiTaiSanText : record.ten }</p>
        },
        {
            title: 'Tên TSTĐ',
            dataIndex: 'ten',
            key: 'ten',
        },
        {
            title: 'Thông tin TSTĐ',
            key: 'thongTin',
            dataIndex: 'thongTin',
        },
        {
            title: 'Liền kề',
            key: 'lienKeText',
            dataIndex: 'lienKeText',
        },
        {
            title: 'Pháp lý tài sản',
            key: 'phapLy',
            dataIndex: 'phapLy',
        },
        {
            title: 'Tài liệu đi kèm',
            key: 'taiLieuDinhKem',
            dataIndex: 'taiLieuDinhKem',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (_,record,index) => <a onClick={() => handleEditRow(_,record,index)}> Cập nhật</a>,
          },
    ];

    return (
        <Content className={styles.tp__8}>
            <Form
                className={styles.form_PYC}
                name="nest-messages"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                validateMessages={validateMessages}
                form={actionForm}
                initialValues={{
                    ngayKiHopDong: moment(currentTime),
                    ngayTao: moment(currentTime),
                    soPhieuYeuCau: ''
                }}
            >
                <Row>
                    <Col span={4} />
                    <Col span={16} className={styles.tp__23}>
                        <div className={styles.tp__9}>
                            <div className={styles.tp__2}>
                                <h1 className={styles.f_s_w_18_700}>
                                    CHI NHÁNH CÔNG TY CP THẨM ĐỊNH GIÁ VÀ ĐẦU TƯ TÀI CHÍNH BƯU ĐIỆN
                                </h1>
                                <h4 className={styles.tp__11}>PHÒNG KINH DOANH</h4>
                                <h4 className={styles.tp__11}>THÔNG TIN HỒ SƠ</h4>
                            </div>
                            <div>
                                <Row>
                                    <Col span={4}>
                                        <p className={styles.formItemTitle}>
                                            Trạng thái phiếu yêu cầu:
                                        </p>
                                    </Col>
                                    <Col span={5} style={{ bottom: '8px' }}>
                                        <Alert
                                            message="Trạng thái khởi tạo"
                                            type="success"
                                            showIcon
                                        />
                                    </Col>
                                </Row>

                                <Row className={styles.tp__12}>
                                    <Col span={11}>
                                        <p className={styles.formItemTitle}>Số PYC</p>
                                        <Form.Item
                                            name="soPhieuYeuCau"
                                            // rules={[
                                            //     {
                                            //         required: true,
                                            //         message: 'Bạn chưa nhập thông tin từ ngày',
                                            //     },
                                            //     {
                                            //         max: 100,
                                            //         message: 'Tối đa 100 ký tự!',
                                            //     },
                                            // ]}
                                        >
                                            <Input
                                                disabled={true}
                                                className={styles.formItemInput}
                                                name="soPhieuYeuCau"
                                                placeholder="AA:STT:MM:YY:DVYC"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1} />
                                    <Col span={12} className={styles.formItem}>
                                        <p>Ngày</p>
                                        <Form.Item name='ngayTao'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Bạn chưa nhập thông tin ngày tạo',
                                                },
                                            ]}
                                        >
                                                    <DatePicker
                                                        allowClear={false}
                                                        placeholder="Chọn ngày tạo"
                                                        className={styles.formItemDatePicker}
                                                        size="large"
                                                        format={dateFormat}
                                                        disabled={isDisable}
                                                    />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>1. Loại Khách Hàng </h3>
                                <Row>
                                    <Col span={11} className={styles.formItem}>
                                        <p className={styles.formItemTitle}>Loại khách hàng</p>
                                        <Form.Item
                                            name="loaiKhachHangId"
                                            className={styles.formItem}
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Select
                                                disabled={!IDPYC ? false : true}
                                                showSearch
                                                placeholder="Loại khách hàng"
                                                optionFilterProp="children"
                                                size="large"
                                                bordered={false}
                                                style={{ paddingLeft: -20 }}
                                                className={styles.formItemSelect}
                                                onChange={(value, event) =>
                                                    onSelectType(value, event, 'LoaiKH')
                                                }
                                                filterOption={(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {danhMucLoaiKhachHang.map((option, index) => (
                                                    <Option key={index} value={option.value}>
                                                        {option.description}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={1} />
                                    <Col span={12} className={styles.formItem}>
                                        <p className={styles.formItemTitle}>Chứng thư</p>
                                        <Form.Item
                                            name="soLuongChungThu">
                                            <Input
                                                disabled={isDisable}
                                                maxLength={4}
                                                onChange={(event) => actionForm.setFieldsValue({ soLuongChungThu: event.target.value.replace(/[^0-9\,\.]/g, "").replace('.', '')})}
                                                style={{ width: '100%' }}
                                                controls={false}
                                                className={styles.formItemInput}
                                                name="soLuongChungThu"
                                                placeholder="Số chứng thư"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>2. Khách Hàng</h3>
                                <Row>
                                    <Col span={11}>
                                        <p className={styles.formItemTitle}>
                                            Tên khách hàng yêu cầu
                                        </p>
                                        <Form.Item
                                            name="tenKhachHang"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Điền đầy đủ thông tin',
                                                },
                                                {
                                                    max: 1000,
                                                    message: 'Tối đa 1000 ký tự!',
                                                },
                                            ]}
                                        >
                                            <Input
                                                disabled={isDisable}
                                                className={styles.formItemInput}
                                                size="large"
                                                placeholder="Tên khách hàng yêu cầu"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1} />
                                    <Col span={12}>
                                        {isDoanhNghiep ? (
                                            <div className={styles.formItem}>
                                                <p className={styles.formItemTitle}>Mã số thuế</p>
                                                <Form.Item
                                                    name="maSoThue"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Điền đầy đủ thông tin',
                                                        },
                                                        {
                                                            max: 14,
                                                            message: 'Tối đa 15 ký tự!',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        disabled={isDisable}
                                                        maxLength={15}
                                                        onChange={(event) =>
                                                            event.target.value > 0
                                                                ? event.target.value
                                                                : actionForm.setFieldsValue({
                                                                      maSoThue: event.target.value
                                                                          .replace(
                                                                              /[^0-9]/g,
                                                                              ''
                                                                          )
                                                                          .replace('--', ''),
                                                                  })
                                                        }
                                                        className={styles.formItemInput}
                                                        size="large"
                                                        placeholder="Mã số thuế"
                                                    />
                                                </Form.Item>
                                            </div>
                                        ) : (
                                            <div className={styles.formItem}>
                                                <p className={styles.formItemTitle}>Số CMT/ Số hộ chiếu</p>
                                                <Form.Item
                                                    name="soCMND"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Điền đầy đủ thông tin',
                                                        },
                                                        {
                                                            max: 50,
                                                            message: 'Tối đa 50 ký tự!',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        disabled={isDisable}
                                                        onChange={(event) => actionForm.setFieldsValue({
                                                                      soCMND: event.target.value.replace(/[^0-9]/g,'' ).replace('--', ''),
                                                                  })
                                                        }
                                                        className={styles.formItemInput}
                                                        size="large"
                                                        placeholder="Số CMT/ Số hộ chiếu"
                                                    />
                                                </Form.Item>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                            <div className={styles.formItem}>
                                <p className={styles.formItemTitle}>Địa chỉ</p>
                                <Form.Item
                                    name="diaChi"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Điền đầy đủ thông tin',
                                        },
                                        {
                                            max: 4000,
                                            message: 'Tối đa 4000 ký tự!',
                                        },
                                    ]}
                                >
                                    <Input
                                        disabled={isDisable}
                                        maxLength={4000}
                                        className={styles.formItemInput}
                                        size="large"
                                        placeholder="Địa chỉ"
                                    />
                                </Form.Item>
                            </div>

                            {isDoanhNghiep ? (
                                <div className={styles.tp__15}>
                                    <Row>
                                        <Col span={11} className={styles.formItem}>
                                            <p className={styles.formItemTitle}>Người đại diện</p>
                                            <Form.Item
                                                name="nguoiDaiDien"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Điền đầy đủ thông tin',
                                                    },
                                                    {
                                                        max: 100,
                                                        message: 'Tối đa 100 ký tự!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    disabled={isDisable}
                                                    className={styles.formItemInput}
                                                    size="large"
                                                    placeholder="Người đại diện"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={1} />
                                        <Col span={12} className={styles.formItem}>
                                            <p className={styles.formItemTitle}>Chức danh</p>
                                            <Form.Item
                                                name="chucVu"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Điền đầy đủ thông tin',
                                                    },
                                                    {
                                                        max: 100,
                                                        message: 'Tối đa 100 ký tự!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    disabled={isDisable}
                                                    className={styles.formItemInput}
                                                    size="large"
                                                    placeholder="Chức danh"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            ) : (
                                ''
                            )}

                            <div className={styles.tp__15}>
                                <Row>
                                    <Col span={4}>
                                        <h3 className={styles.tp__11}>3. Tài sản thẩm định</h3>
                                    </Col>
                                    <Col span={20}>
                                        <Button
                                            disabled={isDisable}
                                            onClick={() => addNewTypeTS('ADD_NEW')}
                                            style={{ color: '#2196F3', bottom: '6px' }}
                                        >
                                            {' '}
                                            <PlusOutlined /> Thêm mới{' '}
                                        </Button>
                                    </Col>
                                </Row>
                                <Table columns={columns} dataSource={dataListTS} />

                                <Modal
                                    maskClosable={false}
                                    visible={isModalVisible}
                                    onCancel={handleCancel}
                                    footer={false}
                                    title="Tài sản thẩm định"
                                    centered
                                >
                                    <Form
                                        name="basic"
                                        autoComplete="off"
                                        onFinish={onFinishTS}
                                        form={FormTS}
                                    >
                                        <div className={styles.db__15}>
                                            <div className={styles.formItem}>
                                                <p className={styles.formItemTitle}>Loại tài sản</p>
                                                <Form.Item
                                                    name="loaiTaiSanId"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Chọn loại tài sản!',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        showSearch
                                                        placeholder="Loại tài sản"
                                                        optionFilterProp="children"
                                                        size="large"
                                                        bordered={false}
                                                        style={{ paddingLeft: -20 }}
                                                        className={styles.formItemSelect}
                                                        onChange={(value, event) =>
                                                            onSelectType(value, event, 'loaiTS')
                                                        }
                                                        filterOption={(input, option) =>
                                                            option.children
                                                                .toLowerCase()
                                                                .indexOf(input.toLowerCase()) >= 0
                                                        }
                                                    >
                                                        {danhMucTS.map((option, index) => (
                                                            <Option
                                                                key={index}
                                                                value={option.value}
                                                            >
                                                                {option.description}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>

                                            <div className={styles.formItem}>
                                                <p className={styles.formItemTitle}>
                                                    Tên tài sản thẩm định
                                                </p>
                                                <Form.Item
                                                    name="ten"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Điền đầy đủ thông tin',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        className={styles.formItemInput}
                                                        size="large"
                                                        placeholder="Tên tài sản thẩm định"
                                                    />
                                                </Form.Item>
                                            </div>

                                            <div className={styles.formItem}>
                                                <p className={styles.formItemTitle}>
                                                    Thông tin tài sản thẩm định
                                                </p>
                                                <Form.Item
                                                    name="thongTin"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Địa chỉ BĐS thẩm định/ Biển số xe thẩm định chưa có thông tin',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        className={styles.formItemInput}
                                                        size="large"
                                                        placeholder="Thông tin tài sản thẩm định"
                                                    />
                                                </Form.Item>
                                            </div>

                                            {loaiTS ? (
                                                <Form.Item name="isLienKe">
                                                    <Checkbox
                                                        className={styles.db__16}
                                                        onChange={onCheckLK}
                                                    >
                                                        Liền kề
                                                    </Checkbox>
                                                </Form.Item>
                                            ) : (
                                                ''
                                            )}
                                            <div className={styles.formItem}>
                                                <p className={styles.formItemTitle}>
                                                    Pháp lý tài sản
                                                </p>
                                                <Form.Item
                                                    name="phapLy"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Bạn chưa nhập thông tin pháp lý',
                                                        },
                                                        {
                                                            max: 100,
                                                            message: 'Tối đa 100 ký tự!',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        className={styles.formItemInput}
                                                        size="large"
                                                        name="phapLy"
                                                        placeholder="Pháp lý tài sản"
                                                    />
                                                </Form.Item>
                                            </div>

                                            <Form.Item name="taiLieuDinhKem">
                                                <Upload
                                                    accept="image/*"
                                                    customRequest={uploadImage}
                                                    fileList={fileList}
                                                >
                                                    <Button icon={<UploadOutlined />}>
                                                        Tài liệu đính kèm
                                                    </Button>
                                                </Upload>
                                                <img style={{ width: '100%' }} src={imgLink} alt={imgLink} />
                                            </Form.Item>
                                        </div>
                                        <Affix offsetBottom={0}>
                                            <div className={styles.affixConfig_modal}>
                                                <Row className={styles.db__1}>
                                                    <Col span={11}>
                                                        <Button
                                                            type="primary"
                                                            className={styles.db__18}
                                                            htmlType="submit"
                                                            style={{
                                                                backgroundColor: '#4CAF50',
                                                                color: '#fff',
                                                                border: 'none',
                                                            }}
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
                                        </Affix>
                                    </Form>
                                </Modal>
                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>4. Mục đích thẩm định</h3>
                                <Form.Item
                                    name="mucDichThamDinh"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Bạn chưa nhập mục đích thẩm định',
                                        },
                                    ]}
                                >
                                    <Input
                                        disabled={isDisable}
                                        className={styles.formItemInput}
                                        size="large"
                                        name="mucDichThamDinh"
                                        placeholder="Mục đích thẩm định"
                                    />
                                </Form.Item>
                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>5. Thời điểm thẩm định</h3>
                                <Form.Item name='thoiDiemThamDinh'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Bạn chưa nhập thời điểm thẩm định',
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        disabled={isDisable}
                                        size="large"
                                        allowClear={false}
                                        placeholder="Chọn Thời điểm thẩm định"
                                        className={styles.formItemDatePicker}
                                        format={dateFormat}
                                    />
                                </Form.Item>
                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>6. Phí thẩm định</h3>
                                <div className={styles.formItem}>
                                    <p className={styles.formItemTitle}>
                                        Tổng phí (Đã bao gồm VAT) 
                                    </p>
                                    <Form.Item>
                                        <Form.Item name="tongPhi"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Bạn chưa nhập tổng phí',
                                                },
                                            ]}>

                                            <Input placeholder='Tổng phí( Đã bao gồm VAT)'
                                                    maxLength={26}
                                                    disabled={isDisable}
                                                    onChange={handleTongPhi}
                                                    className={styles.formItemInput} style={{ width: '100%' }} />
                                        </Form.Item>
                                        {isShowTongPhi ? (
                                            <p style={{ color: 'red' }}>Tổng phí phải lớn hơn 0</p>
                                        ) : (
                                            ''
                                        )}
                                    </Form.Item>
                                </div>
                                <Row>
                                    <Col span={11}>
                                        <Form.Item>
                                            <p className={styles.formItemTitle}>Tạm ứng</p>
                                            <Form.Item name="tamUng"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Bạn chưa nhập tạm ứng',
                                                    },
                                                ]}>
                                               <Input placeholder='Tạm ứng'
                                                    maxLength={26}
                                                    disabled={isDisable}
                                                    onChange={handleTamUng}
                                                    className={styles.formItemInput} style={{ width: '100%' }} />
                                            </Form.Item>
                                            <p className="ant-form-item-explain-error">
                                                {/* {tongPhi_state <= tamUng_state ? isShowTamUng : ""} */}
                                                {isShowTamUng}
                                                {tongPhi_state < tamUng_state ? 'Số tiền tạm ứng phải nhỏ hơn tổng phí' : ""}
                                            </p>
                                        </Form.Item>
                                    </Col>
                                    <Col span={1} />
                                    <Col span={12} className={styles.formItem}>
                                        <p className={styles.formItemTitle}>Hình thức thanh toán</p>
                                        <Form.Item
                                            name="hinhThucThanhToanId"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Bạn chưa chọn Hình thức thanh toán',
                                                },
                                            ]}
                                        >
                                            <Select
                                                disabled={isDisable}
                                                placeholder="Hình thức thanh toán"
                                                optionFilterProp="children"
                                                size="large"
                                                bordered={false}
                                                style={{ paddingLeft: -20 }}
                                                className={styles.formItemSelect}
                                                filterOption={(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {danhMucHinhThuThanhToan.map((option, index) => (
                                                    <Option key={index} value={option.value}>
                                                        {option.description}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div className={styles.formItem}>
                                    <p className={styles.formItemTitle}>Xuất hóa đơn</p>
                                    <Form.Item
                                        name="isXuatHoaDon"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Bạn chưa chọn xuất hoá đơn',
                                            },
                                        ]}
                                    >
                                        <Select
                                            disabled={isDisable}
                                            placeholder="Xuất hóa đơn"
                                            optionFilterProp="children"
                                            size="large"
                                            bordered={false}
                                            style={{ paddingLeft: -20 }}
                                            className={styles.formItemSelect}
                                            onChange={(value, event) =>
                                                onSelectType(value, event, 'xuatHoaDon')
                                            }
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            <Option value={true}>Có</Option>
                                            <Option value={false}>Không</Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                {/* Có xuất hoá đơn */}
                                {isXuatHoaDon ? (
                                    <div className={styles.tp__15}>
                                        <Row>
                                            <Col span={11} className={styles.formItem}>
                                                <p className={styles.formItemTitle}>Số hợp đồng</p>
                                                <Form.Item
                                                    name="soHopDong"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Bạn chưa nhập Số hợp đồng',
                                                        },
                                                        {
                                                            max: 100,
                                                            message: 'Tối đa 100 ký tự!',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        disabled={isDisable}
                                                        size="large"
                                                        className={styles.formItemInput}
                                                        placeholder="Số hợp đồng"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={1} />
                                            <Col span={12} className={styles.formItem}>
                                                <p className={styles.formItemTitle}>
                                                    Ngày kí hợp đồng
                                                </p>
                                                <Form.Item name="ngayKiHopDong">
                                                        <DatePicker
                                                            allowClear={false}
                                                            disabled={isDisable}
                                                            placeholder="Chọn ngày kí hợp đồng"
                                                            size="large"
                                                            className={styles.formItemDatePicker}
                                                            format={dateFormat}
                                                        />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <div className={styles.formItem}>
                                            <p className={styles.formItemTitle}>
                                                Email nhận hóa đơn
                                            </p>
                                            <Form.Item
                                                name="emailNhanHoaDon"
                                                rules={[
                                                    {
                                                        required: true,
                                                        type: 'email',
                                                        message:
                                                            'Địa chỉ Email nhận hoá đơn không đúng định dạng. Bạn cần kiểm tra lại',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    disabled={isDisable}
                                                    size="large"
                                                    className={styles.formItemInput}
                                                    placeholder="Email nhận hóa đơn"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}

                                {/* Có xuất hoá đơn */}
                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>7. Đơn vị yêu cầu</h3>
                                <p className={styles.formItemTitle}>Nguồn</p>
                                <Form.Item
                                    name="nguonDonViYeuCauId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn đơn vị yêu cầu',
                                        },
                                    ]}
                                >
                                    <Select
                                        disabled={isDisable}
                                        placeholder="Nguồn"
                                        optionFilterProp="children"
                                        size="large"
                                        bordered={false}
                                        style={{ paddingLeft: -20 }}
                                        className={styles.formItemSelect}
                                        onChange={(value, event) => getChiNhanh(value, event) }
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {listNguonDonViYeuCau.map((option, index) => (
                                                            <Option
                                                                key={index}
                                                                value={option.id}
                                                            >
                                                                {option.ten}
                                                            </Option>
                                                        ))}
                                    </Select>
                                </Form.Item>

                                <div>
                                    <Row>
                                        <Col span={11} className={styles.formItem}>
                                            <p className={styles.formItemTitle}>Chi nhánh</p>
                                            <Form.Item
                                                name="chiNhanhDonViYeuCauId"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Bạn chưa chọn thông tin chi nhánh của đơn vị yêu cầu',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    disabled={isDisable}
                                                    placeholder="Chi nhánh"
                                                    optionFilterProp="children"
                                                    size="large"
                                                    bordered={false}
                                                    style={{ paddingLeft: -20 }}
                                                    className={styles.formItemSelect}
                                                    onChange={(value,event) => onChangeChiNhanh(value,event) }
                                                    filterOption={(input, option) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    
                                                    {ListChiNhanhDonViYeuCau.map((option, index) => (
                                                            <Option
                                                                key={index}
                                                                value={option.id}
                                                            >
                                                                {option.ten}
                                                            </Option>
                                                        ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={1} />
                                        <Col span={12}>
                                            <p className={styles.formItemTitle}>
                                                Người liên hệ/ Người giới thiệu/ Nhân viên tín dụng
                                            </p>
                                            <Form.Item
                                                name="nguoiLienHe"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Bạn chưa nhập thông tin “Người liên hệ/ Người giới thiệu/ Nhân viên tín dụng”',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    disabled={isDisable}
                                                    size="large"
                                                    placeholder="Người liên hệ/ Người giới thiệu/ Nhân viên tín dụng"
                                                    className={styles.formItemInput}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                <div className={styles.tp__15}>
                                    <Row>
                                        <Col span={11} className={styles.formItem}>
                                            <p className={styles.formItemTitle}>Email</p>
                                            <Form.Item
                                                name="emailDvYeuCau"
                                                rules={[
                                                    {
                                                        type: 'email',
                                                        message: 'Định dạng Email không đúng',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    disabled={isDisable}
                                                    className={styles.formItemInput}
                                                    size="large"
                                                    placeholder="Email"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={1} />
                                        <Col span={12} className={styles.formItem}>
                                            <p className={styles.formItemTitle}>
                                                {' '}
                                                Số điện thoại dịch vụ yêu cầu
                                            </p>
                                            <Form.Item
                                                name="soDienThoaiDvYeuCau"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Điền đầy đủ thông tin',
                                                    },
                                                    {
                                                        max: 12,
                                                        message: 'Tối đa 12 ký tự!',
                                                    },
                                                    {
                                                        min: 10,
                                                        message: 'Tối thiểu 10 ký tự!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    maxLength={12}
                                                    onChange={phoneDvYeuCau}
                                                    disabled={isDisable}
                                                    className={styles.formItemInput}
                                                    size="large"
                                                    placeholder="Số điện thoại"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                <div className={styles.tp__15}>
                                    <Row>
                                        <Col span={11} className={styles.formItem}>
                                            <p className={styles.formItemTitle}>
                                                {' '}
                                                Người liên hệ đi khảo sát
                                            </p>
                                            <Form.Item
                                                name="nguoiLienHeDiKhaoSat"
                                                rules={[
                                                    {
                                                        max: 1000,
                                                        message: 'Tối đa 1000 ký tự!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    disabled={isDisable}
                                                    size="large"
                                                    placeholder="Người liên hệ đi khảo sát"
                                                    className={styles.formItemInput}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={1} />
                                        <Col span={12} className={styles.formItem}>
                                            <p className={styles.formItemTitle}>
                                                Số điện thoại người liên hệ khảo sát
                                            </p>
                                            <Form.Item
                                                name="soDienThoaiNguoiLienHeDiKhaoSat"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Điền đầy đủ thông tin',
                                                    },
                                                    {
                                                        max: 12,
                                                        message: 'Tối đa 12 ký tự!',
                                                    },
                                                    {
                                                        min: 10,
                                                        message: 'Tối thiểu 10 ký tự!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    disabled={isDisable}
                                                    onChange={phoneLienHeKhaoSat}
                                                    size="large"
                                                    maxLength={12}
                                                    placeholder="Số điện thoại"
                                                    className={styles.formItemInput}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                <div className={styles.formItem}>
                                    <p className={styles.formItemTitle}>Ngày khảo sát dự kiến</p>
                                    <Form.Item name='ngayKhaoSatDuKien'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Điền đầy đủ thông tin',
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            disabled={isDisable}
                                            allowClear={false}
                                            placeholder="Chọn ngày khảo sát dự kiến"
                                            className={styles.formItemDatePicker}
                                            size="large"
                                            onChange={changeDateNKSDK}
                                            format={dateFormat}
                                        />
                                    </Form.Item>
                                            <p style={{ color: 'red' }}> { isShowValidatorDateKS }</p>
                                </div>
                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>8. Thông tin khác</h3>
                                <p className={styles.formItemTitle}>Giá sơ bộ đã báo</p>
                                <Form.Item name="giaSoBo"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Bạn chưa nhập giá sơ bộ',
                                        },
                                    ]}>
                                    <Input placeholder='Giá sơ bộ đã báo'
                                        disabled={isDisable}
                                        maxLength={13}
                                        onChange={handleGiaSoBo}
                                        className={styles.formItemInput} style={{ width: '100%' }} />           
                                </Form.Item>

                                <p className={styles.formItemTitle}>Ghi chú chung</p>
                                <Form.Item
                                    name="ghiChuChung"
                                    rules={[
                                        {
                                            max: 1000,
                                            message: 'Tối đa 1000 ký tự',
                                        },
                                    ]}
                                >
                                    <Input
                                        maxLength={1000}
                                        disabled={isDisable}
                                        size="large"
                                        className={styles.formItemInput}
                                        placeholder="Ghi chú chung"
                                    />
                                </Form.Item>

                                <p className={styles.formItemTitle}>Tỷ lệ chi hoa hồng</p>
                                <Form.Item name="tyLeChiHoaHong">
                                    <Input
                                        disabled={isDisable}
                                        onChange={(event) => actionForm.setFieldsValue({ tyLeChiHoaHong: event.target.value.replace(/[^0-9]/g,'' ).replace('.', '')})}
                                        className={styles.formItemInput}
                                        size="large"
                                        placeholder="Tỷ lệ chi hoa hồng"
                                    />
                                </Form.Item>

                                <p className={styles.formItemTitle}>Đơn vị chi hoa hồng</p>
                                <Form.Item name="donViChiHoaHong">
                                    <Input
                                        disabled={isDisable}
                                        size="large"
                                        className={styles.formItemInput}
                                        placeholder="Đơn vị chi hoa hồng"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Col>

                    <Col span={4} />
                </Row>

                <Affix offsetBottom={0}>
                    <div className={styles.affixConfig}>
                        <Link href="/ds-phieu-yeu-cau">
                            <Button
                                style={{
                                    backgroundColor: '#F44336',
                                    color: '#fff',
                                    border: 'none',
                                }}
                                icon={<CloseOutlined style={{ fontSize: '16px' }} color={'#fff'} />}
                            >
                                Đóng
                            </Button>
                        </Link>
                    { hiddenBtnSave ? 
                        <Button
                            style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none' }}
                            htmlType="submit"
                            icon={<SaveOutlined style={{ fontSize: '16px' }} color={'#fff'} />}
                        >
                            Lưu
                        </Button>
                    : '' }
                    
                   { hiddenQuickEdit ?
                        <Button
                            style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none' }}
                            // onClick={saveQuickEditPYC}
                            htmlType="submit"
                            icon={<SaveOutlined style={{ fontSize: '16px' }} color={'#fff'} />}
                        >
                            Lưu Chỉnh sửa
                        </Button>
                    : '' }

                        { IDPYC ? 
                        <>
                        <Button
                            className={styles.btnWhite}
                            onClick={quickEditPYC}
                            icon={<SaveOutlined style={{ fontSize: '16px' }} color={'#fff'} />}
                        >
                            Chỉnh sửa phiếu yêu cầu
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                            }}
                            icon={<PrinterOutlined />}
                            onClick={()=> printDocument(IDPYC) }
                        >
                            In dữ liệu
                        </Button>
                        </>
                         : '' }
                    </div>
                </Affix>
            </Form>
        </Content>
    );
};

TaoPhieuYeuCau1.Layout = AdminLayout; ///
export default TaoPhieuYeuCau1;
