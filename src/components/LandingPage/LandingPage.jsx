/**
 * LandingPage Component
 *
 * This component serves as the main landing page for the Audio Flashcards application.
 * It provides navigation options for the user to access different parts of the application,
 * such as the Project Management section. Additionally, it includes a button to exit the program.
 *
 * The component utilizes the AppContext for managing global state like the current project's name
 * and ID, resetting them when navigating to the project list.
 *
 * External Libraries:
 * - React Bootstrap for UI components.
 * - FontAwesome for icons.
 */
import React, { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { Button, Stack, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const { setCurrentProjectName, setCurrentProjectId } =
        useContext(AppContext);
    const navigate = useNavigate();

    const goToProjectList = () => {
        setCurrentProjectId(null);
        setCurrentProjectName('');
        navigate('/project-list');
    };

    const handleClose = () => {
        window.electronAPI.closeApp();
    };
    return (
        <Container>
            <Row>
                <h1 style={{ textAlign: 'center' }}>Audio Flashcards</h1>
            </Row>
            <Row>
                <br></br>
            </Row>
            <Row>
                <Col xs={4}></Col>
                <Col xs={4}>
                    <Stack direction="vertical" gap={2}>
                        <Button
                            title="Project Management"
                            onClick={goToProjectList}
                        >
                            Project Management
                        </Button>
                        <Button onClick={handleClose}>Exit Program</Button>
                    </Stack>
                </Col>
                <Col xs={4}></Col>
            </Row>
        </Container>
    );
};

export default LandingPage;
