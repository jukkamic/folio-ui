import { Nav } from "react-bootstrap";

export function MainNav() {
    return(
        <div>
    <Nav activeKey="/">
        <Nav.Item>
                <Nav.Link href="/">Main</Nav.Link>
        </Nav.Item>
        <Nav.Item>
                <Nav.Link href="/home">Link</Nav.Link>
        </Nav.Item>
    </Nav>
    </div>
    );
}
