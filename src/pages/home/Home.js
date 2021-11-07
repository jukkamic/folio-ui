import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import useWindowSize from '../../utils/useWindowSize';
import { Col, Row, Accordion } from 'react-bootstrap';
import MyDoughnut from '../../components/MyDoughnut';
import Portfolio from '../../components/Portfolio';
import NewsTickerRow from '../../components/NewsTickerRow';
import NewsTick from '../../components/NewsTick';
import NewsComponent from '../../components/news/NewsComponent';
import BlogTick from '../../components/blog/BlogTick';
import { Spinner } from '../../components/Spinner';
import { createPriceTickerItems } from '../../utils/priceTicker';
import { countTotal, parseSymbolsValues } from '../../utils/walletParser';
  
function Home(props) {
    const { user } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("Refreshing...");
    const [values, setValues] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [priceItems, setPriceItems] = useState([(<NewsTick name="0" title="Prices coming in..." url="#"/> )]);
    const [total, setTotal] = useState(0);
    const size = useWindowSize();
    
    useEffect( () => {
        const total = countTotal(props.walletData);
        setTotal(total);
        const [symbols, values] = parseSymbolsValues(props.walletData, total, true);  
        setSymbols(symbols);
        setValues(values);
        const round_total = Math.round(parseFloat((total) + Number.EPSILON) * 100) / 100;
        setTitle("Total " + Intl.NumberFormat('en-US').format(round_total) + " USDT");  
        setPriceItems(createPriceTickerItems(props.walletData));
        setLoading(props.loading);
    }, [props.loading, props.walletData]);

    console.log("Window width " + size.width)
    return(
        <>
        <Row>
            <Col md={{"span": 3}} style={{"paddingRight": "8px", "textAlign": "right"}}>
                {loading ? <Spinner /> :
                <Accordion defaultActiveKey={user.email}>
                    <Portfolio name="Companyman" email="jukkamic@gmail.com" og="2205.24" share="0.9387" total={total} />
                    <Portfolio name="VV" email="varimo@iki.fi" og="162.09" share="0.0613" total={total} />
                </Accordion>
                }
            </Col>
            <Col md={{"span": 9}}>
                  <Accordion defaultActiveKey={parseInt(size.width) <= parseInt(767) ? "x" : "0"}>
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

export default Home;