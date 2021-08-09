import * as vscode from 'vscode';

import { query, input, output } from '../services';


export function newQueryBox() {
    const queryBox = vscode.window.createInputBox();
    queryBox.ignoreFocusOut = true;
    queryBox.placeholder = 'awk input';
    queryBox.onDidChangeValue((val) => {
        query.next(val);
    });
    query.setQueryBox(queryBox);
    return queryBox;
}

export function openQueryBox() {
    input.load();

    vscode.window.withProgress({ location: vscode.ProgressLocation.Notification }, () => {
        const queryBox = newQueryBox();
        return output.ready().then(() => {
            queryBox.show();
            queryBox.onDidAccept(() => {
                query.setQueryBox(null);
                queryBox.dispose();
            });
        });
    });
}
