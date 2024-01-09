/**
 * App Component
 *
 * This component serves as the main entry point of the Electron application.
 * It includes navigation and routing for different pages within the app.
 *
 * The `AppProvider` context is used to manage global state across the application.
 *
 * Routes are defined for navigating to different components:
 * - LandingPage
 * - ProjectList
 * - ProjectSetup
 * - Quiz
 *
 * A unique key is assigned to each route component using `uuidv4` to ensure
 * they are re-rendered when navigated to.
 */
import * as React from 'react';
import { AppProvider } from './AppContext.js';
import { HashRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import ProjectList from './components/ProjectList/ProjectList.jsx';
import ProjectSetup from './components/FlashcardSetup/FlashcardSetup.jsx';
import Quiz from './components/Quiz/Quiz.jsx';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
    return (
        <AppProvider>
            <Router>
                <nav>
                    <NavLink to="/">
                        <Button
                            variant="light"
                            style={{ border: '1px solid #818589' }}
                        >
                            <FontAwesomeIcon icon={faHome} />
                        </Button>
                    </NavLink>
                </nav>
                <Routes>
                    <Route path="/" element={<LandingPage key={uuidv4()} />} />
                    <Route
                        path="/project-list"
                        element={<ProjectList key={uuidv4()} />}
                    />
                    <Route
                        path="/project-setup"
                        element={<ProjectSetup key={uuidv4()} />}
                    />
                    <Route path="/quiz" element={<Quiz key={uuidv4()} />} />
                </Routes>
            </Router>
        </AppProvider>
    );
};

export default App;
