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
    const [id, setId] = useState("");

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
                if( results && results.data ) { 
                    setPosts(JSON.parse(results.data));
                } else {
                    console.log("Error with fetching posts. Result: ", results);
                }
            });
        }
        fetchData();
    }, [getAccessTokenSilently]); 

    useInterval( () => {
        async function fetchData() {
            const results = await blogApi.latestPosts(getAccessTokenSilently, 4);
            // console.log(JSON.parse(results.data));
            if( results && results.data ) { 
                setPosts(JSON.parse(results.data));
            } else {
                console.log("Error with fetching posts. Result: ", results);
            }
        }
        fetchData();
    }, 22000);

    return(
        <>
        <div className="vwrap"><div className="vmove">
            {posts.map( post => <div key={post["id"] + "div"} className="vitem"><b key={post["id"] + "b"}><span key={post["id"] + "span"} id={post["id"]} onClick={handleShow}>{post["title"]}</span></b></div>)}
        </div></div>
        <BlogModal show={show} handleHide={handleHide} id={id}/>
        </>
    )
}

export default BlogTick;