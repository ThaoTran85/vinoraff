import axiosClient from './axios-client';

export const chungthuApi = {
    getChungThus() {
        const params = {
            pageNumber: 1,
            pageSize: 2,
        };
        return axiosClient.get('/v1/ChungThus', params);
    },
    getChungThusId(id) {
        const url = `/v1/ChungThus/${id}`;
        return axiosClient.get(url);
    },

    createChungThus(params) {
        const url = '/v1/ChungThus';
        return axiosClient.post(url, params);
    },

    updateChungThus(params) {
        const url = `/v1/ChungThus/${params?.id}`;
        return axiosClient.put(url, params);
    },
};
