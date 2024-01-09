/**
 * FlashcardSetup Component
 *
 * This component is part of the Audio Flashcards application and is responsible for managing the flashcards within a specific project.
 * It allows users to view, edit, delete, and add new flashcards associated with the selected project.
 *
 * Features:
 * - Retrieves and displays a list of flashcards for the currently selected project.
 * - Provides functionalities to add, edit, and delete flashcards.
 * - Includes an audio playback feature for each flashcard.
 * - Navigates to the quiz setup page for the current project.
 *
 * State:
 * - Manages the state of flashcards, edited flashcard details, and modal visibility using React's useState hook.
 * - Uses the AppContext to access and set global state values related to the current project.
 *
 * Behavior:
 * - Communicates with the Electron main process through the 'window.electronAPI' for CRUD operations on flashcards.
 * - Uses FileReader API for handling file uploads and conversions.
 *
 * External Libraries and Components:
 * - Uses React Bootstrap for UI components.
 * - FontAwesome icons for visual enhancement.
 * - Includes the AddFlashcardModal component for adding new flashcards.
 */
import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../AppContext.js';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Row, Container, Table, Col } from 'react-bootstrap';
import AddFlashcardModal from './AddFlashcardModal.jsx';
import {
    faTrashCan,
    faPencil,
    faSave,
    faEarListen,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FlashcardSetup = () => {
    const {
        currentProjectName,
        setCurrentProjectName,
        setCurrentProjectId,
        currentProjectId,
        MAX_FILE_SIZE,
        retryQuiz,
    } = useContext(AppContext);
    const [flashcards, setFlashcards] = useState([]);
    const [editFlashcardId, setEditFlashcardId] = useState(null);
    const [editedFileName, setEditedFileName] = useState('');
    const [editedFile, setEditedFile] = useState(null);
    const [editedAnswer, setEditedAnswer] = useState('');
    const [oririginalEditedFileName, setEditedOriginalFileName] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const loadFlashcards = async () => {
        try {
            const flashcardsList = await window.electronAPI.getFlashcards({
                projectID: currentProjectId,
            });
            setFlashcards(flashcardsList);
        } catch (err) {
            console.error('Error fecthing flashcards: ', err);
        }
    };

    useEffect(() => {
        loadFlashcards();
        if (retryQuiz == true) {
            goToQuiz();
        }
    }, []);

    const goToQuiz = () => {
        navigate('/quiz');
    };
    const startEdit = (flashcard) => {
        setEditFlashcardId(flashcard.FlashcardID);
        setEditedFileName(flashcard.FileName);
        setEditedAnswer(flashcard.Answer);
        setEditedOriginalFileName(flashcard.FileName);
        setEditedFile(null);
    };
    const saveEdit = async () => {
        if (editedFile) {
            //File was changed
            const reader = new FileReader();
            reader.onload = async (event) => {
                const buffer = window.nodeAPI.createBuffer(event.target.result);
                try {
                    await window.electronAPI.editFlashcard({
                        flashcardID: editFlashcardId,
                        fileName: editedFileNamenpm,
                        answer: editedAnswer,
                        file: buffer,
                    });
                    setEditFlashcardId(null);
                    setEditedFile(null);
                    loadFlashcards();
                } catch (err) {
                    console.error('Error editing flashcard: ', err);
                }
            };
            reader.readAsArrayBuffer(editedFile);
        } else {
            //Just the answer was changed
            try {
                await window.electronAPI.editFlashcard({
                    flashcardID: editFlashcardId,
                    fileName: oririginalEditedFileName,
                    answer: editedAnswer,
                    file: null,
                });
                setEditFlashcardId(null);
                setEditedFile(null);
                loadFlashcards();
            } catch (err) {
                console.error('Error editing flashcard: ', err);
            }
        }
    };
    const cancelEdit = () => {
        setEditFlashcardId(null);
    };
    const addFlashcard = async (fileName, answer, file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const buffer = window.nodeAPI.createBuffer(event.target.result);
                try {
                    await window.electronAPI.addFlashcard({
                        fileName: fileName,
                        answer: answer,
                        projectID: currentProjectId,
                        file: buffer,
                    });
                    setShowModal(false);
                    loadFlashcards();
                } catch (err) {
                    console.error('Error adding flashcard: ', err);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Error saving file.');
        }
    };
    const deleteFlashcard = async (flashcard) => {
        await window.electronAPI.deleteFlashcard({
            flashcardID: flashcard.FlashcardID,
        });
        loadFlashcards();
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

    const playFlashcardAudio = (file, fileName) => {
        const base64string = uint8ArrayToBase64(file);
        const audioFileType = fileName.split('.')[1];
        const audioData = `data:audio/${audioFileType};base64,${base64string}`;
        const audio = new Audio(audioData);
        audio.play();
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/ogg'];
            if (allowedTypes.includes(file.type)) {
                if (file.size > MAX_FILE_SIZE) {
                    event.target.value = null;
                    setEditedFileName(oririginalEditedFileName);
                    alert(
                        'File size is too large, limit the file size to 30MB.'
                    );
                } else {
                    setEditedFile(file);
                    setEditedFileName(file.name);
                }
            } else {
                event.target.value = null;
                setEditedFileName(oririginalEditedFileName);
                alert(
                    'This file type is not allowed. Please upload an audio file (.mp3, .wav, or .ogg).'
                );
                event.target.value = null;
            }
        }
    };
    const goBackToProjectList = () => {
        setCurrentProjectId(null);
        setCurrentProjectName('');
        navigate('/project-list');
    };

    return (
        <Container>
            <Row>
                <h1>{currentProjectName} Flashcards</h1>
            </Row>
            <Row style={{ paddingBottom: '5px' }}>
                <Col style={{ textAlign: 'right' }}>
                    <Button onClick={() => setShowModal(true)}>
                        New Flashcard <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <AddFlashcardModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        handleSave={addFlashcard}
                    />
                </Col>
            </Row>
            <div className="scrollableTable">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Answer</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {flashcards.length <= 0 ? (
                            <tr>
                                <td colSpan={3} style={{ fontWeight: 600 }}>
                                    Please add a flashcard
                                </td>
                            </tr>
                        ) : (
                            flashcards.map((flashcard) => (
                                <tr key={flashcard.FlashcardID}>
                                    {editFlashcardId ===
                                    flashcard.FlashcardID ? (
                                        <>
                                            <td>
                                                <Stack
                                                    direction="vertical"
                                                    gap={1}
                                                >
                                                    Current File:{' '}
                                                    {editedFileName}
                                                    <input
                                                        type="file"
                                                        placeholder={
                                                            editedFileName
                                                        }
                                                        onChange={(e) =>
                                                            handleFileChange(e)
                                                        }
                                                    ></input>
                                                </Stack>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editedAnswer}
                                                    onChange={(e) =>
                                                        setEditedAnswer(
                                                            e.target.value
                                                        )
                                                    }
                                                ></input>
                                            </td>
                                            <td>
                                                <Stack
                                                    direction="horizontal"
                                                    gap={2}
                                                >
                                                    <Button
                                                        onClick={saveEdit}
                                                        style={{
                                                            whiteSpace:
                                                                'nowrap',
                                                        }}
                                                    >
                                                        Save{' '}
                                                        <FontAwesomeIcon
                                                            icon={faSave}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="outline-primary"
                                                        onClick={cancelEdit}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Stack>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{flashcard.FileName}</td>
                                            <td>{flashcard.Answer}</td>
                                            <td>
                                                <Stack
                                                    direction="horizontal"
                                                    gap={2}
                                                >
                                                    <Button
                                                        onClick={() =>
                                                            playFlashcardAudio(
                                                                flashcard.File,
                                                                flashcard.FileName
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEarListen}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="outline-primary"
                                                        onClick={() =>
                                                            startEdit(flashcard)
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPencil}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        onClick={() =>
                                                            deleteFlashcard(
                                                                flashcard
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrashCan}
                                                        />
                                                    </Button>
                                                </Stack>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>
            <Row style={{ paddingTop: '5px' }}>
                <Col>
                    <Button
                        variant="outline-primary"
                        onClick={goBackToProjectList}
                    >
                        Back
                    </Button>
                </Col>
                <Col style={{ textAlign: 'right' }}>
                    <Button onClick={goToQuiz}>Start Quiz</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default FlashcardSetup;
