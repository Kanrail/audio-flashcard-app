/**
 * Results Component
 *
 * This component is a part of the Audio Flashcards application and is responsible for displaying the results of a quiz.
 * It shows the user's score and provides options to retake the quiz or return to the project setup.
 *
 * Features:
 * - Displays the total score and the number of attempted flashcards.
 * - Provides a button to retake the quiz, which resets the quiz state and navigates back to the project setup.
 * - Includes a button to navigate back to the project setup for additional project management tasks or to start a new quiz.
 *
 * State:
 * - Uses the AppContext to set the retry quiz flag when the user decides to retake the quiz.
 *
 * Props:
 * - score (integer): The final score of the quiz.
 * - attemptedFlashcards (integer): The total number of flashcards attempted in the quiz.
 *
 * External Libraries and Components:
 * - Uses React Bootstrap for UI components.
 */
import React, { useContext } from 'react';
import { AppContext } from '../../AppContext.js';
import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Results = ({ score, attemptedFlashcards }) => {
    const navigate = useNavigate();
    const { setRetryQuiz } = useContext(AppContext);

    const doRetryQuiz = () => {
        setRetryQuiz(true);
        navigate('/project-setup');
    };

    return (
        <>
            <Row style={{ textAlign: 'center' }}>
                <h2>Final Results</h2>
            </Row>
            <Row style={{ textAlign: 'center' }}>
                <h3>
                    {score} of {attemptedFlashcards} answered correctly.
                </h3>
            </Row>
            <Row style={{ textAlign: 'center', paddingBottom: '10px' }}>
                <Col xs={4}></Col>
                <Col xs={4}>
                    <Button variant="outline-primary" onClick={doRetryQuiz}>
                        Retake Quiz
                    </Button>
                </Col>
                <Col xs={4}></Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
                <Col>
                    <Button onClick={() => navigate('/project-setup')}>
                        Back to Project Setup
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default Results;
