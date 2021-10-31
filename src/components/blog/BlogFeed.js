import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Col, Row } from 'react-bootstrap';
import {blogApi} from "../services/blogApi";
import Ticker from 'react-ticker';


// const posts = [
//     {"title": "first post", "content": "hello world"},
//     {"title": "second post", "content": "still here?"},
//     {"title": "third post", "content": "always as bitcoin"},
// ]

function BlogFeed() {
    const [posts, setPosts] = useState([{"title": "Waiting for announcements..."}]);
    const { getAccessTokenSilently } = useAuth0();
    const [move, setMove] = useState(true);

    const moveToggleHandler = () => setMove(!move);

    useEffect(() => {
        async function fetchData() {
            const results = await blogApi.listPosts(getAccessTokenSilently);
            setPosts(JSON.parse(results.data));
        }
        fetchData();
    }, [getAccessTokenSilently]); // Or [] if effect doesn't need props or state

    return (
        <Row>
            <Col>
                <div style={{"whiteSpace": "nowrap"}}>
                    <div onMouseEnter={moveToggleHandler} onMouseLeave={moveToggleHandler}>
                    <Ticker key="postkey" speed={7} move={move}>
                        {({index}) => (
                            posts[index % posts.length]["title"]
                        )}
                    </Ticker>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default BlogFeed;