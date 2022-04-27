import axiosFormData from './axiosFormData';

export const upLoadImageApi = {
    uploadFile(data) {
        const url = '/v1/Utilities/upload-image';
        return axiosFormData.post(url, data);
    },
};
