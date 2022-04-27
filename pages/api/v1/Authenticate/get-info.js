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
            const uInfo_email = cookies.get('uInfo_email');
            const uInfo_name = cookies.get('uInfo_name');

            // token is existing
            if (uInfo_email && uInfo_email) {
                res.status(200).json({
                    message: 'get info was successfull',
                    uInfo_name: uInfo_name,
                    uInfo_email: uInfo_email,
                    status: true,
                });
                resolve(true);
            } else {
                res.status(200).json({
                    message: 'get info was fail',
                    status: false,
                });
            }
        } catch (error) {
            res.status(200).json({
                message: 'Something went wrong: Get Token',
                uInfo_name: null,
                uInfo_email: null,
                status: false,
            });
        }
    });
}
