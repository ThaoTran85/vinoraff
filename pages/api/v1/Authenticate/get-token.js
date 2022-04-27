import Cookies from 'cookies';

// set config để parse body data khi trả về
export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(404).json({ message: 'method not support' });
    }

    return new Promise((resolve) => {
        try {
            const cookies = new Cookies(req, res);

            // Get Token Of Current User
            const access_token = cookies.get('access_token');
            const refresh_token = cookies.get('refresh_token');

            // token is existing
            if (access_token && refresh_token) {
                res.status(200).json({
                    message: 'get token was successfull',
                    access_token: access_token,
                    refresh_token: refresh_token,
                    status: true,
                });
                resolve(true);
            } else {
                res.status(200).json({
                    message: 'get token was fail',
                    status: false,
                });
            }
        } catch (error) {
            res.status(200).json({
                message: 'Something went wrong: Get Token',
                access_token: null,
                refresh_token: null,
                status: false,
            });
        }
    });
}
