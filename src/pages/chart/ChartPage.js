import { withAuthenticationRequired  } from "@auth0/auth0-react";
import Loading from "../../components/Loading";

function ChartPage() {
    return(
        <>
        <h1>Charts be here</h1>
        </>
    )
}

export default withAuthenticationRequired(ChartPage, {
    onRedirecting: () => <Loading />,
  });
