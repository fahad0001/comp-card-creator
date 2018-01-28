import axios from 'axios';

export const apiDataUpload = (url, data) => {
    return axios.post(url, data);
};
