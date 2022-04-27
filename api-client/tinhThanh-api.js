import axiosClient from './axios-client';

export const tinhThanhApi = {
    getCity() {
        const params = {
            pageNumber: 1,
            pageSize: 2,
        };
        return axiosClient.get('/v1/TinhThanhPhos', params);
    },
    createCity(params) {
        const url = '/v1/TinhThanhPhos';
        return axiosClient.post(url, params);
    },

    updateCity(params) {
        const url = `/v1/TinhThanhPhos/${params?.id}`;
        return axiosClient.put(url, params);
    },

    delteCity(id) {
        const url = `/v1/TinhThanhPhos/${id}`;
        return axiosClient.delete(url);
    },
};
