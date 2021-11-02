import { useEffect, useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { blogApi } from "../../services/blogApi";

const BlogModal = (props) => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [edit, setEdit] = useState(false);
    const [post, setPost] = useState({"title": "", "content": ""});

    const handleSubmit = async (e) => {
        e.preventDefault();
        var copy = {...post}
        copy["id"] = props.id;
        // Sick and tired of the whole screen crashing and burning with null pointers
        if (e.target.author.value) {
            copy["author"] = e.target.author.value;
        } else {
            copy["author"] = e.target.elements.author.value;
        }
        setPost(copy);
        if (copy["author"] && copy["author"] !== "") {
            blogApi.createPost(getAccessTokenSilently, copy);
        } else {
            console.log("Error submitting post. Author: ", copy["author"]);
        }
        setPost({});
        setEdit(false);
        props.handleHide();
    }

    const onTitleChange = (e) => {
        var copy = { ...post };
        copy["title"] = e.target.value;
        setPost(copy);
    };

    const onContentChange = (e) => {
        var copy = { ...post };
        copy["content"] = e.target.value;
        setPost(copy);
    }

    const toggleEdit = () => {
        setEdit( !edit );
    }

    const handleHide = () => {
        setPost({});
        setEdit(false);
        props.handleHide();
    }

    const handleDelete = () => {
        blogApi.deletePost(getAccessTokenSilently, props.id);
        handleHide();
    }

    useEffect( () => {
        populateData(props, setEdit, getAccessTokenSilently, setPost, edit);
    }, [props, getAccessTokenSilently, edit]);

    return(
        <Modal show={props.show} onHide={handleHide} id="blogModal">
        <Form onSubmit={handleSubmit}>
            <Modal.Header>
                <Modal.Title>                    
                    { props.id !== "" && !edit ? <>{post["title"]}</> : 
                    <Form.Control size="lg" name="title" width={60} type="text" value={post["title"]} 
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
                    { props.id !== "" && !edit ? <div style={{"whiteSpace": "pre-line"}}>{post["content"]}</div> : 
                    <>
                    <Form.Control rows={12} as="textarea" name="content" value={post["content"]} 
                                    placeholder="Content" onChange={onContentChange} /> 
                    <Button variant="primary" type="submit">
                        { props.id !== "" ? <>Update</> : <>Post</> }
                    </Button>
                    <Button variant="danger" type="submit" 
                            onClick={() => { if (window.confirm('Are you sure you wish to delete this post?') ) handleDelete(); } }>
                        Delete
                    </Button>
                    </>
                    }
                    </Modal.Body>
            <Modal.Footer>
                <Col span={8} style={{"alignContent": "left"}}>
                    <b>{props.id !== "" ? <>{post["author_name"]}</> : "Companyman"}</b> 
                </Col>
                <Col>
                    {post["created_on"] !== "" ? <>{stampToText(post["created_on"])}</> : ""}
                    {post["updated_on"] !== "" && post["updated_on"] > post["created_on"] ? <><br />Updated {stampToText(post["updated_on"])}</> : ""}
                </Col>
            </Modal.Footer>
            <input type="hidden" name="id" value={props.id} /> 
            <input type="hidden" name="author" value="1" />
        </Form>
        </Modal>
    )
}

export default BlogModal;

function stampToText(timestamp) {
    if ( timestamp !== null && timestamp !== "" ) {
        const d = new Date(timestamp);
        const s = d.getDate() + "." + parseInt(d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + "." + d.getSeconds();
        return s;
    } else {
        return timestamp;
    }
}

function populateData(props, setEdit, getAccessTokenSilently, setPost, edit) {
    if (props.edit) {
        setEdit(props.edit);
    }
    if (props.show && props.id !== "" && !edit) {
        async function fetchData() {
            blogApi.getPost(getAccessTokenSilently, props.id).then((results) => {
                const post = JSON.parse(results.data);
                setPost(post);
            });
        }
        fetchData();
    }
}
