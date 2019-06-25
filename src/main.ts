/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
require('monaco-editor');
(self as any).MonacoEnvironment = {
    getWorkerUrl: (moduleId: any, label: string) => {
        if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.bundle.js';
        }
        return './editor.worker.bundle.js'
    }
}
require('./client/client');


require('../css/style.css');
require('../images/logo-v2-small.png');