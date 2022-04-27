import { useAuth } from 'hooks/use-auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Loading from './spin';
export function Auth({ children }) {
    const router = useRouter();
    const { data, firstLoading, getToken, refreshToken } = useAuth();
    // const fullName = data?.data[0].fullName;

    useEffect(() => {
        if (!firstLoading && !data?.data[0].fullName) {
            try {
                getToken().then((res) => {
                    // console.log('anh HỔ res', res);
                    const { status, access_token, refresh_token } = res || '';
                    // had cookie
                    if (status && access_token && refresh_token) {
                        // try refresh token
                        refreshToken({ jwtToken: access_token, refreshToken: refresh_token });
                    }
                    // main
                    if (!firstLoading && !data?.data[0].fullName) router.push('/dang-nhap');
                });
            } catch (error) {
                console.log('Login fail error', error);
                router.push('/dang-nhap');
            }
        }
    }, [firstLoading, data, router]);

    if (!data?.data[0].fullName)
        return (
            <>
                <Loading />
            </>
        );
    return <div>{children}</div>;
}
