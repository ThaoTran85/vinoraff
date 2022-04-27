import axiosClient from './axios-client';

export const baoCaoKhaoSatApi = {
    getBCKS() {
        const params = {
            pageNumber: 1,
            pageSize: 2,
        };
        return axiosClient.get('/v1/BaoCaoKhaoSats', params);
    },
    getBCKSId(id) {
        const url = `/v1/BaoCaoKhaoSats/${id}`;
        return axiosClient.get(url);
    },

    createBCKS(params) {
        const url = '/v1/BaoCaoKhaoSats';
        return axiosClient.post(url, params);
    },

    updateBCKS(params) {
        const url = `/v1/BaoCaoKhaoSats/${params?.id}`;
        return axiosClient.put(url, params);
    },
};
