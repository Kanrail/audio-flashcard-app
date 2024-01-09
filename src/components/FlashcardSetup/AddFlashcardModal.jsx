/**
 * AddFlashcardModal Component
 *
 * This component is a modal dialog used for adding a new flashcard.
 * This allows users to attach an audio file and subject of that audio file as
 * the answer for that flashcard.
 *
 * The modal includes form fields for the file and answer of the flashcard and has buttons to either close the modal or
 * save the new flashcard. The 'Save Changes' button is disabled until both the name and description fields are filled out.
 *
 * Props:
 * - show (boolean): Controls the visibility of the modal.
 * - handleClose (function): Callback function to close the modal.
 * - handleSave (function): Callback function to save the new project data.
 *
 * State:
 * - newFileName (string): The name for the new file, derived from the file uploaded by the user.
 * - newFile (byte array): The audio file that must be of type .wav, .ogg, or .mp3 and no larger than 30MB, uploaded by user.
 * - newAnswer (string): The answer to the new audio flash card, input by the user.
 *
 * AppContext:
 * - MAX_FILE_SIZE (integer): Value supplied representing the max file size that a user is allowed to upload.
 *
 * External Libraries:
 * - React Bootstrap for UI components.
 */
import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { AppContext } from '../../AppContext';

const AddFlashcardModal = ({ show, handleClose, handleSave }) => {
    const { MAX_FILE_SIZE } = useContext(AppContext);
    const [newFileName, setNewFileName] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [newFile, setNewFile] = useState(null);

    const saveFlashcard = () => {
        handleSave(newFileName, newAnswer, newFile);
        setNewFileName('');
        setNewAnswer('');
        setNewFile(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/ogg'];
            if (allowedTypes.includes(file.type)) {
                if (file.size > MAX_FILE_SIZE) {
                    alert(
                        'File size is too large, limit the file size to 30MB.'
                    );
                    event.target.value = null;
                } else {
                    setNewFile(file);
                    setNewFileName(file.name);
                }
            } else {
                alert(
                    'This file type is not allowed. Please upload an audio file (.mp3, .wav, or .ogg).'
                );
                event.target.value = null;
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Flashcard</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="file"
                            accept="audio/mp3, audio/wav, audio/ogg"
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Answer</Form.Label>
                        <Form.Control
                            type="text"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={saveFlashcard}
                    disabled={!newFile || !newAnswer.trim()}
                >
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddFlashcardModal;
