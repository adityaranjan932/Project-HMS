import axios from 'axios';

export const apiConnector = async (method, url, bodyData, headers, params) => {
    const rawBaseURL = import.meta.env.VITE_API_BASE_URL;
    // console.log('[API Connector] Raw VITE_API_BASE_URL from env:', rawBaseURL); // Log the raw value

    let effectiveBaseURL = ''; 
    if (rawBaseURL && rawBaseURL !== '""' && rawBaseURL !== 'null' && rawBaseURL !== 'undefined') {
        effectiveBaseURL = rawBaseURL;
    }
    // console.log('[API Connector] Effective baseURL for concatenation:', effectiveBaseURL);
    // console.log('[API Connector] Path (url parameter):', url);

    const finalURL = `${effectiveBaseURL}${url}`;
    // console.log('[API Connector] Final Request URL:', finalURL); 

    // Retrieve token from localStorage
    const token = localStorage.getItem("token"); // Directly get the string token
    console.log('[API Connector] Token from localStorage:', token); // Log the retrieved token

    const requestHeaders = {
        ...headers,
    };

    if (token && token !== "null" && token !== "undefined") { // Added checks for "null" and "undefined" strings
        requestHeaders["Authorization"] = `Bearer ${token}`;
    }
    
    console.log('[API Connector] Request Headers:', JSON.stringify(requestHeaders)); // Log the final headers

    return axios({
        method: `${method}`,
        url: finalURL,
        data: bodyData ? bodyData : null,
        headers: requestHeaders, // Use the modified headers
        params: params ? params : null,
    });
};