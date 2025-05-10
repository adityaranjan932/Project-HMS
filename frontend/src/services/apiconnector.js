import axios from 'axios';

export const apiConnector = async (method, url, bodyData, headers, params) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL; // Get base URL from env
    return axios({
        method: `${method}`,
        url: `${baseURL}${url}`, // Prepend base URL
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
};