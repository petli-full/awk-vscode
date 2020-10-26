import * as vscode from 'vscode';
import { input } from './input';
import { query } from './query';
import { output } from './output';
import { run_awk } from './awk';


export function initServices(): vscode.Disposable {
    const queryDisposer = query.subscribe(
        request => output.ready()
            .then(() => run_awk(input.get(), request.query, request.options))
            .then(converted => output.display(converted))
    );

    return {
        dispose: (): void => {
            queryDisposer.dispose();
        }
    };
};

export {
    input,
    output,
    query,
    run_awk,
};