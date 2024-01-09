/**
 * projectsHandler Module
 *
 * Provides handler methods for managing project data in an Electron application.
 * It interacts with a SQLite database to perform CRUD operations on projects.
 * Each method returns a Promise for asynchronous database operations.
 */
const { app } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(
    app.getPath('userData'),
    'audio-flashcard-projects.sqlite'
);
const db = new sqlite3.Database(dbPath);

const projectsHandler = {
    /**
     * Retrieves all projects from the database.
     * @returns {Promise<Array>} A promise that resolves to an array of project objects.
     */
    getProjects: async () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM Projects', [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    /**
     * Adds a new project to the database.
     * @param {*} projectData Object containing new project details (name, description)
     * @returns {Promise<number>} A promise that resolves to the ID of the new project.
     */
    addProject: async (projectData) => {
        return new Promise((resolve, reject) => {
            const { name, description } = projectData;
            db.run(
                'INSERT INTO Projects (Name, Description) VALUES (?, ?);',
                [name, description],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    },

    /**
     * Deletes a project and its associated flashcards from the database.
     * @param {*} projectData Object containing the projectID to delete
     * @returns {Promise<number>} A promise that resolves to the number of rows affected.
     */
    deleteProject: async (projectData) => {
        return new Promise((resolve, reject) => {
            const { id } = projectData;
            // First, delete the flashcards associated with the project
            db.run(
                'DELETE FROM Flashcards WHERE ProjectID = ?',
                [id],
                function (err) {
                    if (err) {
                        return reject(err);
                    }

                    // Then, delete the project itself
                    db.run(
                        'DELETE FROM Projects WHERE ProjectID = ?',
                        [id],
                        function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(this.changes); // this.changes indicates the number of rows affected
                            }
                        }
                    );
                }
            );
        });
    },

    /**
     * Updates the details of an existing project.
     * @param {*} projectData Object containing updated project details (id, name, description)
     * @returns {Promise<number>} A promise that resolves to the ID of the updated project.
     */
    editProject: async (projectData) => {
        return new Promise((resolve, reject) => {
            const { id, name, description } = projectData;
            db.run(
                'UPDATE Projects SET Name = ?, Description = ? WHERE ProjectID = ?;',
                [name, description, id],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    },
};

module.exports = projectsHandler;
