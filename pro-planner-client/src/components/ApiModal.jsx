import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { updateApiKey } from '../redux/planParamSlice';

const ApiModal = props => {
	const [apiKey, setApiKey] = useState('');
	const dispatch = useDispatch();

	const handleSubmit = e => {
		e.preventDefault();
		props.onHide();
		dispatch(updateApiKey(apiKey));
	};

	const handleChange = event => {
		setApiKey(event.target.value);
	};

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			backdrop="static"
			keyboard={false}
		>
			<Modal.Header>
				<Modal.Title>Google Maps API Key</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Form.Text>
						Interested in Google Maps API Features such as Location
						Autocompletion and displaying a map within your Trip information?
					</Form.Text>
					<Form.Group>
						<Form.Control
							value={apiKey}
							onChange={handleChange}
							type="password"
							placeholder="API Key"
							required
						/>
					</Form.Group>
					<Form.Text className="text-muted">
						Need help in getting an API Key?{' '}
						<a href="https://developers.google.com/maps/documentation/javascript/get-api-key#:~:text=Go%20to%20the%20Google%20Maps%20Platform%20%3E%20Credentials%20page.&text=On%20the%20Credentials%20page%2C%20click,Click%20Close.">
							{' '}
							click here{' '}
						</a>
					</Form.Text>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={props.onHide} variant="danger">
						I don't want Google Map features
					</Button>
					<Button variant="primary" type="submit">
						Submit
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default ApiModal;
