import * as vscode from 'vscode';
import { CommandInterface } from './command-interface';

export class GenerateCode implements CommandInterface {
    getCommand(): string {
        return 'tdd-with-gpt.generateCode';
    }

    async execute() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No text editor is active.');
            return;
        }

        const selectedText = editor.document.getText(editor.selection);

        try {
            const fileUri = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                openLabel: 'Select a file',
            });

            if (!fileUri || fileUri.length === 0) {
                vscode.window.showErrorMessage('No file selected.');
                return;
            }

            // Now, you can work with `selectedText` and the selected file.
            const selectedFileUri = fileUri[0];
            // Do something with `selectedText` and `selectedFileUri`.

            vscode.window.showInformationMessage(`
                selected file: ${selectedFileUri}
                selected text: ${selectedText}
            `);

        } catch (error) {
            vscode.window.showErrorMessage('An error occurred while selecting a file.');
        }
    }
}
