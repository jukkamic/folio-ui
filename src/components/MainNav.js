import { Nav } from "react-bootstrap";
import AuthenticationButton from "./auth/AuthenticationButton";
import DepositModal from './DepositModal';
import { useAuth0 } from "@auth0/auth0-react";
import Blog from './blog/Blog';

export function MainNav(props) {
    const { user } = useAuth0();

    return(
    <Nav activeKey="/">
        <Nav.Item>
                <Nav.Link href="/">Folio</Nav.Link>
        </Nav.Item>
        <Nav.Item>
                <Nav.Link href="/charts">Chart</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <DepositModal walletData={props.walletData}/>
        </Nav.Item>
        {user?.email === "jukkamic@gmail.com" ? <Nav.Item><Blog /></Nav.Item> : ""}
        <Nav.Item>
                <AuthenticationButton />
        </Nav.Item>
    </Nav>
    );
}
