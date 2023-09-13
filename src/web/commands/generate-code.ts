import * as vscode from 'vscode';
import { CommandInterface } from './command-interface';
import { CodeMaker } from '../libs/code-maker';
import { OpenaiKeyConfig } from '../config/openai-key';

export class GenerateCode implements CommandInterface {
    private ongoingChains: { [key: string]: CodeMaker } = {};

    getCommand(): string {
        return 'tdd-with-gpt.generateCode';
    }

    async execute() {
        vscode.window.showInformationMessage('Getting ready to generate code, might take a few seconds...');
        const input = await this.getInput();
        const chain = this.getChain(input.selectedFileUri.path);

        // Read file content for the file that is at input.selectedFileUri
        const fileContent = await this.readFileContent(input.selectedFileUri);
        const response = await chain.generateCode(input.selectedText, fileContent);
        await this.writeFile(input.selectedFileUri, response);

        // Open the updated file
        const updatedDocument = await vscode.workspace.openTextDocument(input.selectedFileUri);
        await vscode.window.showTextDocument(updatedDocument);

        vscode.window.showInformationMessage('File updated');
    }

    private getChain(key: string) {
        this.ongoingChains[key] = this.ongoingChains[key] || new CodeMaker(OpenaiKeyConfig.getKeyOrThrow());

        return this.ongoingChains[key];
    }

    private async getInput() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error('No text editor is active.');
        }

        const selectedText = editor.document.getText(editor.selection);

        const fileUri = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            openLabel: 'Select a file',
        });

        if (!fileUri || fileUri.length === 0) {
            vscode.window.showErrorMessage('No file selected.');
            throw new Error('No file selected.');
        }

        // Now, you can work with `selectedText` and the selected file.
        const selectedFileUri = fileUri[0];

        return {
            selectedFileUri,
            selectedText
        };
    }

    private async writeFile(fileUri: vscode.Uri, content: string): Promise<void> {
        const contentUint8Array = new TextEncoder().encode(content);
        await vscode.workspace.fs.writeFile(fileUri, contentUint8Array);
        vscode.window.showInformationMessage(`File saved: ${fileUri.toString()}`);

    }

    private async readFileContent(fileUri: vscode.Uri): Promise<string> {
        const fileContentBuffer = await vscode.workspace.fs.readFile(fileUri);
        const fileContentUint8Array = new Uint8Array(fileContentBuffer);
        return new TextDecoder().decode(fileContentUint8Array);
    }
}
