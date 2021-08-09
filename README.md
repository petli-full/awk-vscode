# awk-vscode

This vscode extension allows users run awk (gawk) filter on the current document and show the result sdie by side.

### Usage
- Start the vscode command: F1 (or Ctrl+Shift+P) and search "AWK Filter".

![AWK Filter](https://raw.githubusercontent.com/petli-full/awk-vscode/master/images/demo.gif)

### Limitations
Though this extension uses the same [GNU awk](https://www.gnu.org/software/gawk/), it has its limitations. Here are some of them:

- User cannot specify input file. The input is always the currently opened document in vscode;

- User cannot specify output file. The result is always displayed side by side;

- User cannot specify the script file. User needs to type the script and options in the input box;

- User can only use AWK's internal functions. It cannot be anything else, e.g., Linux commands. For example, this won't work:
```
# tr is not AWK "native"
awk 'BEGIN { print "awk" | "tr [a-z] [A-Z]" }'
```

### Working with Large Files
- The vscode does not synchronize large files (> 50M) with its extensions. In another words, if the user opens a file larger than 50M, the extension does not know where to find it. For a temporary fix, awk-vscode provides a separate command - "AWK Filter (open file)" to work with large files.

![AWK Filter (open file)](https://raw.githubusercontent.com/petli-full/awk-vscode/master/images/awk_vscode_open_file.gif)

### AWK version
GNU Awk 5.1.0, API: 3.1 (the current latest stable)

