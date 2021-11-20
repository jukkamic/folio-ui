import React from 'react';

const Tick = (props) => {
    const price = (props.price === "" ? "" : Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 3}).format(props.price));
    const change = Math.round(parseFloat((props.change) + Number.EPSILON) * 100) / 100;
    const up = (change >= 0) ? true : false;
    return (
        <span key={props.symbol}>
            <span className="dot" style={{"backgroundColor": "white"}}></span>
            <a href={props.url} target="_blank" rel="noreferrer" className="tickers"><b>{props.symbol}</b>  {price}</a> 
            {(props.change ? 
                <b><span className={(up ? "up" : "down")}> {(up ? "+" : "")}{change}%</span></b> : ""
            )}
        </span>);
};

export function createPriceTickerItems(data) {  
    const tickerItems = [];

    const getKeyLength = (x) => Object.keys(x).length;

    const keyLength = getKeyLength(data);
    const hasKeys = !!keyLength;

    if (!hasKeys) {
        tickerItems.push( (<Tick key="incoming" symbol="Prices coming in..." price="" url=""/>) );
    } else {
        // eslint-disable-next-line
        for (const entry of Object.entries(data)) {
            const asset = entry[1]["asset"];
            const price = parseFloat(entry[1]["price"]);
            var divisor = 100;
            if (price < 10) {
                divisor = 1000;
            }
            const rounded = Math.round((price + Number.EPSILON) * divisor) / divisor;
            const change = entry[1]["change"]; 
            if (asset !== "BUSD" && asset !== "USDT") {
                var url = "";
                if (asset === "TEL") {
                    url = "https://trade.kucoin.com/trade/TEL-USDT";
                }
                else if (asset === "BETH") {
                    url = "https://www.binance.com/en/trade/BETH_ETH";
                }
                else {
                    url = "https://www.binance.com/en/trade/" + asset + "_BUSD";
                }
                tickerItems.push( (<Tick key={asset} symbol={asset} price={rounded} url={url} change={change}/>) );
            }
        }
    }

    return tickerItems;
}
