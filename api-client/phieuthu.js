import axiosClient from './axios-client';

export const phieuThuApi = {
    getPYC() {
        const params = {
            pageNumber: 1,
            pageSize: 2,
        };
        return axiosClient.get('/v1/PhieuThus', params);
    },
    createPTT(params) {
        const url = '/v1/PhieuThus';
        return axiosClient.post(url, params);
    },

    updatePTT(params) {
        const url = `/v1/PhieuThus/${params?.id}`;
        return axiosClient.put(url, params);
    },
    updateTTPTT(params) {
        const url = `/v1/PhieuThus/update_status`;
        return axiosClient.post(url, params);
    },
    getPTTId(id) {
        const url = `/v1/PhieuThus/${id}`;
        return axiosClient.get(url);
    },
};
