import * as vscode from 'vscode';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


interface Query {
    setQueryBox: (qbox: null | vscode.InputBox) => void;
    subscribe: (callback: (r: Request) => Thenable<any>) => vscode.Disposable;
    next: (input: string) => void;
};

const query$ = new Subject<string>();
let queryBox: null | vscode.InputBox = null;

const setQueryBox = (qbox: null | vscode.InputBox) => {
    queryBox = qbox;
};

const setQueryError = (error: any, hideAfter: number) => {
    if (queryBox) {
        const errorMsg = String(error).trim();
        queryBox.validationMessage = String(errorMsg);
        if (errorMsg) {
            setTimeout(() => {
                if (queryBox && queryBox.validationMessage === errorMsg) {
                    queryBox.validationMessage = '';
                }
            }, hideAfter);
        }
    };
};

const subscribe = (callback: (r: Request) => Thenable<any>) => {
    const handle = query$.pipe(
        debounceTime(750),
        distinctUntilChanged(),
    ).subscribe((val) => {
        const request = parseRequest(val);
        if (request) {
            if (queryBox) {
                setQueryError('', 0);
                queryBox.busy = true;
            };
            callback(request).then(() => {
                if (queryBox) { queryBox.busy = false; };
            }, reason => {
                if (queryBox) { queryBox.busy = false; };
                setQueryError(reason, 5000);
            });
        }
    });

    return {
        dispose: (): any => {
            handle.unsubscribe();
        }
    };
};

const next = (val: string) => {
    const trimmed = val.trim();
    query$.next(trimmed);
};

export interface Request {
    query: string;
    options: string[];
}

const parseRequest = (val: string): Request => {
    let query = '';
    const options: string[] = [];
    const argsMatch = val.match(/(?:[^\s"']+|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')+/g);
    argsMatch?.forEach((arg) => {
        if (arg.startsWith("'")) {
            query = arg.substr(1, arg.length - 2);
        } else if (arg.toLowerCase() !== 'awk') {
            options.push(arg);
        }
    });
    return { query, options };
};

export const query: Query = {
    setQueryBox,
    subscribe,
    next,
};
