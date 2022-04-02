import { useEffect, useState } from "react";
import axios from "axios";

const WALLET_URL = process.env.REACT_APP_WALLET_URL;

function PricePage() {
    const [priceResponse, setPriceResponse] = useState([]);

    axios.get(WALLET_URL + "price/BTCUSDT/")
    .then( (responseJson) => {
        // const history_json = JSON.parse(history.data);
        console.log("price response");
        console.log(responseJson);
        console.log("price response data");
        console.log(responseJson.data);
        console.log("price response JSON.parse");
        console.log(JSON.parse(responseJson.data))
        setPriceResponse(responseJson.data);
    }).catch( (err) => {
        console.log(err);
    }).finally( 
    );

    return(
        <>
        {priceResponse}
        </>
    )
}

export default PricePage;