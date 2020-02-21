# monaco-editor for openVALIDATION

This is the monaco-client for the [language-server](https://microsoft.github.io/language-server-protocol/) implementation of the domain-specific-langauge [openVALIDATION](https://github.com/openvalidation/openvalidation)

## Features

- [x] Jump to declaration
- [x] Find references
- [x] Highlight occurrences
- [x] Code completion
- [x] Diagnostics reporting
- [x] Documentation on hover
- [x] Rename symbol
- [x] Folding
- [x] Formatting
- [x] Syntax-Highlighting
- [x] Code Generation
- [x] Language-Specific-Definitions

## Getting started

### Local dev env

```sh
git clone https://github.com/NLueg/monaco-ov.git
cd ./monaco-ov
npm install
npm run start
```

## Documentation

When starting the project, the language-server gets automatically in the background.
The language-server provides the functionallity for openVALIDATION.
In addition to the LSP, we provide semantical highlighting for openVALIDATION-Code

There are a few extensions for the protocol during the case that openVALIDATION needs some additional parameters for parsing.

First wie added a toggle for the natural- and programming-language which is used for parsing.
They can be set with the notification `openVALIDATION/cultureChanged` and `openVALIDATION/languageChanged`.

In addition we send the schema from the monaco-client to the language-server with `openVALIDATION/schemaChanged`.

Lastly we can receive the generated code from the language-server with the notification `openVALIDATION/generatedCode`.

The integration of monaco with the language-server happens in the [LspClient.ts](https://github.com/NLueg/monaco-ov/blob/master/src/client/LspClient.ts).
