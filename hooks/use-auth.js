import { authApi } from 'api-client/index';
import useSWR from 'swr';
// import { PublicConfiguration } from 'swr/dist/types';

export function useAuth() {
    // profile

    const {
        data: data,
        error,
        mutate,
    } = useSWR('/v1/Users', {
        dedupingInterval: 6000, // sau 6s clear cache
        revalidateOnFocus: false, // quay lại tab cũ ko gọi api
        // ...PublicConfiguration,
    });

    const firstLoading = data === undefined && error === undefined;

    async function login(payload) {
        const result = await authApi.login(payload);
        await mutate();
        return result;
    }

    async function revokeToken() {
        await authApi.revokeToken();
        await mutate(null, false);
    }

    async function getToken() {
        return await authApi.getToken();
    }

    async function getUserInfo() {
        return await authApi.getUserInfo();
    }

    async function refreshToken(payload) {
        // const result = await authApi.refreshToken();
        await authApi.refreshToken(payload).then((res) => {
            console.log('res', res);
        });
        await mutate(null, false);
        // return result;
    }

    return {
        login,
        revokeToken,
        refreshToken,
        getToken,
        getUserInfo,
        data,
        error,
        firstLoading,
    };
}
