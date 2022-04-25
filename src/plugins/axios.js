import axios from 'axios';

const instance = axios.create({
    timeout: 3600,
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json, text/plain, */*',
    },
});
export default instance;
