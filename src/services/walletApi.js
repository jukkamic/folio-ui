import axios from "axios";

const WALLET_URL = process.env.REACT_APP_WALLET_URL;

async function fetchWalletData(token) {
    try {
        const res = await axios.get(WALLET_URL, {headers: {Authorization: "Bearer " + token}});
        // const res = await axios.request(options);
        return await res?.data;
    } catch (err) {
        console.log(err);
    }
}

function getWalletData(getAccessTokenSilently) {
    getAccessTokenSilently({
        audience: "https://folio.kotkis.fi/",
        scope: "read:all",
    }).then( (token) => {  
        return fetchWalletData(token);
    });        
}

export const walletApi = {
    getWalletData,
    fetchWalletData
}
