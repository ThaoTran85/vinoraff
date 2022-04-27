import {
    KeyOutlined,
    PlusOutlined,
    SaveOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import {
    Affix,
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
import { phieuYeuCauApi,danhMucApi, donViYeuCauApi ,upLoadApi} from 'api-client';
import AdminLayout from 'components/layout/admin';
import React, { useState, useEffect } from 'react';
import styles from '../../pages/phieu-yeu-cau/phieuyeucau.module.css';
import moment from 'moment';

const { Content } = Layout;
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

const ModalUpdatePYC = (props) => {
    const [listNguonDonViYeuCau, setListNguonDonViYeuCau] = useState([]);
    const [actionForm] = Form.useForm();
    const [FormTS] = Form.useForm();
    const [isDoanhNghiep, setIsDoanhNghiep] = useState(true);
    const [loaiTS, setLoaiTS] = useState(false);
    const [textLoaiTaiSan, setTextLoaiTaiSan] = useState('');
    const [isXuatHoaDon, setIsXuatHoaDon] = useState(false);
    const [dataListTS, setDataListTS] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [ngaytao_state, setNgayTao] = useState('');
    const [ngayKhaoSatDuKien_state, setNgayKhaoSatDuKien] = useState('');
    const [thoiDiemThamDinh_state, setThoiDiemThamDinh] = useState('');
    const [ngayKiHopDong_state, setNgayKiHopDong] = useState('');
    const [disableCreatePYC, setDisableCreatePYC] = useState(false);
    const [isShowTamUng, setShowTamUng] = useState('');
    const [isShowTongPhi, setShowTongPhi] = useState(false);
    const [isShowValidatorDateKS, setShowValidatorDateKS] = useState(false);
    const dateFormat = 'DD/MM/YYYY';
    const [dataDetail, setDataDetail] = useState(props)
    const [eventClickTS, setventClickTS] = useState('')
    const [danhMucLoaiTaiSan, setLoaiTaiSan ] = useState([])
    const [danhMucLoaiKhachHang, setLoaiKhachHang] = useState([])
    const [danhMucHinhThuThanhToan, setHinhThuThanhToan] = useState([])
    const [ListChiNhanhDonViYeuCau ,setListChiNhanhDonViYeuCau] = useState([]);
    const [imgLink, setImgTS] = useState('');
    const [idNguon, setIDNguon]  = useState('');
    const [idchiNhanh, setIDChiNhanh]  = useState('');
    const getDate = new Date();
    const currentTime = moment(getDate.getTime());
    let initialValuesActionForm = {}


    const [tongPhi_state, setTongPhi] = useState();
    const [giaSoBo_state, setGiaSoBo] = useState();
    const [tamUng_state, setTamUng] = useState();

    const uploadImage = async (options) => {
        const { onSuccess, file } = options;
        onSuccess('Ok');
        const formdata = new FormData();
        formdata.append('formFile', file); //add field File
        upLoadApi.uploadImage(formdata).then((res) => {
            let linkImg = res.data.data
            setImgTS(linkImg)
        });
    };


    const pycID = async () => {
        try {
            const res = await phieuYeuCauApi.getPYCId(props.data.id)
            if (res.succeeded && res.data) {
                setDataDetail(res.data)
                initialValuesActionForm = res.data
                initialValuesActionForm.ngayTao = moment(res.data.ngayTao)
                initialValuesActionForm.ngayKiHopDong = moment(res.data.ngayKiHopDong)
                initialValuesActionForm.thoiDiemThamDinh = moment(res.data.thoiDiemThamDinh)
                initialValuesActionForm.ngayKhaoSatDuKien = moment(res.data.ngayKhaoSatDuKien)
                actionForm.setFieldsValue(initialValuesActionForm)
                setTamUng(initialValuesActionForm.tamUng)
                setTongPhi(initialValuesActionForm.tongPhi)
                setIDNguon(res.data.nguonDonViYeuCau)
                setIDChiNhanh(res.data.chiNhanhDonViYeuCau)
                getChiNhanh(res.data.nguonDonViYeuCauId,null)
                setDataListTS(res.data.taiSans.map((item, index) => { return { ...item, key: index}}));
                res.data.loaiKhachHangId === 1 ? setIsDoanhNghiep(false) : setIsDoanhNghiep(true);
                res.data.isXuatHoaDon == true ? setIsXuatHoaDon(true) : setIsXuatHoaDon(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const getChiNhanh = async (event,value) => {
        actionForm.setFieldsValue({ nguonDonViYeuCau: value ? value.children : '' })
        try {
            const res = await donViYeuCauApi.getChiNhanhDonViYeuCau(event);
            if (res.succeeded && res.data) {  
                setListChiNhanhDonViYeuCau(res.data)
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
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getLoaiKhachHang = async (params) => {
        try {
            const res = await danhMucApi.getDanhMucs(params)
            if (res.succeeded && res.data) {
                setLoaiKhachHang(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getLoaiTaiSan = async (params) => {
        try {
            const res = await danhMucApi.getDanhMucs(params)
            if (res.succeeded && res.data) {
                setLoaiTaiSan(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getHinhThucThanhToan = async (params) => {
        try {
            const res = await danhMucApi.getDanhMucs(params)
            if (res.succeeded && res.data) {
                setHinhThuThanhToan(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        pycID()
        getLoaiKhachHang('loai-khach-hang')
        getLoaiTaiSan('loai-tai-san')
        getHinhThucThanhToan('hinh-thuc-thanh-toan')
        getNguonDonViYeuCau();
    }, [])

    const onFinish = (values) => {
        actionForm.setFieldsValue({
            taiSans: dataListTS,
            trangThai: 1,
        });
        let params = actionForm.getFieldValue();
        params.tyLeChiHoaHong = values.tyLeChiHoaHong &&  typeof params.tyLeChiHoaHong === 'string' ? Number(values.tyLeChiHoaHong) : 0
        params.tamUng =  typeof params.tamUng === 'string' ? Number(params.tamUng.replace(/,/g, "")) : params.tamUng
        params.tongPhi = typeof params.tongPhi === 'string' ?  Number(params.tongPhi.replace(/,/g, "")) : params.tongPhi
        params.giaSoBo = typeof params.giaSoBo === 'string' ? Number(params.giaSoBo.replace(/,/g, "")) : params.giaSoBo
        params.soLuongChungThu = typeof params.soLuongChungThu === 'string' ? Number(params.soLuongChungThu) : params.soLuongChungThu
        if(params.tamUng > params.tongPhi){
            message.error('Số tiền tạm ứng phải nhỏ hơn tổng phí');
            setShowTamUng('Số tiền tạm ứng phải nhỏ hơn tổng phí');
            return
        }
        
        phieuYeuCauApi.updatePYC(params).then((res) => {
            if (res.succeeded && res.data) {
                // success
                message.success('Chỉnh sửa phiếu yêu cầu thành công!');
                setTimeout(() => {
                    window.location.reload(); 
                }, 1000)
            }else{
                message.error(res.message);
            }
        });
    };

    const onFinishFailed = (value) => {
        notification.info({
            message: 'Chỉnh sửa phiếu yêu cầu thất bại!',
        });
    };

    const onFinishTS = (values) => {
        FormTS.setFieldsValue({ taiLieuDinhKem: imgLink })
        let data = FormTS.getFieldValue();
        if(eventClickTS == 'UPDATE'){
            let temp =  dataListTS.map((item , index) => index == data.key  ? { ...data } : item)
            setDataListTS(temp);
            FormTS.resetFields();
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
            value === 1 ? setIsDoanhNghiep(false) : setIsDoanhNghiep(true);
        }
        if (key === 'loaiTS') {
            setTextLoaiTaiSan(e.children);
            FormTS.setFieldsValue({
                loaiTaiSanText: e.children,
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

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const changeDateNT = (date, dateString) => {
        setNgayTao(moment(date).format('YYYY-MM-DD'));
    };

    const changeDateNKSDK = (date, dateString) => {
        let dateNow = moment().format('DD/MM/YYYY');
        if (dateNow > dateString) {
            setShowValidatorDateKS(true);
        } else {
            setShowValidatorDateKS(false);
        }
    };
    const changeDateTDTD = (date, dateString) => {
        setThoiDiemThamDinh(moment(date).format('YYYY-MM-DD'));
    };
    const changeDateNKHD = (date, dateString) => {
        setNgayKiHopDong(moment(date).format('YYYY-MM-DD'));
    };

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

    const handleGiaSoBo = (e) => {
        const val = e.target.value
        let gia_so_bo = Number(e.target.value.replace(/,/g, ""));
        setGiaSoBo(gia_so_bo)
        if (val == '') {
            actionForm.setFieldsValue({ giaSoBo: null });
            return
        }
        if (val.charAt(0) == 0) {
            actionForm.setFieldsValue({ giaSoBo: val.slice(1) });
            return
        }
            actionForm.setFieldsValue({ giaSoBo: val.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
    }

    const handleTongPhi = (e) => {
        const val = e.target.value
        let tong_phi = Number(e.target.value.replace(/,/g, ""));
        setTongPhi(tong_phi)
        if (tong_phi <= 0 ) {
            console.log('true tổng phí');
            setShowTamUng('');
            setShowTongPhi(true);
            actionForm.setFieldsValue({ tongPhi: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
            return
        }
        else if (val == '') {
            actionForm.setFieldsValue({ tongPhi: null });
            return
        }

        else if (val.charAt(0) == 0) {
            actionForm.setFieldsValue({ tongPhi: val.slice(1) });
            return
        }
            setShowTongPhi(false);
            actionForm.setFieldsValue({ tongPhi: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
    }

    const handleTamUng = (e) => {
        const val = e.target.value
        let tong_phi = tongPhi_state;
        let tamUnga = Number(e.target.value.replace(/,/g, ""));
        setTamUng(tamUnga)
        if (tamUnga > tong_phi) {
            setShowTamUng('Số tiền tạm ứng phải nhỏ hơn tổng phí');
            actionForm.setFieldsValue({ tamUng: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
            return
        }
        else if (val == '') {
            actionForm.setFieldsValue({ tamUng: null });
            return
        }

        else if (val.charAt(0) == 0) {
            actionForm.setFieldsValue({ tamUng: val.slice(1) });
            return
        }
            setShowTamUng('');
            actionForm.setFieldsValue({ tamUng: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
    }



    const handleEditRow = (_,record,index) => {
        FormTS.setFieldsValue(record)
        addNewTypeTS('UPDATE')
    };

    const onChangeChiNhanh = (event,value) => {
        actionForm.setFieldsValue({ chiNhanhDonViYeuCau:  value.children})
    }

    const columns = [
        
        {
            title: 'Loại tài sản',
            dataIndex: '',
            key: 'loaiTaiSanText',
            render: (_,record,index) => <p> { record.loaiTaiSanText ? record.loaiTaiSanText 
                                            : record.loaiTaiSan ?  record.loaiTaiSan 
                                            : record.ten }</p>
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
            dataIndex: '',
            render: (record) => record.isLienKe && record.loaiTaiSanId == 1 ? 'Có' : record.loaiTaiSanId == 2 ? '' : 'Không'
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
                    chiNhanhDonViYeuCauId : actionForm.getFieldValue('chiNhanhDonViYeuCauId'), 
                    hinhThucThanhToanId: actionForm.getFieldValue('hinhThucThanhToanId'),
                    nguonDonViYeuCauId: actionForm.getFieldValue('nguonDonViYeuCauId'),
                }}
                >
                    <div className={styles.tp__23}>
                        <div>
                            <div>
                                <Row className={styles.tp__12}>
                                    <Col span={11}>
                                        <p className={styles.formItemTitle}>Số PYC</p>
                                        <Form.Item
                                            name="soPhieuYeuCau"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Bạn chưa nhập thông tin từ ngày',
                                                },
                                                {
                                                    max: 100,
                                                    message: 'Tối đa 100 ký tự!',
                                                },
                                            ]}
                                        >
                                            <Input
                                                disabled={true}
                                                maxLength={100}
                                                className={styles.formItemInput}
                                                name="soPhieuYeuCau"
                                                placeholder="Số PYC"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1} />
                                    <Col span={12} className={styles.formItem}>
                                        <p>Ngày </p>
                                        <Form.Item 
                                        name='ngayTao'
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
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>1. Loại Khách Hàng</h3>
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
                                                disabled={true}
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
                                            
                                                { danhMucLoaiKhachHang.map((option, index) => 
                                                        <Option key={index} value={option.value}>
                                                            {option.description}
                                                        </Option>
                                                        )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={1} />
                                    <Col span={12} className={styles.formItem}>
                                        <p className={styles.formItemTitle}>Chứng thư</p>
                                        <Form.Item
                                            name="soLuongChungThu"
                                        >
                                            <Input
                                                style={{ width: '100%' }}
                                                maxLength={4}
                                                onChange={(event) => actionForm.setFieldsValue({ soLuongChungThu: event.target.value.replace(/[^0-9\,\.]/g, "").replace('.', '')})}
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
                                                maxLength={1000}
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
                                                            max: 15,
                                                            message: 'Tối đa 15 ký tự!',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        maxLength={15}
                                                        onChange={ (event) => event.target.value > 0 ? event.target.value : actionForm.setFieldsValue({ maSoThue: event.target.value.replace(/[^0-9\,\.]/g, '').replace('--','')  })  }
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
                                                        maxLength={50}
                                                        onChange={ (event) => event.target.value > 0 ? event.target.value : actionForm.setFieldsValue({ soCMND: event.target.value.replace(/[^0-9]/g, '') })  }
                                                        className={styles.formItemInput}
                                                        size="large"
                                                        placeholder="Số CMND"
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
                                                    maxLength={100}
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
                                                    maxLength={100}
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
                                    <Col span={4} >
                                         <h3 className={styles.tp__11}>3. Tài sản thẩm định</h3> 
                                    </Col>
                                    <Col span={20}>
                                        <Button onClick={() => addNewTypeTS('ADD_NEW')} style={{ color: '#2196F3',bottom: '6px' }}>
                                            {' '}
                                            <PlusOutlined /> Thêm mới{' '}
                                        </Button>
                                    </Col>
                                 </Row>

                                <Table
                                    columns={columns}
                                    dataSource={dataListTS}
                                />

                                <Modal
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
                                                        { danhMucLoaiTaiSan.map((option, index) => 
                                                        <Option key={index} value={option.value}>
                                                            {option.description}
                                                        </Option>
                                                        )}
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
                                                <Form.Item>
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
                                                        maxLength={100}
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
                                              {imgLink ? <img style={{ width: '100%' }} src={'http://45.119.215.79/thamdinhgia' + imgLink} alt='Tài liệu đính kèm' /> : 
                                                        <img style={{ width: '100%' }} src={'http://45.119.215.79/thamdinhgia' + FormTS.getFieldValue('taiLieuDinhKem')} alt='Tài liệu đính kèm' /> }  
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
                                            message:
                                                'Bạn chưa nhập mục đích thẩm định',
                                        }
                                    ]}
                                >
                                    <Input
                                        className={styles.formItemInput}
                                        size="large"
                                        name="mucDichThamDinh"
                                        placeholder="Mục đích thẩm định"
                                    />
                                </Form.Item>


                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>5. Thời điểm thẩm định</h3>
                                <Form.Item 
                                name='thoiDiemThamDinh'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Bạn chưa nhập thời điểm thẩm định',
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        allowClear={false}
                                        size="large"
                                        placeholder="Chọn Thời điểm thẩm định"
                                        className={styles.formItemDatePicker}
                                        format={dateFormat}
                                        // defaultValue={moment(dataDetail.thoiDiemThamDinh)}
                                    />
                                </Form.Item>
                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>6. Phí thẩm định</h3>
                                <div className={styles.formItem}>
                                <Form.Item>
                                    <p className={styles.formItemTitle}>
                                        Tổng phí (Đã bao gồm VAT)
                                    </p>
                                    <Form.Item
                                        name="tongPhi"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Bạn chưa nhập tổng phí',
                                            },
                                        ]}
                                    >
                                        <Input
                                            maxLength={26}
                                            name="tongPhi"
                                            style={{ width: '100%' }}
                                            className={styles.formItemInput}
                                            size="large"
                                            placeholder="Tổng phí( Đã bao gồm VAT)"
                                            onChange={handleTongPhi}
                                        />
                                        
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
                                        <p className={styles.formItemTitle}> Tạm ứng</p>
                                            <Form.Item
                                                name="tamUng"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Bạn chưa nhập tạm ứng',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    maxLength={26}
                                                    name="tamUng"
                                                    style={{ width: '100%', paddingBottom: '5px' }}
                                                    size="large"
                                                    className={styles.formItemInput}
                                                    placeholder="Tạm ứng"
                                                    onChange={handleTamUng}
                                                />
                                            </Form.Item>
                                                    <p className="ant-form-item-explain-error">
                                                         {tongPhi_state < tamUng_state ? isShowTamUng : ""}
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
                                                showSearch
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
                                                { danhMucHinhThuThanhToan.map((option, index) => 
                                                        <Option key={index} value={option.value}>
                                                            {option.description}
                                                        </Option>
                                                        )}
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
                                            showSearch
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
                                                            max: 100,
                                                            message: 'Tối đa 100 ký tự!',
                                                        },
                                                        {
                                                            required: true,
                                                            message: 'Bạn chưa nhập Số hợp đồng',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        maxLength={100}
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
                                                <Form.Item 
                                                name="ngayKiHopDong"
                                                >
                                                        <DatePicker
                                                            placeholder="Chọn ngày kí hợp đồng"
                                                            size="large"
                                                            allowClear={false}
                                                            // onChange={changeDateNKHD}
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
                                        showSearch
                                        placeholder="Nguồn"
                                        optionFilterProp="children"
                                        size="large"
                                        bordered={false}
                                        style={{ paddingLeft: -20 }}
                                        className={styles.formItemSelect}
                                        onChange={(value, event) => getChiNhanh(value, event) }>
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
                                                    placeholder="Chi nhánh"
                                                    optionFilterProp="children"
                                                    size="large"
                                                    bordered={false}
                                                    style={{ paddingLeft: -20 }}
                                                    className={styles.formItemSelect}
                                                    onChange={(value,event) => onChangeChiNhanh(value,event) }
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
                                                    maxLength={1000}
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
                                                    maxLength={12}
                                                    onChange={ phoneLienHeKhaoSat }
                                                    size="large"
                                                    placeholder="Số điện thoại"
                                                    className={styles.formItemInput}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                <div className={styles.formItem}>
                                    <p className={styles.formItemTitle}>Ngày khảo sát dự kiến</p>
                                    <Form.Item 
                                    name='ngayKhaoSatDuKien'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Điền đầy đủ thông tin',
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            placeholder="Chọn ngày khảo sát dự kiến"
                                            className={styles.formItemDatePicker}
                                            size="large"
                                            allowClear={false}
                                            onChange={changeDateNKSDK}
                                            format={dateFormat}
                                        />
                                    </Form.Item>
                                        {isShowValidatorDateKS ? (
                                            <p style={{ color: 'red' }}>
                                                Ngày khảo sát dự kiến nhỏ hơn ngày hiện tại. Bạn cần
                                                cập nhật lại
                                            </p>
                                        ) : (
                                            ''
                                        )}
                                </div>
                            </div>
                            <div className={styles.tp__15}>
                                <h3 className={styles.tp__11}>8. Thông tin khác</h3>
                                <p className={styles.formItemTitle}>Giá sơ bộ đã báo</p>
                                <Form.Item
                                    name="giaSoBo"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Bạn chưa nhập Giá sơ bộ',
                                        },
                                    ]}
                                >
                                    <Input
                                        style={{ width: '100%' }}
                                        maxLength={13}
                                        className={styles.formItemInput}
                                        placeholder="Giá sơ bộ đã báo"
                                        onChange={handleGiaSoBo}
                                    />
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
                                        size="large"
                                        maxLength={1000}
                                        className={styles.formItemInput}
                                        placeholder="Ghi chú chung"
                                    />
                                </Form.Item>

                                <p className={styles.formItemTitle}>Tỷ lệ chi hoa hồng</p>
                                <Form.Item name="tyLeChiHoaHong">
                                    <Input
                                        style={{ width: '100%' }}
                                        size="large"
                                        className={styles.formItemInput}
                                        placeholder="Tỷ lệ chi hoa hồng"
                                        onChange={(event) => actionForm.setFieldsValue({ tyLeChiHoaHong: event.target.value.replace(/[^0-9]/g,'' ).replace('.', '')})}
                                    />
                                </Form.Item>

                                <p className={styles.formItemTitle}>Đơn vị chi hoa hồng</p>
                                <Form.Item name="donViChiHoaHong">
                                    <Input
                                        size="large"
                                        className={styles.formItemInput}
                                        placeholder="Đơn vị chi hoa hồng"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

              
                    <div style={{ float:'right' }}>
                        <Button
                            style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none' ,bottom: '15px',}}
                            htmlType="submit"
                            icon={<SaveOutlined style={{ fontSize: '16px' }} color={'#fff'} />}
                        >
                            Lưu
                        </Button>
                    </div>
            </Form>
        </Content>
    );
};

ModalUpdatePYC.Layout = AdminLayout; ///
export default ModalUpdatePYC;