import axiosClient from './axios-client';

export const authApi = {
    login(payload) {
        return axiosClient.post('/v1/Authenticate/login', payload);
    },

    refreshToken(payload) {
        return axiosClient.post('/v1/Authenticate/refresh-token', payload);
    },

    getToken() {
        return axiosClient.post('/v1/Authenticate/get-token');
    },

    getUserInfo() {
        return axiosClient.post('/v1/Authenticate/get-info');
    },

    revokeToken(token) {
        return axiosClient.post('/v1/Authenticate/revoke-token', token);
    },

    getUser() {
        return axiosClient.get('/v1/Users');
    },

    changePassword(payload) {
        return axiosClient.post('/v1/Authenticate/change-password', payload);
    },

    setPassword(payload) {
        return axiosClient.post('/v1/Authenticate/set-password', payload);
    },
};
