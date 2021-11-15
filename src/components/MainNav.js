import { Container, Navbar, Nav, Row, Col } from "react-bootstrap";
import AuthenticationButton from "./auth/AuthenticationButton";

export function MainNav() {

    return (
        <Row>
            <Col>
  <Navbar bg="black" variant="dark">
    <Container>
      <Navbar.Brand href="/">
        <img
          alt=""
          src="/kotkis25-cr.jpg"
          width="59"
          height="30"
          className="d-inline-block align-top"
        />{' '}
      </Navbar.Brand>

      <Nav.Link href="/">Home</Nav.Link>

      <Nav.Link href="/charts">Charts</Nav.Link>

      <Navbar.Collapse className="justify-content-end">
          <AuthenticationButton />
        </Navbar.Collapse>
    </Container>
  </Navbar>
            </Col>
        </Row>

    );
}
