import "./h-ticker.css";
import "./v-ticker.css";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {blogApi} from "../../services/blogApi";
import useInterval from "react-useinterval";
import BlogModal from "./BlogModal";

function BlogTick() {
    const [posts, setPosts] = useState([<div className="vitem">Expecting results...</div>]);
    const { getAccessTokenSilently } = useAuth0();
    const [show, setShow] = useState(false);
    const [id, setId] = useState(0);

    const handleShow = (e) => {
        setId(e.target.id);
        setShow(true);
    }

    const handleHide = () => {
        setShow(false);
    }

    useEffect(() => {
        async function fetchData() {
            await blogApi.latestPosts(getAccessTokenSilently, 4).then( (results) => {
                // console.log(JSON.parse(results.data));
                setPosts(JSON.parse(results.data));
            });
        }
        fetchData();
    }, [getAccessTokenSilently]); 

    useInterval( () => {
        async function fetchData() {
            const results = await blogApi.latestPosts(getAccessTokenSilently, 4);
            // console.log(JSON.parse(results.data));
            setPosts(JSON.parse(results.data));
        }
        fetchData();
    }, 22000);

    return(
        <>
        <div className="vwrap"><div className="vmove">
            {posts.map( post => <div key={post["id"]} className="vitem"><b><span key="hep" id={post["id"]} onClick={handleShow}>{post["title"]}</span></b></div>)}
        </div></div>
        <BlogModal show={show} handleHide={handleHide} id={id}/>
        </>
    )
}

export default BlogTick;