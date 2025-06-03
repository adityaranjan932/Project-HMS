import axios from 'axios';

export const apiConnector = async (method, url, bodyData, headers, params) => {
    const rawBaseURL = import.meta.env.VITE_API_BASE_URL;

    let effectiveBaseURL = '';
    if (rawBaseURL && rawBaseURL !== '""' && rawBaseURL !== 'null' && rawBaseURL !== 'undefined') {
        effectiveBaseURL = rawBaseURL;
    }

    const finalURL = `${effectiveBaseURL}${url}`;

    // Retrieve token from localStorage
    const token = localStorage.getItem("token"); // Directly get the string token

    const requestHeaders = {
        ...headers,
    };

    if (token && token !== "null" && token !== "undefined") { // Added checks for "null" and "undefined" strings
        requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    return axios({
        method: `${method}`,
        url: finalURL,
        data: bodyData ? bodyData : null,
        headers: requestHeaders, // Use the modified headers
        params: params ? params : null,
    });
};