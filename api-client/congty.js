import axiosClient from './axios-client';

export const CongTyApi = {
    getCongTys() {
        const params = {
            pageNumber: 1,
            pageSize: 2,
        };
        return axiosClient.get('/v1/CongTys', params);
    },
    
    updatePYC(params) {
        const url = `/v1/CongTys/${params?.id}`;
        return axiosClient.put(url, params);
    },
    
};
