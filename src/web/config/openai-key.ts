import * as vscode from 'vscode';

export class OpenaiKeyConfig {
    static setKey(key: string) {
        vscode.workspace.getConfiguration().update('tdd-with-gpt.openAiKey', key, vscode.ConfigurationTarget.Global);
    }

    static getKey(): string | undefined {
        return vscode.workspace.getConfiguration().get('tdd-with-gpt.openAiKey');
    }

    static getKeyOrThrow(): string {
        const key = this.getKey();
        if(!key) {
            throw new Error('openAi key not set');
        }

        return key;
    }
}