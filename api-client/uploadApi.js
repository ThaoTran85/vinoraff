import axiosFormData from './axiosFormData';

export const upLoadApi = {
    upload(data) {
        const url = '/v1/Utilities/upload-image';
        return axiosFormData.post(url, data);
    },
};
