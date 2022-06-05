import { withAuthenticationRequired  } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import useInterval from "react-useinterval";
import useWindowSize from '../../utils/useWindowSize';
import { Col, Row, Accordion, Alert } from 'react-bootstrap';
import MyDoughnut from '../../components/MyDoughnut';
import Portfolio from '../../components/Portfolio';
import NewsTickerRow from '../../components/NewsTickerRow';
import NewsTick from '../../components/NewsTick';
import NewsComponent from '../../components/news/NewsComponent';
import BlogTick from '../../components/blog/BlogTick';
import Blog from '../../components/blog/Blog';
import { MainNav } from "../../components/MainNav";
import { Spinner } from '../../components/Spinner';
import { createPriceTickerItems } from '../../utils/priceTicker';
import { countTotal, parseSymbolsValues } from '../../utils/walletParser';
import axios from "axios";

const WALLET_URL = process.env.REACT_APP_WALLET_URL;

function Home(props) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Refreshing...");
  const [values, setValues] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [priceItems, setPriceItems] = useState([(<NewsTick name="0" title="Prices coming in..." url="#"/> )]);
  const [total, setTotal] = useState(0);
  const [mobile, setMobile] = useState("0");
  const size = useWindowSize();
  const [walletData, setWalletData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);

  useEffect( () => {
    async function fetchWalletData() {
      const token = await getAccessTokenSilently({
        audience: "https://folio.kotkis.fi/",
        scope: "read:all",
      });
      
      await axios.get(WALLET_URL, {headers: {Authorization: "Bearer " + token}})
      .then( (response) => {
        setWalletData(response.data);
        setError(null);
      })
      .catch( (error) => {
        console.log(error);
        setError(error);
      }).finally( () => {
        setLoading(false);
      });
    }
    fetchWalletData();  
  },[getAccessTokenSilently, refresh]);

  useInterval( () => {
    setRefresh(!refresh);
  }, 13000);


  useEffect( () => {
      const total = countTotal(walletData);
      setTotal(total);
      const [symbols, values] = parseSymbolsValues(walletData, total, true);  
      setSymbols(symbols);
      setValues(values);
      const round_total = Math.round(parseFloat((total) + Number.EPSILON) * 100) / 100;
      setTitle("Total " + Intl.NumberFormat('en-US').format(round_total) + " USDT");  
      setPriceItems(createPriceTickerItems(walletData));
      setLoading(loading);
  }, [loading, walletData]);


  if ( size.width < 768 ) {
    if (mobile !== null) {
      setMobile(null);
    }
  }

  if (size.width >= 768) {
    if (mobile !== "0") {
      setMobile("0");
    }
  }
  return(
      <>
      {error ? 
        <Alert variant="danger" closeVariant="dark" dismissible={true} onClose={ () => {setError(null)}} >{error.message}</Alert>
      : <></> }
      <Row>
          <Col md={{"span": 3}} style={{"paddingRight": "8px", "textAlign": "right"}}>
              {loading ? <Spinner /> :
                <Accordion defaultActiveKey={user.email}>
                  { user.email === "jukkamic@gmail.com" || user.email === "varimo@iki.fi" ? 
                  <>
                  {/* 2205.24 + 381.26 = 2586.5 */}
                  <Portfolio name="Companyman" email="jukkamic@gmail.com" og="2586.50" share="0.95108648589" total={total} />
                  <Portfolio name="VV" email="varimo@iki.fi" og="162.09" share="0.0489135141" total={total} />
                  </>
                  : <></>
                  }
                </Accordion>
              }
              { user.email === "jukkamic@gmail.com" ? <Blog /> : <></>}
          </Col>
          <Col md={{"span": 9}}>
            <Accordion defaultActiveKey={mobile}>
              <Accordion.Item eventKey="0">
                <Accordion.Header><h4 style={{"color": "black"}}>{title}</h4></Accordion.Header>
                <Accordion.Body>
                  <Row style={{"marginTop": "0px", "paddingBottom": "8px"}}>
                    <Col>
                      {loading ? <Spinner /> :
                      <MyDoughnut symbols={symbols} values={values}/>
                      }
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        <Row>
          <Col>
            <BlogTick />
            <NewsTickerRow rowKey="priceRow" speed={9} newsItems={priceItems} />
            <NewsComponent />
          </Col>
        </Row>
    </>
  )
}

export default withAuthenticationRequired(Home, {
  onRedirecting: () => <><MainNav /><Spinner /></>,
});
