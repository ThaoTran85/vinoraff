import axiosClient from './axios-client';

export const phongBanApi = {
    getPhongBan() {
        return axiosClient.get('/v1/PhongBans?PageSize=1000');
    },
    createPhongBan(params) {
        const url = '/v1/PhongBans';
        return axiosClient.post(url, params);
    },

    updatePhongBan(params) {
        const url = `/v1/PhongBans/${params?.id}`;
        return axiosClient.put(url, params);
    },

    getPhongBanId(id) {
        const url = `/v1/PhongBans/${id}`;
        return axiosClient.get(url);
    },
};
