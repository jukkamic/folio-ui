import { useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";

const DEPOSIT_ADDR_URL = process.env.REACT_APP_WALLET_URL + "deposits/addr/";
  
async function fetchAddr(coin) {
    const res = axios.get(DEPOSIT_ADDR_URL + coin);
    return await res;
}

function round(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

function displayNumber(num) {
    const rounded = round(num);
    return Intl.NumberFormat('en-US').format(rounded);
}

function getPriceFromWalletData(coin, data) {
    if (coin === "USDT") {
        return 1;
    }
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(data)) {
        if (value["asset"] === coin) {
            return value["price"];
        }
      }    
}

function DepositModalRow(props) {
    const [show, setShow] = useState(false);
    const [addr, setAddr] = useState("Fetching address...");
    const [coin, setCoin] = useState("USDT");
    const [amount, setAmount] = useState(0);

    const handleClose = () => {
        setShow(false);
        setAmount(0);
        setCoin("USDT");
        setAddr("Fetching address...");
    }

    const handleShow = () => setShow(true);

    const handleAmount = (e) => {
        const amount = e.target.value;
        setAmount(amount);
    };

    const handleSelectCrypto = (e) => {
        setCoin(e.target.value.toUpperCase());
        
        setAddr("Fetching address...");
        fetchAddr(coin).then( res => {
            setAddr(res.data);
        });
    }

    useEffect( () => {
        // const totalPlusAmount = parseFloat(props.total) + parseFloat(amount);
        // const share = amount / totalPlusAmount;
        // setShare(displayNumber(round(share*100)));

        // const price = parseFloat( getPriceFromWalletData(coin, props.walletData) );
        // const conv = parseFloat( amount ) / price;
        // setPriceInCoin(conv);

        setCoin("USDT");
        setAddr("Fetching address...");
        fetchAddr("USDT").then( (res) => {
            setAddr(res.data);
        });
    }, [])

    return (
        <Row>
            <Col style={{"textAlign": "center", "padding": "8px"}}>
                <Button style={{"width": "100%"}} variant="primary" onClick={handleShow}> 
                Buy equity
                </Button>
                <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Buy equity in portfolio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <FloatingLabel controlId="floatingSelect" label="Choose crypto">
                                <Form.Select aria-label="Crypto deposit options" onChange={handleSelectCrypto}>
                                    <option value="usdt">USDT</option>
                                    <option value="btc">BTC</option>
                                    <option value="eth">ETH</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row style={{"padding": "8px", "textAlign": "left"}}>
                        <Col>
                            <FloatingLabel controlId="floatingInputGrid">
                            <a href={addr["url"]} target="_blank" rel="noreferrer">{addr["address"]}</a>
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <Form.Text>
                                <b>Deposit address</b>
                            </Form.Text>                            
                        </Col>
                    </Row>
                    <Row style={{"padding": "16px", "textAlign": "left"}}>
                        <Col>
                            Portfolio size
                        </Col>
                        <Col>
                            <b>{displayNumber(props.total)} USDT</b>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Amount in USDT"
                                className="mb-3">
                                <Form.Control onChange={handleAmount} type="text" placeholder="0.00" />
                            </FloatingLabel>
                        </Col>
                        <Col>
                            Share: {displayNumber(round(calculateShare() * 100))} %
                            <br />
                            {calculatePriceInCoin()} {coin}
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col>
                            <b>NOTE</b>
                            <br />Actual share is subject to price changes. The final amount is determined at the moment of successful deposit transaction.
                        </Col>
                    </Row>
                </Modal.Footer>
                </Modal>
            </Col>
        </Row>
    );

    function calculateShare() {
        const totalPlusAmount = parseFloat(props.total) + parseFloat(amount);
        const share = amount / totalPlusAmount;
        return share;
    }

    function calculatePriceInCoin() {
        const price = parseFloat(getPriceFromWalletData(coin, props.walletData));
        const conv = parseFloat(amount) / price;
        return conv;
    }
  }
  
  export default DepositModalRow;