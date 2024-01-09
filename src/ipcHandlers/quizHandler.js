/**
 * quizHandler Module
 *
 * Provides handler methods for managing quiz-related data in an Electron application.
 * It interacts with a SQLite database to perform operations like fetching a randomized order of flashcards
 * and generating randomized answer choices for quiz questions.
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

const quizHandler = {
    /**
     * Retrieves a randomized order of flashcard IDs for a given project.
     * @param {*} projectData Object containing the projectID
     * @returns {Promise<Array>} A promise that resolves to an array of flashcard IDs in randomized order.
     */
    getRandomizedFlashcardOrder: async (projectData) => {
        return new Promise((resolve, reject) => {
            const { projectID } = projectData;
            db.all(
                'SELECT FlashcardID FROM Flashcards WHERE ProjectID = ?;',
                [projectID],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        let flashcards = shuffleArray(rows);
                        resolve(flashcards);
                    }
                }
            );
        });
    },

    /**
     * Generates a set of randomized answer choices for a given quiz question.
     * @param {*} questionData Object containing details of the question (projectID, flashcardID, correct answer, number of choices)
     * @returns {Promise<Array>} A promise that resolves to an array of answer choices, including the correct answer.
     */
    getRandomizedAnswersForQuestion: async (questionData) => {
        return new Promise((resolve, reject) => {
            const { projectID, flashcardID, answer, numChoices } = questionData;
            db.all(
                'SELECT Answer FROM Flashcards WHERE ProjectID = ? AND FlashcardID <> ?;',
                [projectID, flashcardID],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        let choices = shuffleArray(rows);
                        if (numChoices >= choices.length) {
                            choices = choices.slice(0, numChoices - 1);
                        }
                        choices.push({ Answer: answer });
                        choices = shuffleArray(choices);

                        resolve(choices);
                    }
                }
            );
        });
    },
};

/**
 * Shuffles the elements of an array.
 * @param {Array} array The array to be shuffled.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        //Generate a random index lower than the current element
        const j = Math.floor(Math.random() * (i + 1));

        //Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = quizHandler;
