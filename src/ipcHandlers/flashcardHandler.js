/**
 * flashcardHandler Module
 *
 * This module provides handler methods for managing flashcard data in an Electron application.
 * It interacts with a SQLite database to perform CRUD (Create, Read, Update, Delete) operations on flashcards.
 * Each method returns a Promise to handle asynchronous database operations.
 */
const { app } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(
    app.getPath('userData'),
    'audio-flashcard-projects.sqlite'
);
const db = new sqlite3.Database(dbPath);

const flashcardHandler = {
    /**
     * Retrieves all flashcards associated with a given project.
     * @param {*} flashcardData Object containing the projectID
     * @returns {Promise<Array>} A promise that resolves to an array of flashcards.
     */
    getFlashcards: async (flashcardData) => {
        return new Promise((resolve, reject) => {
            const { projectID } = flashcardData;
            db.all(
                'SELECT * FROM Flashcards WHERE ProjectID = ?;',
                [projectID],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    },

    /**
     * Retrieves a single flashcard by its ID.
     * @param {*} flashcardData Object containing the flashcardID
     * @returns {Promise<Object>} A promise that resolves to a flashcard object.
     */
    getFlashcard: async (flashcardData) => {
        return new Promise((resolve, reject) => {
            const { flashcardID } = flashcardData;
            db.all(
                'SELECT * FROM Flashcards WHERE FlashcardID = ?;',
                [flashcardID],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    },

    /**
     * Adds a new flashcard to the database.
     * @param {*} flashcardData Object containing new flashcard details (fileName, answer, projectID, file)
     * @returns {Promise<number>} A promise that resolves to the ID of the new flashcard.
     */
    addFlashcard: async (flashcardData) => {
        return new Promise((resolve, reject) => {
            const { fileName, answer, projectID, file } = flashcardData;
            db.run(
                'INSERT INTO Flashcards (FileName, Answer, ProjectID, File) VALUES (?, ?, ?, ?);',
                [fileName, answer, projectID, file],
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
     * Deletes a flashcard from the database by its ID.
     * @param {*} flashcardData Object containing the flashcardID to delete
     * @returns {Promise<number>} A promise that resolves to the ID of the deleted flashcard.
     */
    deleteFlashcard: async (flashcardData) => {
        return new Promise((resolve, reject) => {
            const { flashcardID } = flashcardData;
            db.run(
                'DELETE FROM Flashcards WHERE FlashcardID = ?;',
                [flashcardID],
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
     * Updates the details of an existing flashcard.
     * @param {*} flashcardData Object containing updated flashcard details (fileName, answer, flashcardID, file)
     * @returns {Promise<number>} A promise that resolves to the ID of the updated flashcard.
     */
    editFlashcard: async (flashcardData) => {
        return new Promise((resolve, reject) => {
            const { fileName, answer, flashcardID, file } = flashcardData;
            if (file === null) {
                db.run(
                    'UPDATE Flashcards SET FileName = ?, Answer = ? WHERE FlashcardID = ?;',
                    [fileName, answer, flashcardID],
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this.lastID);
                        }
                    }
                );
            } else {
                db.run(
                    'UPDATE Flashcards SET FileName = ?, Answer = ?, File = ? WHERE FlashcardID = ?;',
                    [fileName, answer, file, flashcardID],
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this.lastID);
                        }
                    }
                );
            }
        });
    },
};

module.exports = flashcardHandler;
