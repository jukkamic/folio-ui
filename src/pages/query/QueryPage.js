// import { useEffect, useState } from "react";
// import { Button, Col, Form, Modal } from "react-bootstrap";
// import { useAuth0 } from "@auth0/auth0-react";
import { withAuthenticationRequired  } from "@auth0/auth0-react";
import QueryForm from "../../components/query/QueryForm";
import { MainNav } from "../../components/MainNav";
import {Spinner} from "../../components/Spinner";

function QueryPage() {
    return(
        <QueryForm />
    )
}

export default withAuthenticationRequired(QueryPage, {
    onRedirecting: () => <><MainNav /><Spinner /></>,
  });
