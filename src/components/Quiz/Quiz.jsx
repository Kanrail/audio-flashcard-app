/**
 * Quiz Component
 *
 * Part of the Audio Flashcards application, the Quiz component manages the quiz functionality for a selected project.
 * It handles displaying flashcard questions, playing audio files, and evaluating user responses.
 *
 * Features:
 * - Fetches a randomized order of flashcards associated with the selected project.
 * - Plays the audio file attached to each flashcard and presents multiple choice answers.
 * - Tracks user's answers and scores the quiz.
 * - Displays results upon quiz completion and offers options to retake the quiz or return to project setup.
 *
 * State:
 * - Maintains the state of flashcards, current flashcard details, user's selected answer, and quiz progress using useState.
 * - Utilizes AppContext to access project-specific details and global settings.
 *
 * Behavior:
 * - Communicates with the Electron main process through 'window.electronAPI' for fetching flashcard data and randomized choices.
 * - Converts audio files from a Uint8Array to a base64 string for playback.
 *
 * External Libraries and Components:
 * - Uses React Bootstrap for UI components.
 * - FontAwesome icons for audio play button.
 * - Includes the Results component to display quiz outcomes.
 */
import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../AppContext.js';
import { Button, Stack, Row, Container, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { faEarListen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Quiz.css';
import Results from './Results.jsx';

const Quiz = () => {
    const { currentProjectId, currentProjectName, setRetryQuiz } =
        useContext(AppContext);
    const [flashcardIds, setFlashcardIds] = useState([]);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [currentFlashcardId, setCurrentFlashcardId] = useState(null);
    const [currentFlashcardFile, setCurrentFlashcardFile] = useState(null);
    const [currentFlashcardFileName, setCurrentFlashcardFileName] =
        useState('');
    const [currentFlashcardChoices, setCurrentFlashcardChoices] = useState([]);
    const [currentFlashcardChosenAnswer, setCurrentFlashcardChosenAnswer] =
        useState('');
    const [currentFlashcardAnswer, setCurrentFlashcardAnswer] = useState('');
    const [previousFlashcardAnswer, setPreviousFlashcardAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [questionOutcome, setQuestionOutcome] = useState('');
    const [attemptedFlashcards, setAttemptedFlashcards] = useState(0);
    const [finishQuiz, setFinishQuiz] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setupQuiz();
        setRetryQuiz(false);
    }, []);

    useEffect(() => {
        if (flashcardIds.length > 0) {
            startQuiz();
        }
    }, [flashcardIds]);

    const setupQuiz = async () => {
        try {
            const flashcardIdList =
                await window.electronAPI.getRandomizedFlashcardOrder({
                    projectID: currentProjectId,
                });
            setFlashcardIds(flashcardIdList);
        } catch (err) {
            console.error('Error setting up quiz: ', err);
        }
    };
    const startQuiz = async () => {
        if (flashcardIds.length > 0) {
            //Only allow start of quiz if there are actually flashcards present
            setCurrentFlashcardId(flashcardIds[0].FlashcardID);
            try {
                const flashcardRows = await window.electronAPI.getFlashcard({
                    flashcardID: flashcardIds[0].FlashcardID,
                });
                const flashcard = flashcardRows[0];
                const flashcardChoiceList =
                    await window.electronAPI.getRandomizedAnswersForQuestion({
                        projectID: currentProjectId,
                        flashcardID: flashcardIds[0].FlashcardID,
                        answer: flashcard.Answer,
                        numChoices: 5,
                    });
                setCurrentFlashcardChoices(flashcardChoiceList);
                setCurrentFlashcardFile(flashcard.File);
                setCurrentFlashcardFileName(flashcard.FileName);
                setCurrentFlashcardAnswer(flashcard.Answer);
            } catch (err) {
                console.error('Error getting flashcard: ', err);
            }
        } else {
            console.log('Flashcards not loaded');
        }
    };
    const evaluateAnswer = () => {
        let newScore = score;
        if (currentFlashcardChosenAnswer == currentFlashcardAnswer) {
            newScore += 1;
            setScore(newScore);
            setQuestionOutcome('Correct');
        } else {
            setQuestionOutcome('Incorrect');
        }
        let newAttemptsTotal = attemptedFlashcards + 1;
        setAttemptedFlashcards(newAttemptsTotal);
        setCurrentFlashcardChoices([]);
        setCurrentFlashcardFile(null);
        setCurrentFlashcardFileName('');
        setPreviousFlashcardAnswer(currentFlashcardAnswer);
        setCurrentFlashcardAnswer('');
        setCurrentFlashcardChosenAnswer('');
    };
    const nextQuestion = async () => {
        let currentIndex = currentFlashcardIndex + 1;
        setCurrentFlashcardIndex(currentIndex);
        setCurrentFlashcardId(flashcardIds[currentIndex].FlashcardID);
        try {
            const flashcardRows = await window.electronAPI.getFlashcard({
                flashcardID: flashcardIds[currentIndex].FlashcardID,
            });
            const flashcard = flashcardRows[0];
            const flashcardChoiceList =
                await window.electronAPI.getRandomizedAnswersForQuestion({
                    projectID: currentProjectId,
                    flashcardID: flashcardIds[currentIndex].FlashcardID,
                    answer: flashcard.Answer,
                    numChoices: 5,
                });
            setCurrentFlashcardChoices(flashcardChoiceList);
            setCurrentFlashcardFile(flashcard.File);
            setCurrentFlashcardFileName(flashcard.FileName);
            setCurrentFlashcardAnswer(flashcard.Answer);
        } catch (err) {
            console.error('Error getting flashcard: ', err);
        }
        setQuestionOutcome('');
    };

    const uint8ArrayToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const playFlashcardAudio = () => {
        const file = currentFlashcardFile;
        const fileName = currentFlashcardFileName;
        const base64string = uint8ArrayToBase64(file);
        const audioFileType = fileName.split('.')[1];
        const audioData = `data:audio/${audioFileType};base64,${base64string}`;
        const audio = new Audio(audioData);
        audio.play();
    };
    return (
        <Container>
            <Row>
                <h1>{currentProjectName} Quiz</h1>
            </Row>
            <Row>
                <hr></hr>
            </Row>
            {flashcardIds.length > 0 &&
                currentFlashcardId !== null &&
                currentFlashcardChoices.length > 0 &&
                questionOutcome == '' &&
                finishQuiz == false && (
                    <>
                        <Row style={{ paddingBottom: '40px' }}>
                            <Col>
                                <h3>
                                    Question {currentFlashcardIndex + 1} of{' '}
                                    {flashcardIds.length}
                                </h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} className="soundButtonCol">
                                <Button
                                    className="soundButton"
                                    variant="info"
                                    onClick={playFlashcardAudio}
                                >
                                    <FontAwesomeIcon icon={faEarListen} />
                                </Button>
                            </Col>
                            <Col xs={8}>
                                <Stack direction="vertical" gap={3}>
                                    {currentFlashcardChoices.map(
                                        (choice, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => {
                                                    setCurrentFlashcardChosenAnswer(
                                                        choice.Answer
                                                    );
                                                }}
                                                variant={
                                                    choice.Answer !=
                                                        currentFlashcardChosenAnswer &&
                                                    currentFlashcardChosenAnswer !==
                                                        ''
                                                        ? 'outline-secondary'
                                                        : 'secondary'
                                                }
                                            >
                                                {choice.Answer}
                                            </Button>
                                        )
                                    )}
                                </Stack>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: '35px' }}>
                            <Col xs={4}></Col>
                            <Col style={{ textAlign: 'center' }}>
                                <Button
                                    onClick={evaluateAnswer}
                                    disabled={
                                        currentFlashcardChosenAnswer == ''
                                    }
                                >
                                    Submit Answer
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}
            {finishQuiz == true && (
                <Results
                    score={score}
                    attemptedFlashcards={attemptedFlashcards}
                />
            )}
            {questionOutcome != '' && (
                <>
                    <Row style={{ paddingTop: '30px' }}>
                        <Col style={{ textAlign: 'center' }}>
                            <h2>
                                <span
                                    className={
                                        questionOutcome == 'Correct'
                                            ? 'correctAnswer'
                                            : 'incorrectAnswer'
                                    }
                                >
                                    {questionOutcome}
                                </span>
                                !
                            </h2>
                            {questionOutcome == 'Incorrect' && (
                                <h3>
                                    Correct answer was:{' '}
                                    <span className={'boldText'}>
                                        {previousFlashcardAnswer}
                                    </span>
                                </h3>
                            )}
                        </Col>
                    </Row>
                    <Row style={{ paddingTop: '20px' }}>
                        <Col style={{ textAlign: 'center' }}>
                            {attemptedFlashcards != flashcardIds.length && (
                                <Button
                                    variant="primary"
                                    onClick={nextQuestion}
                                >
                                    Next Question
                                </Button>
                            )}
                        </Col>
                    </Row>
                </>
            )}
            {flashcardIds.length == 0 && (
                <Row>
                    <h3>Error retriving flashcards.</h3>
                </Row>
            )}
            {finishQuiz == false && (
                <Row style={{ position: 'absolute', bottom: '30px' }}>
                    <Stack direction="horizontal" gap={4}>
                        <span style={{ fontSize: 'x-large' }}>
                            Score: <span className={'boldText'}>{score}</span>
                        </span>
                        <Button
                            variant="danger"
                            onClick={() => {
                                setFinishQuiz(true);
                                setQuestionOutcome('');
                            }}
                        >
                            End Quiz
                        </Button>
                    </Stack>
                </Row>
            )}
        </Container>
    );
};

export default Quiz;
