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
        const cookies = new Cookies(req, res);

        // Get Token Of Current User
        const accessToken = cookies.get('access_token');
        console.log('accessToken', accessToken);
        // Reset Cookie
        cookies.set('access_token');
        cookies.set('refresh_token');
        res.status(200).json({ message: 'Logout successfull' });
        resolve(true);
    });
}
