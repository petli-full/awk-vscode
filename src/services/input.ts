import * as vscode from 'vscode';


interface Input {
    load: () => void;
    reset: () => void;
    ready: (text: string) => Thenable<vscode.TextEditor>;
    get: () => string;
    getFilename: () => string;
};

let _input = '';
let _filename = '';

const load = () => {
    const doc = vscode.window.activeTextEditor?.document;
    _input = (doc ? doc.getText() : '').trim();
    _filename = (doc ? doc.fileName : '').trim();
};

let editor$: null | Thenable<vscode.TextEditor> = null;
let _editor: null | vscode.TextEditor = null;

const reset = () => {
    _input = '';
    editor$ = null;
    _editor = null;
};

const ready = (text: string): Thenable<vscode.TextEditor> => {
    if (editor$ === null || (_editor !== null && _editor.document.isClosed)) {
        _input = text;
        editor$ = vscode.workspace.openTextDocument({ language: 'plaintext', content: '' }).then(doc => {
            return vscode.window.showTextDocument(doc).then(editor => {
                editor.edit(builder => {
                    builder.insert(doc.positionAt(0), text);
                }).then(() => editor);
                _editor = editor;
                return editor;
            });
        });
        return editor$;
    } else if (_editor === null) {
        return editor$.then(() => ready(text));
    }

    return editor$;
};

const get = (): string => {
    return _input;
};

const getFilename = (): string => {
    return _filename;
};


export const input: Input = {
    load,
    reset,
    ready,
    get,
    getFilename,
};
