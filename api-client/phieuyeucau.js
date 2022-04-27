import axiosClient from './axios-client';

export const phieuYeuCauApi = {
    getPYC() {
        const params = {
            pageNumber: 1,
            pageSize: 1000,
        };
        return axiosClient.get('/v1/PhieuYeuCaus?PageNumber=1&PageSize=1000');
    },
    createPYC(params) {
        const url = '/v1/PhieuYeuCaus';
        return axiosClient.post(url, params);
    },

    updatePYC(params) {
        const url = `/v1/PhieuYeuCaus/${params?.id}`;
        return axiosClient.put(url, params);
    },
    getPYCId(id) {
        const url = `/v1/PhieuYeuCaus/${id}`;
        return axiosClient.get(url);
    },
    deletePYC(id) {
        const url = `/v1/PhieuYeuCaus/${id}`;
        return axiosClient.delete(url);
    },
    printPYC(id) {
        const url = `/v1/PhieuYeuCaus/print/${id}`;
        return axiosClient.get(url);
    }
};
