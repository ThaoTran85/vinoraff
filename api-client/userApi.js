import axiosClient from './axios-client';

export const userApi = {
    getUser() {
        return axiosClient.get('/v1/Users');
    }
};
