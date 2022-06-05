import { useState } from "react";
import { Button, Form, } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { queryApi } from "../../services/queryApi";

const QueryForm = (props) => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [endpoint, setEndpoint] = useState("");
    const [params, setParams]  = useState({});
    const [response, setResponse] = useState();


    async function fetchData(endpoint, params) {
        queryApi.query(getAccessTokenSilently, endpoint, params).then((results) => {
            const resp = JSON.stringify(results.data);
            setResponse(resp);
        });
    }

    const handleSubmit = async (e) => {
        if( user.email === "jukkamic@gmail.com") {
            e.preventDefault();
            fetchData(endpoint, params);
        }
    }

    const endpointChangeHandler = (e) => {
        setEndpoint(e.target.value);
    }

    const paramsChangeHandler = (e) => {
        setParams(e.target.value);
    }

    return(
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEndpoint">
                <Form.Label>Endpoint</Form.Label>
                <Form.Control type="text" placeholder="Enter endpoint" onChange={endpointChangeHandler}/>
                <Form.Text className="text-muted">
                e.g. bapi/futures/v4/private/future/user-data/user-balance
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formParams">
                <Form.Label>Query parameters in JSON</Form.Label>
                <Form.Control type="textarea" placeholder="Params" onChange={paramsChangeHandler}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>

            <h2>Response</h2>
            {response}
        </Form>
    )
}

export default QueryForm;