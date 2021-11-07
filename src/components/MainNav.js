import { Container, Navbar, Row, Col } from "react-bootstrap";
import AuthenticationButton from "./auth/AuthenticationButton";
import DepositModal from './DepositModal';
import { useAuth0 } from "@auth0/auth0-react";
import Blog from './blog/Blog';

export function MainNav(props) {
    const { user } = useAuth0();

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
      Kotkis Folio
      </Navbar.Brand>

      <Navbar.Collapse className="justify-content-end">
          <AuthenticationButton />
        </Navbar.Collapse>
    </Container>
  </Navbar>
            </Col>
        </Row>

    );
}
