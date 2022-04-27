import httpProxy from 'http-proxy';
import Cookies from 'cookies';

// set config để parse body data khi trả về
export const config = {
    api: {
        bodyParser: false,
    },
};

const proxy = httpProxy.createProxyServer();

export default function handler(req, res) {
    return new Promise((resolve) => {
        // Convert cookies to header Authorization
        const cookies = new Cookies(req, res);
        const accessToken = cookies.get('access_token');
        if (accessToken) {
            // console.log('====> accessToken', accessToken);
            req.headers.Authorization = `Bearer ${accessToken}`;
        }

        // don't send cookies to API server
        req.headers.cookie = '';

        proxy.web(req, res, {
            // target: 'http://45.119.215.79/thamdinhgia',
            target: process.env.API_URL,
            changeOrigin: true,
            selfHandleResponse: false,
        });

        proxy.once('proxyRes', () => {
            resolve(true);
        });
    });
}
