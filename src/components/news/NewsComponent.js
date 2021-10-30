import axios from "axios";
import { useState, useEffect } from "react";
import useInterval from 'react-useinterval';
import NewsTickerRow from "../NewsTickerRow";
import NewsTick from "../NewsTick";
import { createNewsTickItems } from '../../utils/newsTicker';

const NEWS_URL = process.env.REACT_APP_NEWS_URL;
const SLEEP_TIME = 2000;

async function fetchNews(kind, filter) {
    var options = {
        method: 'GET',
        url: NEWS_URL + "cryptopanic/" + kind + "/" + filter,
        // headers: {Authorization: 'Bearer ' + token}
    };
    const res = await axios.request(options);    
    return res;
}

const NewsComponent = (props) => {
    const [newsItems, setNewsItems] = useState([(<NewsTick name="1" title="Loading news..." url="#"/> )]);
    const [mediaItems, setMediaItems] = useState([(<NewsTick name="2" title="Loading media..." url="#"/> )]);
    const [lolItems, setLolItems] = useState([(<NewsTick name="3" title="Loading the lulz..." url="#"/> )]);

    async function loadNewsItems() {    
        try {
            setNewsItems(createNewsTickItems(await fetchNews("news", "all")));
            await new Promise(r => setTimeout(r, SLEEP_TIME));
            setMediaItems(createNewsTickItems(await fetchNews("media", "all")));
            await new Promise(r => setTimeout(r, SLEEP_TIME));
            setLolItems(createNewsTickItems(await fetchNews("all", "lol")));
          } catch (err) {
            console.log(err);
          }
    }

    useEffect( () => {
        loadNewsItems();
    }, []);

    useInterval( () => {
        loadNewsItems();
    }, 300000);

    return (
        <>
        <NewsTickerRow rowKey="newsrow" speed={7} newsItems={newsItems} />
        <NewsTickerRow rowKey="mediarow" speed={7}  newsItems={mediaItems} />
        <NewsTickerRow rowKey="lolrow" speed={7}  newsItems={lolItems} />
        </>
    );
}

export default NewsComponent;