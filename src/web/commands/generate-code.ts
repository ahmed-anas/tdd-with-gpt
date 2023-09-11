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
        const input = await this.getInput();
        const chain = this.getChain(input.selectedFileUri.path);

        // Read file content for the file that is at input.selectedFileUri
        const fileContent = await this.readFileContent(input.selectedFileUri);

        const response = await chain.generateCode(input.selectedText, fileContent);

        console.log(JSON.stringify(response));
        vscode.window.showErrorMessage(JSON.stringify(response));
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

    private async readFileContent(fileUri: vscode.Uri): Promise<string> {
        const fileContentBuffer = await vscode.workspace.fs.readFile(fileUri);
        const fileContentUint8Array = new Uint8Array(fileContentBuffer);
        return new TextDecoder().decode(fileContentUint8Array);
    }
}
