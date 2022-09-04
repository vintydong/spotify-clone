import axios from 'axios';

const makeRequest = (endpoint, access_token) => {
    return axios.get(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + access_token,
        },
    });
};

export default makeRequest;
