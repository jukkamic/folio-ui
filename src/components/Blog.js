import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import {blogApi} from "../services/blogApi";

function Blog(props) {
    // eslint-disable-next-line
    const { getAccessTokenSilently } = useAuth0();
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = () => {
        setShow(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const myjson = {"title": title, "content": content, "author": "1"}
        blogApi.createPost(getAccessTokenSilently, myjson);
        setShow(false);
    }

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const onContentChange = (e) => {
        setContent(e.target.value);
    }

    return(
        <Row>
            <Col style={{"textAlign": "center", "padding": "8px"}}>
                <Button style={{"color": "black", "backgroundColor": "#E7F1FF", "width": "100%"}} onClick={handleShow}> 
                <b>Post report</b>
                </Button>
                <Modal show={show} onHide={handleClose}>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {/* <input id="title" name="title" type="text" width="40" onChange={onTitleChange}/> */}
                                <Form.Control size="lg" name="title" width="40" type="text" placeholder="Title" onChange={onTitleChange}/>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                                {/* <input id="content" name="content" widht="80" height="16" type="textarea" onChange={onContentChange} /> */}
                                <Form.Control rows={12} as="textarea" name="content" placeholder="Content" onChange={onContentChange} /> 
                                <Button variant="primary" type="submit">
                                    Post
                                </Button>
                        </Modal.Body>
                        <Modal.Footer>
                            <Row>
                                <Col>
                                <b>Author: Companyman</b> 
                                </Col>
                            </Row>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Col>
        </Row>
    )
}

export default Blog;