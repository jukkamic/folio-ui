import { useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";

const DEPOSIT_ADDR_URL = process.env.REACT_APP_WALLET_URL + "deposits/addr/";
  
async function fetchAddr(coin) {
    const res = axios.get(DEPOSIT_ADDR_URL + coin);
    return await res;
}

function DepositModalRow(props) {
    const [show, setShow] = useState(false);
    const [addr, setAddr] = useState("none");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSelectCrypto = (e) => {
        setAddr("Fetching address...");
        fetchAddr(e.target.value).then( res => {
            setAddr(res.data["address"]);
        });
    }

    useEffect( () => {
        fetchAddr("usdt").then( (a) => {
                setAddr(a.data["address"]);
            }
        );
    }, [])

    return (
        <Row>
            <Col style={{"textAlign": "center", "padding": "8px"}}>
                <Button style={{"width": "100%"}} variant="primary" onClick={handleShow}> 
                Buy equity
                </Button>
                <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Deposit crypto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingSelect" label="Choose crypto">
                        <Form.Select aria-label="Crypto deposit options" onChange={handleSelectCrypto}>
                            <option value="usdt">USDT</option>
                            <option value="btc">BTC</option>
                            <option value="eth">ETH</option>
                        </Form.Select>
                    </FloatingLabel>
                    <Form.Label>{addr}</Form.Label>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
                </Modal>
            </Col>
        </Row>
    );
  }
  
  export default DepositModalRow;