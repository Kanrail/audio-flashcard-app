/**
 * AddProjectModal Component
 *
 * This component is a modal dialog used for adding a new project. It is part of the Audio Flashcards application
 * and allows users to input the name and description for a new project.
 *
 * The modal includes form fields for the name and description of the project and has buttons to either close the modal or
 * save the new project. The 'Save Changes' button is disabled until both the name and description fields are filled out.
 *
 * State:
 * - newName (string): The name for the new project, input by the user.
 * - newDescription (string): The description for the new project, input by the user.
 *
 * Props:
 * - show (boolean): Controls the visibility of the modal.
 * - handleClose (function): Callback function to close the modal.
 * - handleSave (function): Callback function to save the new project data.
 *
 * External Libraries:
 * - React Bootstrap for UI components.
 */
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const AddProjectModal = ({ show, handleClose, handleSave }) => {
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const saveProject = () => {
        handleSave(newName, newDescription);
        setNewName('');
        setNewDescription('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
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
                    onClick={saveProject}
                    disabled={!newName || !newDescription}
                >
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddProjectModal;
