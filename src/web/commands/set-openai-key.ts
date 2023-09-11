import * as vscode from 'vscode';
import { CommandInterface } from './command-interface';
import { OpenaiKeyConfig } from '../config/openai-key';

export class SetOpenaiKey implements CommandInterface {
    getCommand(): string {
        return 'tdd-with-gpt.setOpenaiKey';
    }

    async execute() {
        const inputOptions: vscode.InputBoxOptions = {
            prompt: 'Enter your API Key for OpenAI:',
            placeHolder: 'OpenAi API key',
        };

        const userEnteredToken = await vscode.window.showInputBox(inputOptions);

        if (userEnteredToken) {
            // Update the API token in global settings
            OpenaiKeyConfig.setKey(userEnteredToken);
            vscode.window.showInformationMessage('API Key set successfully.');
        } else {
            vscode.window.showErrorMessage('API Key not set.');
        }
    }
}
