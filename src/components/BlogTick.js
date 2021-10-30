// import "../BlogTick.css";
import { useEffect, useState, useRef } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { Col, Row } from 'react-bootstrap';
// import {blogApi} from "../services/blogApi";
import  {NewsTicker, Directions} from "react-advanced-news-ticker";

function BlogTick() {
    // const { getAccessTokenSilently } = useAuth0();
    const newsTickRef = useRef(null);

    return(
        <div id="nt-example1-container">
            <i className="fa fa-arrow-up" 
                id="nt-example1-prev" 
                onClick={() => { newsTickRef.current.movePrev(); newsTickRef.current.resetInterval(); }} 
            />
            <NewsTicker 
                ref={newsTickRef} 
                id="nt-example1" 
                direction={Directions.UP} 
                rowHeight={80} 
                maxRows={3} 
                duration={4000}>
                <div>Content 1</div>
                <div>Content 2</div>
                <div>Content 3</div>
                <div>Content 4</div>
            </NewsTicker>
            <i className="fa fa-arrow-down" 
                id="nt-example1-next"
                onClick={() => { newsTickRef.current.moveNext(); newsTickRef.current.resetInterval(); }} />
        </div>
    )
}

export default BlogTick;