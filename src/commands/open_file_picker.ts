import * as vscode from 'vscode';
import * as fs from 'fs';

import { query, input, output } from '../services';
import { newQueryBox } from './open_query_box';


export function openFilePicker() {
    vscode.window.withProgress({ location: vscode.ProgressLocation.Notification }, () => {
        return vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false
        }).then((files: vscode.Uri[] | undefined) => {
            if (files && files.length > 0) {
                const queryBox = newQueryBox();
                input.reset();
                const file = files[0];
                const inputText = fs.readFileSync(file.fsPath, 'utf-8');
                return input.ready(inputText).then(() => {
                    return output.ready().then(() => {
                        queryBox.show();
                        queryBox.onDidAccept(() => {
                            query.setQueryBox(null);
                            queryBox.dispose();
                        });
                    });
                });
            }
        });

    });
}
