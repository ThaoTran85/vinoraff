import { NextApiRequest, NextApiResponse } from 'next';
import httpProxy, { ProxyResCallback } from 'http-proxy';
import Coo from 'cookies';

// set config để parse body data khi trả về
export const config = {
    api: {
        bodyParser: false,
    },
};

const proxy = httpProxy.createProxyServer();

export default function handler(req, res) {
    console.log('login request');
    if (req.method !== 'POST') {
        return res.status(404).json({ message: 'method not support' });
    }
    return new Promise((resolve) => {
        // don't send cookies to API server
        req.headers.cookie = '';

        const handleLoginResponse = (proxyRes, req, res) => {
            let body = '';
            proxyRes.on('data', function (chunk) {
                body += chunk;
            });

            proxyRes.on('end', function () {
                try {
                    console.log('JSON.parse(body)', JSON.parse(body));
                    // todo
                    const { jwtToken, refreshToken, email, fullName } = JSON.parse(body).data; // nhận vào các params tương ứng với res API trả về

                    // convert token to cookie
                    const coo = new Coo(req, res, {
                        // secure: process.env.NODE_ENV !== "development",
                    });

                    coo.set('access_token', jwtToken, {
                        httpOnly: true,
                        sameSite: 'lax',
                        // expires: new Date(expiredAt),
                    });
                    coo.set('refresh_token', refreshToken, {
                        httpOnly: true,
                        sameSite: 'lax',
                        // expires: new Date(expiredAt),
                    });
                    coo.set('uInfo_email', email, {
                        httpOnly: true,
                        sameSite: 'lax',
                        // expires: new Date(expiredAt),
                    });
                    coo.set('uInfo_name', fullName, {
                        httpOnly: true,
                        sameSite: 'lax',
                        // expires: new Date(expiredAt),
                    });
                    // end todo

                    // res.end('Refresh Token successfully')
                    res.status(200).json({ message: 'Refresh Token successfully' });
                } catch (error) {
                    res.status(200).json({
                        successfull: false,
                        message: 'Something went wrong: Refresh Token',
                    });
                }
                resolve(true);
            });
        };

        proxy.once('proxyRes', handleLoginResponse);

        proxy.web(req, res, {
            // target: 'http://45.119.215.79/thamdinhgia',
            target: process.env.API_URL,
            changeOrigin: true,
            selfHandleResponse: true, // true => tự handle response
        });
    });
}
