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
                    // Get params same with params from return API
                    // console.log('JSON.parse(body)', JSON.parse(body).message);

                    const { succeeded, message, data } = JSON.parse(body);
                    const { jwtToken, refreshToken, fullName, email, id } = data || '';

                    // convert token to cookie
                    const coo = new Coo(req, res, {
                        secure: process.env.NODE_ENV !== 'development',
                    });

                    if (!succeeded) {
                        res.status(201).json({
                            message: message,
                            succeeded: succeeded,
                        });
                    }

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

                    // res.end('Login successfully')
                    res.status(200).json({
                        id: id,
                        succeeded: true,
                        message: message,
                        fullName: fullName,
                        email: email,
                    });
                } catch (error) {
                    res.status(500).json({ message: 'Something went wrong' });
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
