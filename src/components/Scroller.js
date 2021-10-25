import React from 'react';
import Ticker from 'react-ticker';

// eslint-disable-next-line
const Tick = (props) => {
    const price = (props.price === "" ? "" : Intl.NumberFormat('en-US').format(props.price));
    const change = Math.round(parseFloat((props.change) + Number.EPSILON) * 100) / 100;
    const up = (change >= 0) ? true : false;
    return (
        <span key={props.symbol}>
            <span className="dot"></span>
            <a href={props.url} target="_blank" rel="noreferrer" className="tickers">{props.symbol}  {price}</a> 
            {(props.change ? 
                <span className={(up ? "up" : "down")}> {(up ? "+" : "")}{change}%</span> : ""
            )}
        </span>);
};
    

function Scroller(props) {  
    const tickerItems = [];

    const getKeyLength = (x) => Object.keys(x).length;

    const keyLength = getKeyLength(props.data);
    const hasKeys = !!keyLength;

    if (!hasKeys) {
        tickerItems.push( (<Tick key="incoming" symbol="Prices coming in..." price="" url=""/>) );
    } else {
        // eslint-disable-next-line
        for (const entry of Object.entries(props.data)) {
            const asset = entry[1]["asset"];
            const price = parseFloat(entry[1]["price"]);
            const rounded = Math.round((price + Number.EPSILON) * 100) / 100;
            const change = entry[1]["change"]; 
            if (asset !== "BUSD" && asset !== "USDT") {
                var url = "";
                if (asset === "TEL") {
                    url = "https://coinmarketcap.com/currencies/telcoin/";
                } else {
                    url = "https://www.binance.com/en/trade/" + asset + "_USDT";

                }
                tickerItems.push( (<Tick key={asset} symbol={asset} price={rounded} url={url} change={change}/>) );
            }
        }
    }

    return (
        <div style={{"whiteSpace": "nowrap"}}>
            <Ticker mode="smooth" speed={9} move={props.movePriceTicker}>
                {({index}) => (
                    [tickerItems]
                )}
            </Ticker>
        </div>
    );
}

export default Scroller;