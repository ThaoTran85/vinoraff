import axiosClient from './axios-client';

export const nganHangApi = {
    getNganHangs() {
        return axiosClient.get('/v1/NganHangs');
    }
};
