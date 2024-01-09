/**
 * Main Entry Point for the React Application
 *
 * This file is the main entry point for the React application. It imports the necessary
 * modules and renders the root component of the app, `App.jsx`. This file also includes
 * the import for Bootstrap's CSS to ensure that the Bootstrap styling is available
 * throughout the application.
 *
 * - React: The React library is imported to use React features.
 * - createRoot: Imported from react-dom/client, used for rendering the App component.
 * - App: The root component of the application.
 * - bootstrap/dist/css/bootstrap.min.css: Bootstrap's minified CSS for styling.
 *
 * The app is rendered into a DOM element with the id 'app'.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Path to your App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';

const app = document.getElementById('app');

const root = createRoot(app);

root.render(<App />);
