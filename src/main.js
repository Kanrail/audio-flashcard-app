/**
 * Main process of the Electron application.
 *
 * This file sets up the main process for the Electron application. It includes
 * the creation and management of the browser window, setup of IPC (Inter-Process Communication)
 * handlers, and initialization of the SQLite database.
 *
 * - app, BrowserWindow, ipcMain, dialog: Modules from Electron.
 * - path, fs: Node.js core modules for file path operations and file system.
 * - sqlite3: SQLite module for database operations.
 */
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

//Database setup
const dbPath = path.join(
    app.getPath('userData'),
    'audio-flashcard-projects.sqlite'
);

/**
 * Initializes the SQLite database by creating required tables if they do not exist.
 *
 * @param {sqlite3.Database} db - The SQLite database instance.
 * @returns {Promise<void>} A promise that resolves when the database is initialized.
 */
function initializeDatabase(db) {
    return new Promise((resolve, reject) => {
        const schema = `
      CREATE TABLE IF NOT EXISTS Projects(
        ProjectID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Description TEXT
      );

      CREATE TABLE IF NOT EXISTS Flashcards(
        FlashcardID INTEGER PRIMARY KEY AUTOINCREMENT,
        ProjectID INTEGER,
        FileName TEXT NOT NULL,
        File BLOB NOT NULL,
        Answer TEXT NOT NULL,
        FOREIGN KEY (ProjectID) REFERENCES Projects (ProjectID)
      );
    `;
        db.exec(schema, (err) => {
            if (err) {
                console.error('Failed to create tables', err);
            } else {
                console.log('Tables created or already exist');
            }
        });
    });
}
if (!fs.existsSync(dbPath)) {
    console.log('Database file not found, creating database.');
    let newDB = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            initializeDatabase(newDB);
        }
    });
} else {
    initializeDatabase(newDB);
    console.log('Database file found, connecting.');
}
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
    }
});

const flashcardHandler = require('./ipcHandlers/flashcardHandler');
const projectsHandler = require('./ipcHandlers/projectsHandler');
const quizHandler = require('./ipcHandlers/quizHandler');

//IPC Handler methods
ipcMain.handle('get-projects', (event, args) =>
    projectsHandler.getProjects(args)
);
ipcMain.handle('add-project', (event, projectData) =>
    projectsHandler.addProject(projectData)
);
ipcMain.handle('delete-project', (event, projectData) =>
    projectsHandler.deleteProject(projectData)
);
ipcMain.handle('edit-project', (event, projectData) =>
    projectsHandler.editProject(projectData)
);

ipcMain.handle('get-flashcards', (event, flashcardData) =>
    flashcardHandler.getFlashcards(flashcardData)
);
ipcMain.handle('get-flashcard', (event, flashcardData) =>
    flashcardHandler.getFlashcard(flashcardData)
);
ipcMain.handle('add-flashcard', (event, flashcardData) =>
    flashcardHandler.addFlashcard(flashcardData)
);
ipcMain.handle('delete-flashcard', (event, flashcardData) =>
    flashcardHandler.deleteFlashcard(flashcardData)
);
ipcMain.handle('edit-flashcard', (event, flashcardData) =>
    flashcardHandler.editFlashcard(flashcardData)
);

ipcMain.handle('get-randomized-answers-for-question', (event, questionData) =>
    quizHandler.getRandomizedAnswersForQuestion(questionData)
);
ipcMain.handle('get-randomized-flashcard-order', (event, projectData) =>
    quizHandler.getRandomizedFlashcardOrder(projectData)
);

ipcMain.on('close-app', () => {
    app.quit();
});

/**
 * Creates the main window of the Electron application.
 */
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
