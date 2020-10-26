import { awkjs } from 'awkjs';


export const run_awk = (input: string, query: string, options: string[]): Promise<string> => {
    return awkjs({ noExitRuntime: false }).then(({ awk }) => {
        const result = awk(input, query, options);
        if (result.stderr) {
            return Promise.reject(result.stderr);
        }
        return result.stdout;
    }).catch(reason => Promise.reject(String(reason)));
};
