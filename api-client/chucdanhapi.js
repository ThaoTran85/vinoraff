import axiosClient from './axios-client';
import axiosFormData from './axiosFormData';

export const chucDanhApi = {
    getChucDanh() {
        const params = {
            pageNumber: 1,
            pageSize: 2,
        };
        return axiosClient.get('/v1/ChucDanhs', params);
    },
    createChucDanh(params) {
        const url = '/v1/ChucDanhs';
        return axiosClient.post(url, params);
    },
    createChucDanhFormData(params) {
        const url = '/v1/ChucDanhs';
        return axiosFormData.post(url, params);
    },

    updateChucDanh(params) {
        const url = `/v1/ChucDanhs/${params?.id}`;
        return axiosClient.put(url, params);
    },
    updateChucDanhFormData(params, id) {
        const url = `/v1/ChucDanhs/${id}`;
        return axiosFormData.put(url, params);
    },
    getChucDanhId(id) {
        const url = `/v1/ChucDanhs/${id}`;
        return axiosClient.get(url);
    },
};
