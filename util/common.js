import { message } from 'antd';

export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

/***
 * Convert timestamp to current date
 * format: yyyy-MM-ddThh:mm
 */
export const timestamp_getDate = (timestamp) => {
    // convert timestamp to date
    const dateTime = new Date(timestamp);
    const temp = dateTime.toISOString();
    // const date = temp.slice(0, 19);
    return temp.slice(0, 19);
};

/***
 * Convert date to timestamp
 */
export const timestamp_getTimestamp = (date) => {
    const myDatenew = new Date(date);
    const newDate = myDatenew.getTime() / 1000.0;
    return newDate;
};

/**
 * Convert current Date to timestamp
 */
export const timestamp_getCurrentDate = () => {
    const time = Math.floor(new Date().getTime() / 1000.0);
    return time;
};

/***
 * Check Value Is Empty
 */
export function isEmpty(value) {
    return value === undefined || value === null || value === '';
}

/***
 * Check Object Is Empty
 */
export function isEmptyObject(obj) {
    if (obj !== null && obj !== undefined) return Object.keys(obj).length === 0;
    return true;
}

/****
 * Ant-design before upload file
 * @param file
 * @returns {boolean}
 */

export function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

/****
 *
 * @param img
 * @param callback
 */

export function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export let DocTienBangChu = function () {
    this.ChuSo = new Array(
        ' không ',
        ' một ',
        ' hai ',
        ' ba ',
        ' bốn ',
        ' năm ',
        ' sáu ',
        ' bảy ',
        ' tám ',
        ' chín '
    );
    this.Tien = new Array('', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ');
};

DocTienBangChu.prototype.docSo3ChuSo = function (baso) {
    var tram;
    var chuc;
    var donvi;
    var KetQua = '';
    tram = parseInt(baso / 100);
    chuc = parseInt((baso % 100) / 10);
    donvi = baso % 10;
    if (tram == 0 && chuc == 0 && donvi == 0) return '';
    if (tram != 0) {
        KetQua += this.ChuSo[tram] + ' trăm ';
        if (chuc == 0 && donvi != 0) KetQua += ' linh ';
    }
    if (chuc != 0 && chuc != 1) {
        KetQua += this.ChuSo[chuc] + ' mươi';
        if (chuc == 0 && donvi != 0) KetQua = KetQua + ' linh ';
    }
    if (chuc == 1) KetQua += ' mười ';
    switch (donvi) {
        case 1:
            if (chuc != 0 && chuc != 1) {
                KetQua += ' mốt ';
            } else {
                KetQua += this.ChuSo[donvi];
            }
            break;
        case 5:
            if (chuc == 0) {
                KetQua += this.ChuSo[donvi];
            } else {
                KetQua += ' lăm ';
            }
            break;
        default:
            if (donvi != 0) {
                KetQua += this.ChuSo[donvi];
            }
            break;
    }
    return KetQua;
};

DocTienBangChu.prototype.doc = function (SoTien) {
    var lan = 0;
    var i = 0;
    var so = 0;
    var KetQua = '';
    var tmp = '';
    var soAm = false;
    var ViTri = new Array();
    if (SoTien < 0) soAm = true; //return "Số tiền âm !";
    if (SoTien == 0) return 'Không đồng'; //"Không đồng !";
    if (SoTien > 0) {
        so = SoTien;
    } else {
        so = -SoTien;
    }
    if (SoTien > 8999999999999999) {
        //SoTien = 0;
        return ''; //"Số quá lớn!";
    }
    ViTri[5] = Math.floor(so / 1000000000000000);
    if (isNaN(ViTri[5])) ViTri[5] = '0';
    so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
    ViTri[4] = Math.floor(so / 1000000000000);
    if (isNaN(ViTri[4])) ViTri[4] = '0';
    so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
    ViTri[3] = Math.floor(so / 1000000000);
    if (isNaN(ViTri[3])) ViTri[3] = '0';
    so = so - parseFloat(ViTri[3].toString()) * 1000000000;
    ViTri[2] = parseInt(so / 1000000);
    if (isNaN(ViTri[2])) ViTri[2] = '0';
    ViTri[1] = parseInt((so % 1000000) / 1000);
    if (isNaN(ViTri[1])) ViTri[1] = '0';
    ViTri[0] = parseInt(so % 1000);
    if (isNaN(ViTri[0])) ViTri[0] = '0';
    if (ViTri[5] > 0) {
        lan = 5;
    } else if (ViTri[4] > 0) {
        lan = 4;
    } else if (ViTri[3] > 0) {
        lan = 3;
    } else if (ViTri[2] > 0) {
        lan = 2;
    } else if (ViTri[1] > 0) {
        lan = 1;
    } else {
        lan = 0;
    }
    for (i = lan; i >= 0; i--) {
        tmp = this.docSo3ChuSo(ViTri[i]);
        KetQua += tmp;
        if (ViTri[i] > 0) KetQua += this.Tien[i];
        if (i > 0 && tmp.length > 0) KetQua += ''; //',';//&& (!string.IsNullOrEmpty(tmp))
    }
    if (KetQua.substring(KetQua.length - 1) == ',') {
        KetQua = KetQua.substring(0, KetQua.length - 1);
    }
    KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
    if (soAm) {
        return 'Âm ' + KetQua + ' đồng'; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
    } else {
        return KetQua + ' đồng'; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
    }
};
