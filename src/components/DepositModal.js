import { useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Image, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { countTotal } from '../utils/walletParser';

const DEPOSIT_ADDR_URL = process.env.REACT_APP_WALLET_URL + "deposits/addr/";
const USD = "USDT";
  
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
    if (coin === USD) {
        return 1;
    }
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(data)) {
        if (value["asset"] === coin) {
            return value["price"];
        }
      }    
}

function DepositModal(props) {
    const [show, setShow] = useState(false);
    const [addr, setAddr] = useState("Fetching address...");
    const [coin, setCoin] = useState(USD);
    const [amountInUsdt, setAmountInUsdt] = useState("0");
    const [inputUsdt, setInputUsdt] = useState(false);
    const [amountInCoin, setAmountInCoin] = useState(0);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);
    const [total, setTotal] = useState(0);

    const handleClose = () => {
        setShow(false);
        setAmountInUsdt(0);
        setCoin(USD);
        setCopiedToClipboard(false);
    }

    const handleShow = () => {
        setTotal( countTotal(props.walletData) );
        setShow(true);
    }

    const handleAmount = (e) => {
        const amount = e.target.value;
        if (inputUsdt) {
            setAmountInUsdt(amount);
            setAmountInCoin(calculatePriceInCoin(amount));
        } else {
            setAmountInCoin(amount);
            setAmountInUsdt(calculatePriceInUSDT(amount));
        }
    };

    const handleSelectCrypto = (e) => {
        setAmountInUsdt(0);
        setAmountInCoin(0);
        setInputUsdt(false);
        setCopiedToClipboard(false);
        setCoin(e.target.value.toUpperCase());
    }

    const handleSwitchInput = () => {
        if (!inputUsdt) {
            setAmountInUsdt(amountInUsdt);
            setAmountInCoin(calculatePriceInCoin(amountInUsdt));
        } else {
            setAmountInCoin(amountInCoin);
            setAmountInUsdt(calculatePriceInUSDT(amountInCoin));
        }
        setInputUsdt(!inputUsdt);
    }

    // const handleFocus = (e) => {
    //     const inputNode = e.target;
    //     inputNode.setSelectionRange(0, inputNode.value.length);
    // }

    useEffect( () => {
        setAmountInUsdt(0);
        setAmountInCoin(0);
        setInputUsdt(false);
        copyToClipboard("");
        setCopiedToClipboard(false);
        setAddr("Fetching address...");
        fetchAddr(coin).then( res => {
            setAddr(res.data);
        });    
    }, [coin, show])



    return (
        <>
        <Button style={{"color": "black", "backgroundColor": "#E7F1FF", "width": "100%"}} onClick={handleShow}> 
        <b>Buy equity</b>
        </Button>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Buy equity in portfolio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col>
                    <FloatingLabel controlId="floatingSelect" label="Choose crypto" className="mb-3">
                        <Form.Select aria-label="Crypto deposit options" onChange={handleSelectCrypto}>
                            <option value={USD}>{USD}</option>
                            <option value="btc">BTC</option>
                            <option value="eth">ETH</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FloatingLabel
                        controlId="floatingInput"
                        label={inputLabel(inputUsdt)}
                        className="mb-3">
                        <Form.Control autoComplete="off" autoFocus onChange={handleAmount} type="text" placeholder="0" value={amountInCoinOrUsdt(inputUsdt)}/>
                            {/* onFocus={handleFocus}  */}
                    </FloatingLabel>
                </Col>
            </Row>
            <Row>
                <Col style={{"verticalAlign": "middle", "alignContent":"center", "textAlign": "center"}}>
                <Image onClick={handleSwitchInput} className="mb-3" src="swap2.svg" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <FloatingLabel
                        controlId="floatingInput"
                        label={inputLabel(!inputUsdt)}
                        className="mb-3">
                        <Form.Control type="text" placeholder="0.00" readOnly value={calculatePrice(inputUsdt, amountInCoinOrUsdt(inputUsdt))}/>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row style={{"padding": "16px", "textAlign": "left"}}>
                <Col>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Portfolio size"
                        className="mb-3">
                            <Form.Control type="text" placeholder="0.00" readOnly value={displayNumber(total) + " USDT"}/>
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Equity"
                        className="mb-3">
                            <Form.Control type="text" placeholder="0.00" readOnly value={displayNumber(round(calculateShare() * 100)) + "%"}/>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FloatingLabel
                        controlId="floatingInput"
                        label={"Deposit address " + coin}
                        className="mb-3">
                            <Form.Control onClick={handleCopy} type="text" placeholder="0.00" readOnly
                            value={addr["address"]}/>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row>
                <Col style={{"paddingLeft": "16px"}}>
                    {(copiedToClipboard ? "Copied to clipboard!" : "Click address to copy.")}
                </Col>
                <Col style={{"paddingLeft": "16px"}}>
                    <a style={{"color": "black"}} target="_blank" rel="noreferrer" href={addr["url"]}>View in blockchain</a>                            
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
        </>
    );

    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
          } else {
            const tmp = document.createElement('TEXTAREA');
            const focus = document.activeElement;
        
            tmp.value = text;
        
            document.body.appendChild(tmp);
            tmp.select();
            document.execCommand('copy');
            document.body.removeChild(tmp);
            focus.focus();
          }        
    }

    function handleCopy(e) {
//        navigator.clipboard.writeText(e.target.value);
//        e.target.focus();
        copyToClipboard(e.target.value);
        setCopiedToClipboard(true);
    }

    function inputLabel(yes) {
        const prefix = "Amount in ";
        return prefix + (yes ? USD : coin)
    }

    function amountInCoinOrUsdt(useUsdt) {
        if( useUsdt ) {
            return amountInUsdt;
        } else {
            return amountInCoin;
        }
    }
    // function addressLink() {
    //     return <a href={addr["url"]} target="_blank" rel="noreferrer">{addr["address"]}</a>
    // }

    function calculateShare() {
        if (amountInUsdt && total) {
            const totalPlusAmount = parseFloat(total) + parseFloat(amountInUsdt);
            const share = amountInUsdt / totalPlusAmount;
            return share;
        }
        return 0;
    }

    function calculatePriceInCoin(amount) {
        if (!amountInUsdt) {
            return 0;
        }
        const price = parseFloat(getPriceFromWalletData(coin, props.walletData));
        const conv = parseFloat(amount) / price;
        return conv;
    }

    function calculatePriceInUSDT(amount) {
        const price = parseFloat(getPriceFromWalletData(coin, props.walletData));
        const conv = parseFloat(amount) * price;
        return conv;
    }

    function calculatePrice(useUsdt, amount) {
        if (useUsdt) {
            return calculatePriceInCoin(amount);
        } else {
            return calculatePriceInUSDT(amount);
        }
    }

  }
  
  export default DepositModal;