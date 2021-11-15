import axios from "axios";

const WALLET_URL = process.env.REACT_APP_WALLET_URL;

async function fetchHistory(token, days) {
    try {
        const result = await axios.get(WALLET_URL + "history/" + days, {headers: {Authorization: "Bearer " + token}});
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function getHistory(getAccessTokenSilently, days) {
    getAccessTokenSilently({
        audience: "https://folio.kotkis.fi/",
        scope: "read:all",
    }).then( (token) => { 
        fetchHistory(token, days).then( (res) => {
            console.log("returning history data ");
            return res.data;
        }); 
    });        
}

export const archiveApi = {
    getHistory
}