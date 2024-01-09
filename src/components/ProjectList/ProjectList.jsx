/**
 * ProjectList Component
 *
 * The ProjectList component is responsible for displaying a list of projects in the Audio Flashcards application.
 * It allows users to view, edit, delete, and add new projects. Each project has a name and a description.
 *
 * Features:
 * - Fetches and displays a list of projects.
 * - Provides functionalities to add, edit, and delete projects.
 * - Navigates to the project setup page upon selecting a project.
 * - Utilizes the AddProjectModal component for adding new projects.
 *
 * State:
 * - projects: Array of project objects to display.
 * - editProjectId: ID of the project currently being edited.
 * - editedName, editedDescription: Temporary storage for edited project details.
 * - showModal: Boolean to control the visibility of the AddProjectModal.
 *
 * Behavior:
 * - Communicates with the Electron main process through the 'window.electronAPI' for CRUD operations on projects.
 *
 * External Libraries:
 * - React Bootstrap for UI components.
 * - FontAwesome for icons.
 */
import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../AppContext.js';
import { Button, Stack, Row, Container, Table, Col } from 'react-bootstrap';
import AddProjectModal from './AddProjectModal.jsx';
import { useNavigate } from 'react-router-dom';
import {
    faRightLong,
    faTrashCan,
    faPencil,
    faSave,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [editProjectId, setEditProjectId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [showModal, setShowModal] = useState(false);
    const {
        currentProjectId,
        setCurrentProjectId,
        currentProjectName,
        setCurrentProjectName,
    } = useContext(AppContext);
    const navigate = useNavigate();

    const loadProjects = async () => {
        try {
            const projectsList = await window.electronAPI.getProjects();
            setProjects(projectsList);
        } catch (err) {
            console.error('Error fetching projects: ', err);
        }
    };
    useEffect(() => {
        loadProjects();

        if (currentProjectId && currentProjectName) {
            navigate('/project-setup');
        }
    }, [currentProjectId, currentProjectName, navigate]);

    const startEdit = (project) => {
        setEditProjectId(project.ProjectID);
        setEditedName(project.Name);
        setEditedDescription(project.Description);
    };
    const saveEdit = async () => {
        await window.electronAPI.editProject({
            id: editProjectId,
            name: editedName,
            description: editedDescription,
        });
        setEditProjectId(null);
        loadProjects();
    };
    const cancelEdit = () => {
        setEditProjectId(null);
    };

    const addProject = async (name, description) => {
        await window.electronAPI.addProject({ name, description });
        setShowModal(false);
        loadProjects();
    };

    const deleteProject = async (project) => {
        await window.electronAPI.deleteProject({ id: project.ProjectID });
        loadProjects();
    };

    const goToProjectSetup = (project) => {
        setCurrentProjectId(project.ProjectID);
        setCurrentProjectName(project.Name);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Projects</h1>
                </Col>
            </Row>
            <Row style={{ paddingBottom: '5px' }}>
                <Col style={{ textAlign: 'right' }}>
                    <Button
                        variant="primary"
                        onClick={() => setShowModal(true)}
                    >
                        New Project <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <AddProjectModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        handleSave={addProject}
                    />
                </Col>
            </Row>
            <div className="scrollableTable">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length <= 0 ? (
                            <tr>
                                <td colSpan={3} style={{ fontWeight: 600 }}>
                                    Please add a project
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project.ProjectID}>
                                    {editProjectId === project.ProjectID ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editedName}
                                                    onChange={(e) =>
                                                        setEditedName(
                                                            e.target.value
                                                        )
                                                    }
                                                ></input>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editedDescription}
                                                    onChange={(e) =>
                                                        setEditedDescription(
                                                            e.target.value
                                                        )
                                                    }
                                                ></input>
                                            </td>
                                            <td xs={4}>
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
                                            <td>{project.Name}</td>
                                            <td>{project.Description}</td>
                                            <td>
                                                <Stack
                                                    direction="horizontal"
                                                    gap={2}
                                                >
                                                    <Button
                                                        variant="outline-primary"
                                                        onClick={() =>
                                                            startEdit(project)
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPencil}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        onClick={() =>
                                                            deleteProject(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrashCan}
                                                        />
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            goToProjectSetup(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faRightLong}
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
        </Container>
    );
};

export default ProjectList;
