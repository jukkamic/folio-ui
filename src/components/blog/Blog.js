import { useState } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import BlogModal from "./BlogModal";

function Blog() {
    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(true);
    }

    const handleHide = () => {
        setShow(false);
    }

    return(
        <Row>
            <Col style={{"textAlign": "center", "padding": "8px"}}>
                <Button style={{"color": "black", "backgroundColor": "#E7F1FF", "width": "100%"}} onClick={handleShow}> 
                <b>Post report</b>
                </Button>
                <BlogModal edit={true} id={""} show={show} handleHide={handleHide} />
            </Col>
        </Row>
    )
}

export default Blog;