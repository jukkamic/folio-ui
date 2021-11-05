import { Nav } from "react-bootstrap";
import AuthenticationButton from "./auth/AuthenticationButton";

export function MainNav() {
    return(
        <div>
    <Nav activeKey="/">
        <Nav.Item>
                <Nav.Link href="/">Folio</Nav.Link>
        </Nav.Item>
        <Nav.Item>
                <Nav.Link href="/charts">Chart</Nav.Link>
        </Nav.Item>
        <Nav.Item>
                <AuthenticationButton />
        </Nav.Item>
    </Nav>
    </div>
    );
}
