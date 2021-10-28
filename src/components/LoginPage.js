import { Container, Row, Col } from 'react-bootstrap';
import '../Login.css';
import LoginButton from "./LoginButton";

function LoginPage(props) {
    return(

    <Container fluid className="main">
        <Row className="mainrow">
            <Col span={12} className="maincol">
                <img alt="logo" className="logo" src="/kotkis25-cr.jpg" />
                <LoginButton/>
            </Col>
        </Row>
    </Container>
    
    );
}

export default LoginPage;