import { LspClient } from "./LspClient";
import { MonacoClient } from "./MonacoClient";
 
LspClient.addAndCreateLanguageClient(MonacoClient.editor);

var valueCode = `huml.appendRule("",
["name"],
"your name HAS to be Validaria",
function(model) { 
    return huml.NOT_EQUALS(model.name, "Validaria");
},
false
);`;
monaco.editor.create(document.getElementById("generated-code")!, {
    model: monaco.editor.createModel(valueCode, 'java', monaco.Uri.parse('inmemory://model.java')),
    theme: 'ovlTheme',
    readOnly: true,
    automaticLayout: true,
    glyphMargin: true,
    lightbulb: {
        enabled: true
    }
});

var valueSchema = `Name: Satoshi
Alter: 25
Ort: Dortmund`;
monaco.editor.create(document.getElementById("schema-definition")!, {
    model: monaco.editor.createModel(valueSchema, 'yaml', monaco.Uri.parse('inmemory://model.yaml')),
    theme: 'vs',
    automaticLayout: true,
    glyphMargin: true,
    lightbulb: {
        enabled: true
    }
});