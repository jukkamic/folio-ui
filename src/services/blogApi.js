import axios from 'axios';

const BLOG_URL = process.env.REACT_APP_BLOG_URL;

const listPosts = async (getAccessTokenSilently) => {
    try {
        const token = await getAccessTokenSilently();
        var options = {
            method: 'GET',
            url: BLOG_URL,
            headers: {Authorization: 'Bearer ' + token},
        }
        return await axios.request(options);        
    } catch (error) {
        console.log(error.message)
    }    
}

const getPost = async (getAccessTokenSilently, id) => {
    try {
        const token = await getAccessTokenSilently();
        var options = {
            method: 'GET',
            url: BLOG_URL + id,
            headers: {Authorization: 'Bearer ' + token},
        }
        return await axios.request(options);        
    } catch (error) {
        console.log(error.message)
    }    
}

const latestPosts = async (getAccessTokenSilently, number) => {
    try {
        const token = await getAccessTokenSilently();
        var options = {
            method: 'GET',
            url: BLOG_URL + "latest/" + number,
            headers: {Authorization: 'Bearer ' + token},
        }
        return await axios.request(options);        
    } catch (error) {
        console.log(error.message)
    }    
}

const createPost = async(getAccessTokenSilently, postjson) => {
    try {
        var method = "POST";
        const token = await getAccessTokenSilently();
        if (postjson["id"] !== null && postjson["id"] !== "") {
            method = "PUT";
        }
        var options = {
            method: method,
            url: BLOG_URL,
            headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'},
            data: postjson
        }
        axios.request(options);        
    } catch (error) {
        console.log(error.message)
    }    
};

const deletePost = async(getAccessTokenSilently, id) => {
    try {
        const token = await getAccessTokenSilently();
        var options = {
            method: 'DELETE',
            url: BLOG_URL + id,
            headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
        }
        axios.request(options);        
    } catch (error) {
        console.log(error.message)
    }    
}

export const blogApi = {
    createPost,
    listPosts,
    latestPosts,
    getPost,
    deletePost
}