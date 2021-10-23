import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from 'react';
import useInterval from 'react-useinterval';
import Scroller from './components/Scroller';
import MyDoughnut from './components/MyDoughnut';
import MyPortfolioRow from './components/MyPortfolioRow';
import NewsTickerRow from './components/NewsTickerRow';
import axios from "axios";
import { Container, Col, Row, Button } from 'react-bootstrap';
import DepositModalRow from './components/DepositModal';

const WALLET_URL = process.env.REACT_APP_WALLET_URL;
const NEWS_URL = process.env.REACT_APP_NEWS_URL;

const NewsTick = (props) => (
  <span key={props.name}  
        style={{"display": "inline-block", "whiteSpace": "nowrap"}}>
    <span key={"s" + props.name} className="dot"></span>
    <a key={"a" + props.name} className="tickers" target="_blank" rel="noreferrer" href={props.url}>{props.title}</a>
  </span>
);

function countTotal(data) {
  var total = 0;
  // eslint-disable-next-line
  for (const [key, value] of Object.entries(data)) {
    total += parseFloat(value["value"]);
  }
  return total;
}

function parseSymbolsValues(data, total, hideSmall) {
  const values = [];
  const symbols = [];
  const sorted = Object.entries(data).sort( function (a,b) {
    return (parseFloat(a[1]["value"]) < parseFloat(b[1]["value"]) ? 1 : -1);
  });
  for (const entry of Object.entries(sorted)) {
    const val = parseFloat(entry[1][1]["value"]);
    if( !(hideSmall && (val < 10)) ) {
      const share = (val / total) * 100.00;
      symbols.push(entry[1][1]["asset"] + " " + (share.toPrecision(2)).toString() + "%");
      values.push(val);
    }
  }
  return [symbols, values];
}

function createNewsTickItems(res) {
  const news = [];
  for (const result of res.data.results) {
    news.push( (<NewsTick name={result["id"]} title={result["title"]} url={result["url"]}/> ) );
  }
  return news;
}

async function fetchNews(kind, filter) {
  const res = await axios.get(NEWS_URL + "cryptopanic/" + kind + "/" + filter);
  return res;
}
  
async function fetchWalletData(hideSmall) {
  const res = await axios.get(WALLET_URL);
  return res.data;
}

function App() {
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);  
  const [title, setTitle] = useState("Refreshing...");
  const [walletData, setWalletData] = useState({})
  const [values, setValues] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [hideSmall, setHideSmall] = useState(true);
  const [newsItems, setNewsItems] = useState([(<NewsTick name="0" title="Loading news..." url="#"/> )]);
  const [mediaItems, setMediaItems] = useState([(<NewsTick name="1" title="Loading media..." url="#"/> )]);
  const [lolItems, setLolItems] = useState([(<NewsTick name="2" title="Loading the lulz..." url="#"/> )]);
  const [movePriceTicker, setMovePriceTicker] = useState(true);
  const [total, setTotal] = useState(0);

  const SLEEP_TIME = 2000;
  async function setData() {
    fetchWalletData(hideSmall).then( data => {
      setWalletData(data);
      const total = countTotal(data);
      setTotal(total);
      const [symbols, values] = parseSymbolsValues(data, total, hideSmall);  
      setSymbols(symbols);
      setValues(values);
      const round_total = Math.round(parseFloat((total) + Number.EPSILON) * 100) / 100;
      setTitle("Total " + Intl.NumberFormat('en-US').format(round_total) + " USDT");  
    }).catch(err => {
      console.log(err);
    })

    try {
      const news = await fetchNews("news", "all");
      const newsTickItems = createNewsTickItems(news);
      setNewsItems(newsTickItems);

      await new Promise(r => setTimeout(r, SLEEP_TIME));

      const mediaNews = await fetchNews("media", "all");
      const mediaTickItems = createNewsTickItems(mediaNews);
      setMediaItems(mediaTickItems);

      await new Promise(r => setTimeout(r, SLEEP_TIME));

      setLolItems(createNewsTickItems(await fetchNews("all", "lol")));

    } catch (err) {
      console.log(err);
    }

  }

  useInterval( () => {
    console.log("Reloading...");
    setData();
  }, 8000);

  useEffect( () => {
    setData();
    // eslint-disable-next-line
  }, [hideSmall]);

  const handlePriceBoxToggle = () => setMovePriceTicker(!movePriceTicker);
  const handleHideSmall = () => setHideSmall(!hideSmall);

  return (
    <div className="App">
      <Container fluid>
        <Row style={{"marginBottom": 0}}>
          <Col md={{"span": 2, "offset": 1}} style={{"paddingRight": "8px", "textAlign": "right", "borderRadius": "6px", "border": "2px solid black"}}>
            <MyPortfolioRow name="Companyman" og="1764.67" share="0.75047914435" total={total} />
            <MyPortfolioRow name="Zippo" og="542.39" share="0.23066759947" total={total} />
            <MyPortfolioRow name="VV" og="46.14" share="0.01885325627" total={total} />
            <DepositModalRow total={total} walletData={walletData}/>
            <Row>
              <Col>
              </Col>
            </Row>
          </Col>
          <Col md={{"span": 8}} style={{"borderRadius": "6px", "border": "1px solid black"}}>
            <Row style={{"marginBottom": "4px", "paddingTop": "0px"}}>
              <Col style={{"paddingTop": "4px", "textAlign": "middle", "border": "2px solid black"}}>
                <h2>{title}</h2>
              </Col>
            </Row>
            <Row style={{"marginBottom": "0px"}}>
              <Col style={{"textAlign": "left"}}>
                <Button style={{"marginLeft": "0px", "borderRadius": "6px", "border": "2px solid black", "padding": "4"}} onClick={handleHideSmall} size="sm" variant="secondary">{hideSmall ? "Show" : "Hide"} small balances</Button>
              </Col>
            </Row>
            <Row style={{"marginTop": "0px", "paddingBottom": "8px"}}>
              <Col>
                <MyDoughnut symbols={symbols} values={values}/>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={{"span": 10, "offset": 1}} style={{"borderRadius": "6px", "border": "2px solid black", "padding": 0}}>
            <Row>
              <Col>
                <span onMouseEnter={handlePriceBoxToggle} onMouseLeave={handlePriceBoxToggle}>
                  <Scroller data={walletData} movePriceTicker={movePriceTicker}/>
                </span>
              </Col>
            </Row>
            <NewsTickerRow rowKey="newsrow" speed={7} newsItems={newsItems} />
            <NewsTickerRow rowKey="mediarow" speed={7}  newsItems={mediaItems} />
            <NewsTickerRow rowKey="lolrow" speed={7}  newsItems={lolItems} />
          </Col>
        </Row>
      </Container>
    </div>
  );

}

export default App;
