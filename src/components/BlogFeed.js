import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
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
 
    useEffect(() => {
        async function fetchData() {
            const results = await blogApi.listPosts(getAccessTokenSilently);
            setPosts(JSON.parse(results.data));
        }
        fetchData();
    }, []); // Or [] if effect doesn't need props or state

    return (
        <Ticker key="postkey" speed={7} move={true}>
            {({index}) => (
                posts[index % posts.length]["title"]
            )}
        </Ticker>
    )
}

export default BlogFeed;