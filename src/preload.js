/**
 * Preload script for the Electron application.
 *
 * This script is executed in the context of the renderer process before other scripts
 * in the window and provides a safe, controlled way to expose Node.js features to the
 * renderer process.
 *
 * - contextBridge, ipcRenderer: Modules from Electron.
 */
const { contextBridge, ipcRenderer } = require('electron');

/**
 * Exposes a limited, controlled API to the renderer process via the `electronAPI` object.
 * This API includes functions to interact with the main process using IPC (Inter-Process Communication).
 */
contextBridge.exposeInMainWorld('electronAPI', {
    getProjects: (args) => ipcRenderer.invoke('get-projects', args),
    addProject: (args) => ipcRenderer.invoke('add-project', args),
    deleteProject: (args) => ipcRenderer.invoke('delete-project', args),
    editProject: (args) => ipcRenderer.invoke('edit-project', args),

    getFlashcards: (args) => ipcRenderer.invoke('get-flashcards', args),
    getFlashcard: (args) => ipcRenderer.invoke('get-flashcard', args),
    addFlashcard: (args) => ipcRenderer.invoke('add-flashcard', args),
    deleteFlashcard: (args) => ipcRenderer.invoke('delete-flashcard', args),
    editFlashcard: (args) => ipcRenderer.invoke('edit-flashcard', args),

    getRandomizedFlashcardOrder: (args) =>
        ipcRenderer.invoke('get-randomized-flashcard-order', args),
    getRandomizedAnswersForQuestion: (args) =>
        ipcRenderer.invoke('get-randomized-answers-for-question', args),

    closeApp: () => ipcRenderer.send('close-app'),
});

/**
 * Exposes Node.js Buffer functionality to the renderer process.
 */
contextBridge.exposeInMainWorld('nodeAPI', {
    createBuffer: (data) => Buffer.from(data),
});
