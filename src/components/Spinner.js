import { Row, Col } from "react-bootstrap"

export const Spinner = () => {
    return(
        <div width="100%" height="100%" className="container-fluid">
            <Row style={{"align": "center", "verticalAlign": "middle"}}>
                <Col>
                    <div className="spinner-border"></div>
                </Col>
            </Row>
        </div>
    )
}