import axios from 'axios';

const listPosts = async (getAccessTokenSilently) => {
    try {
        const token = await getAccessTokenSilently();
        var options = {
            method: 'GET',
            url: "http://localhost:8000/folio/blog/posts/",
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
            url: "http://localhost:8000/folio/blog/posts/" + id,
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
            url: "http://localhost:8000/folio/blog/posts/latest/" + number,
            headers: {Authorization: 'Bearer ' + token},
        }
        return await axios.request(options);        
    } catch (error) {
        console.log(error.message)
    }    
}

const createPost = async(getAccessTokenSilently, postjson) => {
    try {
        const token = await getAccessTokenSilently();
        var options = {
            method: 'POST',
            url: "http://localhost:8000/folio/blog/posts/",
            headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'},
            data: postjson
        }
        axios.request(options);        
    } catch (error) {
        console.log(error.message)
    }    
};

export const blogApi = {
    createPost,
    listPosts,
    latestPosts,
    getPost
}