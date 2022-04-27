import axiosClient from './axios-client';

export const donViYeuCauApi = {
    getDonViYeuCau() {
        return axiosClient.get('/v1/NguonDonViYeuCaus');
    },
    getChiNhanhDonViYeuCau(id) {
        return axiosClient.get(`/v1/ChiNhanhDonViYeuCaus/${id}`);
    }
};
