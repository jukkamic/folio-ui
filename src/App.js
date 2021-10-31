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
import { countTotal, parseSymbolsValues } from './utils/walletParser';
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from './components/LoginPage';
import LogoutButton from './components/LogoutButton';
import LoginButton from './components/LoginButton';
import Blog from './components/blog/Blog';
import NewsComponent from './components/news/NewsComponent';
import BlogTick from './components/blog/BlogTick';

const WALLET_URL = process.env.REACT_APP_WALLET_URL;

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

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Refreshing...");
  const [walletData, setWalletData] = useState({})
  const [values, setValues] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [priceItems, setPriceItems] = useState([(<NewsTick name="0" title="Prices coming in..." url="#"/> )]);
  const [total, setTotal] = useState(0);
  
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
  }

  useEffect( () => {
    if (Object.keys(walletData).length > 0) {
      setLoading(false);
    }
  }, [walletData]);
  
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
  }, 18000);

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
            <MyPortfolioRow name="Companyman" og={loading ? "0" : "1764.67"} share="0.75047914435" total={total} />
            <MyPortfolioRow name="Zippo" og={loading ? "0" : "542.39"} share="0.23066759947" total={total} />
            <MyPortfolioRow name="VV" og={loading ? "0" : "46.14"} share="0.01885325627" total={total} />
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
            <BlogTick />
            <NewsTickerRow rowKey="priceRow" speed={9} newsItems={priceItems} />
            <NewsComponent />
          </Col>
        </Row>
      </Container>
    </div>
  );

}

export default App;
