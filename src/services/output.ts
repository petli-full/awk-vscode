import * as vscode from 'vscode';


interface Output {
    ready: () => Thenable<vscode.TextEditor>;
    display: (result: string) => Thenable<vscode.TextEditor>;
};

let editor$: null | Thenable<vscode.TextEditor> = null;
let _editor: null | vscode.TextEditor = null;

const ready = (): Thenable<vscode.TextEditor> => {
    if (editor$ === null || (_editor !== null && _editor.document.isClosed)) {
        editor$ = vscode.workspace.openTextDocument({ language: 'plaintext', content: '' }).then(doc => {
            return vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside).then(editor => {
                _editor = editor;
                return editor;
            });
        });
        return editor$;
    } else if (_editor === null) {
        return editor$.then(() => ready());
    }

    return editor$;
};

const display = (result: string): Thenable<vscode.TextEditor> => {
    return ready().then((editor) => {
        const allText = new vscode.Range(0, 0, editor.document.lineCount, 0);
        const startPos = editor.document.positionAt(0);
        return editor.edit(builder => {
            builder.delete(allText);
            builder.insert(startPos, result);
        }).then(() => editor);
    });
};

export const output: Output = {
    ready,
    display,
};