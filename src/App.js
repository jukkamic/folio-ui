import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import useInterval from 'react-useinterval';
import { Container, Col, Row, Accordion } from 'react-bootstrap';
import axios from "axios";
import MyDoughnut from './components/MyDoughnut';
import MyPortfolioRow from './components/MyPortfolioRow';
import NewsTickerRow from './components/NewsTickerRow';
import DepositModalRow from './components/DepositModal';
import NewsTick from './components/NewsTick';
import { createPriceTickerItems } from './utils/priceTicker';
import { createNewsTickItems } from './utils/newsTicker';
import { countTotal, parseSymbolsValues } from './utils/walletParser';
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from './components/LoginPage';
import LogoutButton from './components/LogoutButton';
import LoginButton from './components/LoginButton';
import Blog from './components/Blog';
import BlogFeed from './components/BlogFeed';

const WALLET_URL = process.env.REACT_APP_WALLET_URL;
const NEWS_URL = process.env.REACT_APP_NEWS_URL;

async function fetchNews(isAuthenticated, token, kind, filter) {
  if( isAuthenticated ) {
    var options = {
      method: 'GET',
      url: NEWS_URL + "cryptopanic/" + kind + "/" + filter,
      headers: {Authorization: 'Bearer ' + token}
    };

    const res = await axios.request(options);
    
    // const res = await axios.get(NEWS_URL + "cryptopanic/" + kind + "/" + filter);
    return res;
  }
}
  
async function fetchWalletData(isAuthenticated, token) {
  if(isAuthenticated) {
    try {
      const res = await axios.get(WALLET_URL, {headers: {Authorization: "Bearer " + token}});
      // const res = await axios.request(options);
      return await res?.data;
    } catch (err) {
      console.log("Error!", err);
    }

  }
}

function App() {
  // eslint-disable-next-line
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  // eslint-disable-next-line
  const [userMetadata, setUserMetadata] = useState(null);

  const [title, setTitle] = useState("Refreshing...");
  const [walletData, setWalletData] = useState({})
  const [values, setValues] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [priceItems, setPriceItems] = useState([(<NewsTick name="0" title="Prices coming in..." url="#"/> )]);
  const [newsItems, setNewsItems] = useState([(<NewsTick name="1" title="Loading news..." url="#"/> )]);
  const [mediaItems, setMediaItems] = useState([(<NewsTick name="2" title="Loading media..." url="#"/> )]);
  const [lolItems, setLolItems] = useState([(<NewsTick name="3" title="Loading the lulz..." url="#"/> )]);
  const [total, setTotal] = useState(0);

  const SLEEP_TIME = 2000;
  
  async function setData(isAuthenticated, token) {
    fetchWalletData(isAuthenticated, token).then( data => {
      setWalletData(data);
      const total = countTotal(data);
      setTotal(total);
      const [symbols, values] = parseSymbolsValues(data, total, true);  
      setSymbols(symbols);
      setValues(values);
      const round_total = Math.round(parseFloat((total) + Number.EPSILON) * 100) / 100;
      setTitle("Total " + Intl.NumberFormat('en-US').format(round_total) + " USDT");  
      setPriceItems(createPriceTickerItems(data));
    }).catch(err => {
      console.log(err);
    })

    try {
      setNewsItems(createNewsTickItems(await fetchNews(isAuthenticated, token, "news", "all")));
      await new Promise(r => setTimeout(r, SLEEP_TIME));
      setMediaItems(createNewsTickItems(await fetchNews(isAuthenticated, token, "media", "all")));
      await new Promise(r => setTimeout(r, SLEEP_TIME));
      setLolItems(createNewsTickItems(await fetchNews(isAuthenticated, token, "all", "lol")));
    } catch (err) {
      console.log(err);
    }

  }

  useInterval( () => {
    console.log("Reloading...");
    if (isAuthenticated) {
      getAccessTokenSilently({
//        audience: `https://dev-88-mri1m.us.auth0.com/api/v2/`,
        audience: "https://folio.kotkis.fi/",
        scope: "read:all",
      }).then( (token) => {
        setData(isAuthenticated, token);
      }).catch( err => {
        console.log(err);
      })
    }
  }, 78000);

  useEffect( () => {
    if (isAuthenticated) {
      getAccessTokenSilently({
//        audience: `https://dev-88-mri1m.us.auth0.com/api/v2/`,
        audience: "https://folio.kotkis.fi/",
        scope: "read:all",
      }).then( (token) => {
        setData(isAuthenticated, token);
      })
    }
  }, [getAccessTokenSilently, isAuthenticated, user]);

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="App">
      <Container fluid className="app-main">
        <Row style={{"marginBottom": 0}}>
          <Col md={{"span": 2, "offset": 1}} style={{"paddingRight": "8px", "textAlign": "right"}}>
            <MyPortfolioRow name="Companyman" og="1764.67" share="0.75047914435" total={total} />
            <MyPortfolioRow name="Zippo" og="542.39" share="0.23066759947" total={total} />
            <MyPortfolioRow name="VV" og="46.14" share="0.01885325627" total={total} />
            <DepositModalRow total={total} walletData={walletData}/>
            {isAuthenticated ? <LogoutButton /> : <LoginButton />} 
            {user?.email === "jukkamic@gmail.com" ? <Blog /> : ""}
          </Col>
          <Col md={{"span": 8}} style={{}}>
                <Accordion defaultActiveKey="0" flush={true}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header><h4 style={{"color": "black"}}>{title}</h4></Accordion.Header>
                    <Accordion.Body>
                      <Row style={{"marginTop": "0px", "paddingBottom": "8px"}}>
                        <Col>
                          <MyDoughnut symbols={symbols} values={values}/>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
          </Col>
        </Row>
        <Row>
          <Col md={{"span": 10, "offset": 1}} style={{"borderRadius": "6px", "border": "1px dotted gray", "padding": 0}}>
            <BlogFeed />
          </Col>
        </Row>
        <Row>
          <Col md={{"span": 10, "offset": 1}} style={{"borderRadius": "6px", "border": "1px dotted gray", "padding": 0}}>
            <NewsTickerRow rowKey="priceRow" speed={9} newsItems={priceItems} />
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
