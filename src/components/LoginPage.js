import { Container, Row, Col, Image } from 'react-bootstrap';
import '../Login.css';
import LoginButton from "./LoginButton";

function LoginPage() {
    return(

    <Container fluid className="main">
        <Row className="mainrow">
            <Col span={12} className="maincol">
                <img alt="logo" class="logo" src="http://localhost:3000/kotkis25-cr.jpg" />
                <LoginButton/>
            </Col>
        </Row>
    </Container>
    
    );
}

export default LoginPage;