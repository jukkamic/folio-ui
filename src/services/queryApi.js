import axios from 'axios';

const QUERY_URL = process.env.REACT_APP_QUERY_URL;

const query = async(getAccessTokenSilently, endpoint, params) => {
    try {
        console.log("queryApi endpoint: " + endpoint);
        console.log("queryApi params: " + params);
        var method = "POST";
        const token = await getAccessTokenSilently();
        var options = {
            method: method,
            url: QUERY_URL,
            headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'},
            data: {"endpoint": endpoint, "params": params}
        }
        return await axios.request(options);        
    } catch (error) {
        console.log(error.message)
    }    
};

export const queryApi = {
    query,
}
