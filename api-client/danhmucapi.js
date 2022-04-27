import axiosClient from './axios-client';

export const danhMucApi = {
    getDanhMucs(danhmuc) {
        const params = {
            pageNumber: 1,
            pageSize: 100,
        };
        return axiosClient.get(`/v1/DanhMucs/${danhmuc}`, params);
    }
};
