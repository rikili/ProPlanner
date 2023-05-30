import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const LandingPage = () => {
    const renderTooltip = (text) => (
        <Tooltip id="button-tooltip">{text}</Tooltip>
    );

    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Choose type of plan to create</Card.Title>
                    <div className="d-grid gap-2">
                        <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip('Tooltip for Outing')}
                        >
                            <Button variant="primary" size="lg">
                                Outing
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip('Tooltip for Trip')}
                        >
                            <Button variant="secondary" size="lg">
                                Trip
                            </Button>
                        </OverlayTrigger>
                    </div>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>Join a Plan</Card.Title>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="email" placeholder="Enter a Plan URL or ID to join"/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
};

export default LandingPage;
