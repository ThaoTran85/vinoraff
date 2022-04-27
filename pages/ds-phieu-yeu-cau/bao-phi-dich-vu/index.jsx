/***
 * date: 25/04/2022
 * author: DaoNguyen
 */

import {
    PrinterOutlined,
} from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    Layout,
    Image,
    Modal,
    Typography,
} from 'antd';
import stylesReport from "./baophidichvu.module.css";
import React, { useEffect, useState } from 'react';
import AdminLayout from 'components/layout/admin';
import { Col, Row } from 'node_modules/antd/lib/index';
import styles from '../dsphieuyeucau.module.css';
import { CongTyApi } from 'api-client/congty';
// import { default as photo } from '../../public/assets/ptf-logo3.jpg';

const { TextArea } = Input;
const { Content } = Layout;


function BaoPhiDichVu (Props) {
    console.log('%cindex.jsx line:8 Props', 'color: #007acc;', Props.data);

    // -----   IN BÁO GIÁ DỊCH VỤ --------
    const [quoteServiceForm] = Form.useForm();
    const [dataDetail, setDatadetail] = useState(Props.data)
    const [dataCongTy, setDataCongTy] = useState(Props.data)


var specialElementHandlers = {
    '.no-export': function (element, renderer) {
        return true;
    }
};

async function getInfoCompany() {
    try {
        const res = await CongTyApi.getCongTys()
        if (res.succeeded && res.data) {
            setDataCongTy(res.data)
        }
    } catch (error) {
        console.log(error)
    }
}
useEffect(() => {
    getInfoCompany()
}, [])


const printQuoteService = (key) => {
    console.log('%cindex.jsx line:39 dataDetail?data.data', 'color: #007acc;', dataDetail);
    console.log('%cindex.jsx line:46 dataCongTy', 'color: #007acc;', dataCongTy);
    let params = quoteServiceForm.getFieldValue()
    params.id = dataDetail.id
    const jsPDF = require('jspdf')
    var doc = new jsPDF('p', 'pt', 'a4');
// //Html source 

// var source = document.getElementById('section');
var source = 
`
<section 
        id='section' 
        // className={stylesReport.none}
        >
            <Row>
                <Col span={10}>
                    <div className={styles.logoContent}>
                        <Image src='http://www.ptfv.com.vn/uploads/logo.JPG' alt="Logo" />
                    </div>
                </Col>
                <Col span={14}>
                    <p>${dataCongTy.ten }</p>
                    <p>CÔNG TY CP THẨM ĐỊNH GIÁ VÀ ĐẦU TƯ TÀI CHÍNH BƯU ĐIỆN</p>
                    <p>Công ty CP Thẩm Định giá và đầu tư tài chính bưu điện </p>
                    <p>MAIN VALUATION AND INVESTMENT JOINT STOCK COMPANY</p>
                    <p>MAIN VALUATION AND INVESTMENT JOINT STOCK COMPANY</p>
                </Col>
            </Row>
        </section>
`
var margins = {
    top: 10,
    bottom: 10,
    left: 10,
    width: 595
};

doc.fromHTML(
    source,
    margins.left,
    margins.top, {
        'width': margins.width,
        'elementHandlers': specialElementHandlers
    },

    function (dispose) {
        // doc.save('Test.pdf');
        window.open(doc.output('bloburl'), '_blank');
        
    }, margins);

    if(key == 'PRICE'){

        console.log('IN BÁO GIÁ DỊCH VỤ:', params);
    }
    else{
        console.log('IN XÁC NHẬN PHÍ:', params);
    }
};
const handleCancelPC = () => {
    setIsModalVisibleQuoteService(false);
    clickUnchecked()
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

    return(

    <Content>
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

            <div >
                <Row>
                    <Col span={12}>
                        <Button
                            key="submit"
                            style={{
                                width: '100%',
                                backgroundColor: '#2196F3',
                                color: '#fff',
                            }}
                            icon={<PrinterOutlined />}
                            onClick={()=> printQuoteService('PRICE')}
                        >
                            Báo giá dịch vụ
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button
                            key="link"
                            style={{
                                width: '100%',
                                backgroundColor: '#2196F3',
                                color: '#fff',
                            }}
                            icon={<PrinterOutlined />}
                            onClick={()=> printQuoteService('CONFIRM')}
                        >
                            Xác nhận phí
                        </Button>
                    </Col>
                </Row>
            </div>
        </Form>
        </Content>
    )
}

export default BaoPhiDichVu;