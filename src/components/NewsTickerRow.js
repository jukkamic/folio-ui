import Ticker from 'react-ticker';
import { Col, Row } from 'react-bootstrap';
import { useState } from 'react';

const NewsTickerRow = (props) => {
    const [move, setMove] = useState(true);
    const moveToggleHandler = () => setMove(!move);
    return (
        <Row>
            <Col>
            <div style={{"whiteSpace": "nowrap"}}>
                <div onMouseEnter={moveToggleHandler} onMouseLeave={moveToggleHandler}>
                <Ticker key={props.rowKey} speed={props.speed} move={move}>
                    {({index}) => (
                    props.newsItems[index % props.newsItems.length]
                    )}
                </Ticker>
                </div>
            </div>
            </Col>
        </Row>
    );
}

export default NewsTickerRow;