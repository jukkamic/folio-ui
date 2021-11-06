import { useState } from 'react';
import { Button } from "react-bootstrap";
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
        <>
        <Button style={{"color": "black", "backgroundColor": "#E7F1FF", "width": "100%"}} onClick={handleShow}> 
        <b>Post report</b>
        </Button>
        <BlogModal edit={true} id={""} show={show} handleHide={handleHide} />
        </>
    )
}

export default Blog;