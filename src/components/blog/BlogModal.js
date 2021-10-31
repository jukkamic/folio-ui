import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { blogApi } from "../../services/blogApi";

const BlogModal = (props) => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("Companyman");
    const [edit, setEdit] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const myjson = {"title": title, "content": content, "author": "1", "id": props.id}
        blogApi.createPost(getAccessTokenSilently, myjson);
        setTitle("");
        setContent("");
        setEdit(false);
        props.handleHide();
    }

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const onContentChange = (e) => {
        setContent(e.target.value);
    }

    const toggleEdit = () => {
        setEdit( !edit );
    }

    const handleHide = () => {
        setTitle("");
        setContent("");
        setEdit(false);
        props.handleHide();
    }

    const handleDelete = () => {
        blogApi.deletePost(getAccessTokenSilently, props.id);
        handleHide();
    }

    useEffect( () => {
        populateData(props, setEdit, getAccessTokenSilently, setTitle, setContent, setAuthor, edit);
    }, [props, getAccessTokenSilently, edit]);

    return(
        <Modal show={props.show} onHide={handleHide} id="blogModal">
        <Form onSubmit={handleSubmit}>
            <Modal.Header>
                <Modal.Title>                    
                    { props.id && !edit ? <>{title}</> : 
                    <Form.Control size="lg" name="title" width={60} type="text" value={title} 
                                        placeholder="Title" onChange={onTitleChange}/>
                    }
                </Modal.Title>
                { user.email === "jukkamic@gmail.com" ? 
                        <Button variant={edit ? "secondary" : "primary"} 
                                        onClick={toggleEdit}>{edit ? <>Undo</> : <>Edit</>}</Button>
                        : <></>
                    }
            </Modal.Header>
            <Modal.Body>
                    { props.id && !edit ? <div style={{"white-space": "pre-line"}}>{content}</div> : 
                    <>
                    <Form.Control rows={12} as="textarea" name="content" value={content} 
                                    placeholder="Content" onChange={onContentChange} /> 
                    <Button variant="primary" type="submit">
                        { props.id ? <>Update</> : <>Post</> }
                    </Button>
                    <Button variant="danger" type="submit" 
                            onClick={() => { if (window.confirm('Are you sure you wish to delete this post?') ) handleDelete(); } }>
                        Delete
                    </Button>
                    </>
                    }
                    </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Col>
                    <b>Author: {props.id ? <>{author}</> : <>Companyman</>}</b> 
                    </Col>
                </Row>
            </Modal.Footer>
            <input type="hidden" name="id" value={props.id} /> 
            <input type="hidden" name="author" value="1" />
        </Form>
        </Modal>
    )
}

export default BlogModal;

function populateData(props, setEdit, getAccessTokenSilently, setTitle, setContent, setAuthor, edit) {
    if (props.edit) {
        setEdit(props.edit);
    }
    console.log("props id " + props.id + ", edit " + edit);
    if (props.show && props.id && !edit) {
        async function fetchData() {
            blogApi.getPost(getAccessTokenSilently, props.id).then((results) => {
                const post = JSON.parse(results.data);
                setTitle(post["title"]);
                setContent(post["content"]);
                setAuthor(post["author"]);
            });
        }
        fetchData();
    }
}
