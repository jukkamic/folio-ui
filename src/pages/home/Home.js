import { useState, useEffect } from 'react';
import { Col, Row, Accordion } from 'react-bootstrap';
import MyDoughnut from '../../components/MyDoughnut';
import MyPortfolioRow from '../../components/MyPortfolioRow';
import NewsTickerRow from '../../components/NewsTickerRow';
import NewsTick from '../../components/NewsTick';
import { createPriceTickerItems } from '../../utils/priceTicker';
import { countTotal, parseSymbolsValues } from '../../utils/walletParser';
import NewsComponent from '../../components/news/NewsComponent';
import BlogTick from '../../components/blog/BlogTick';
  
function Home(props) {
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("Refreshing...");
    const [values, setValues] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [priceItems, setPriceItems] = useState([(<NewsTick name="0" title="Prices coming in..." url="#"/> )]);
    const [total, setTotal] = useState(0);
    
    useEffect( () => {
        const total = countTotal(props.walletData);
        setTotal(total);
        const [symbols, values] = parseSymbolsValues(props.walletData, total, true);  
        setSymbols(symbols);
        setValues(values);
        const round_total = Math.round(parseFloat((total) + Number.EPSILON) * 100) / 100;
        setTitle("Total " + Intl.NumberFormat('en-US').format(round_total) + " USDT");  
        setPriceItems(createPriceTickerItems(props.walletData));
        setLoading(false);
    }, [props.loading, props.walletData]);

    return(
        <>
        <Row>
            <Col style={{"paddingRight": "8px", "textAlign": "right"}}>
                <MyPortfolioRow name="Companyman" loading={loading} og={loading ? "0" : "1989.38"} share="0.77" total={total} />
            </Col>
            <Col style={{"paddingRight": "8px", "textAlign": "right"}}>
                <MyPortfolioRow name="Zippo" loading={loading} og={loading ? "0" : "542.39"} share="0.21" total={total} />
            </Col>
            <Col style={{"paddingRight": "8px", "textAlign": "right"}}>
                <MyPortfolioRow name="VV" loading={loading} og={loading ? "0" : "46.14"} share="0.02" total={total} />
            </Col>
        </Row>
        <Row>
            <Col>
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