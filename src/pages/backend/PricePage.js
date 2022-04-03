import { useState } from "react";
import {
    useSearchParams
} from "react-router-dom";
import axios from "axios";

const WALLET_URL = process.env.REACT_APP_WALLET_URL;

function PricePage() {
    const [searchParams] = useSearchParams();
    const symbol = searchParams.get("symbol")
    const [priceResponse, setPriceResponse] = useState([]);

    axios.get(WALLET_URL + "price/" + symbol + "/")
    .then( (responseJson) => {
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