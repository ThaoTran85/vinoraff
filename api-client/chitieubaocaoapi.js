import axiosClient from './axios-client';

export const chitieuBaoCaoAPi = {
    getChiTieu() {
        const params = {
            pageNumber: 1,
            pageSize: 2,
        };
        return axiosClient.get('/v1/ChiTieuBaoCaos', params);
    },
    createChiTieu(params) {
        const url = '/v1/ChiTieuBaoCaos';
        return axiosClient.post(url, params);
    },

    updateChiTieu(params) {
        const url = `/v1/ChiTieuBaoCaos/${params?.id}`;
        return axiosClient.put(url, params);
    },
    getChiTieuId(id) {
        const url = `/v1/ChiTieuBaoCaos/${id}`;
        return axiosClient.get(url);
    },
};
