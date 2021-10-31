import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { blogApi } from "../../services/blogApi";

const BlogModal = (props) => {
    const { getAccessTokenSilently } = useAuth0();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const myjson = {"title": title, "content": content, "author": "1"}
        blogApi.createPost(getAccessTokenSilently, myjson);
    }

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const onContentChange = (e) => {
        setContent(e.target.value);
    }

    useEffect( () => {
        if( props.show && props.id) {
            async function fetchData() {
                blogApi.getPost(getAccessTokenSilently, props.id).then( (results) => {
                    const post = JSON.parse(results.data);
                    console.log("blog post title: " + post["title"]);
                    setTitle(post["title"]);
                    setContent(post["content"]);
                    setAuthor(post["author"]);    
                });
            }
            fetchData();
        }
    }, [getAccessTokenSilently, props.show, props.id]);

    return(
        <Modal show={props.show} onHide={props.handleHide} id="blogModal">
        <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>

                    { props.id ? <>{title}</> : 
                    <Form.Control size="lg" name="title" width="40" type="text" placeholder="Title" onChange={onTitleChange}/>
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    { props.id ? <>{content}</> : 
                    <Form.Control rows={12} as="textarea" name="content" placeholder="Content" onChange={onContentChange} /> 
                    }
                    <Button variant="primary" type="submit">
                        Post
                    </Button>
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Col>
                    <b>Author: {props.id ? <>{author}</> : <>Companyman</>}</b> 
                    </Col>
                </Row>
            </Modal.Footer>
            <input type="hidden" name="author" value="1" />
        </Form>
        </Modal>
    )
}

export default BlogModal;