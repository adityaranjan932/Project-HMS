import axios from 'axios';

export const apiConnector = async (method, url, bodyData, headers, params) => {
    const rawBaseURL = import.meta.env.VITE_API_BASE_URL;
    console.log('[API Connector] Raw VITE_API_BASE_URL from env:', rawBaseURL); // Log the raw value

    // Attempt to correctly interpret the base URL
    // If Vercel rewrites are used, this should ideally be an empty string.
    let effectiveBaseURL = ''; // Default to empty string
    if (rawBaseURL && rawBaseURL !== '""' && rawBaseURL !== 'null' && rawBaseURL !== 'undefined') {
        effectiveBaseURL = rawBaseURL;
    }
    console.log('[API Connector] Effective baseURL for concatenation:', effectiveBaseURL);
    console.log('[API Connector] Path (url parameter):', url);

    const finalURL = `${effectiveBaseURL}${url}`;
    console.log('[API Connector] Final Request URL:', finalURL); // Log the URL being called

    return axios({
        method: `${method}`,
        url: finalURL,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
};