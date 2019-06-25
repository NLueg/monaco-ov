import { LspClient } from "./LspClient";
import { MonacoClient } from "./MonacoClient";
 
LspClient.addAndCreateLangaugeClient(MonacoClient.editor);


var valueCode = `huml.appendRule("",
["name"],
"your name HAS to be Validaria",
function(model) { 
    return huml.NOT_EQUALS(model.name, "Validaria");
},
false
);`;
monaco.editor.create(document.getElementById("generated-code")!, {
    model: monaco.editor.createModel(valueCode, 'javascript', monaco.Uri.parse('inmemory://model.java')),
    theme: 'vs-dark',
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
    theme: 'vs-dark',
    automaticLayout: true,
    glyphMargin: true,
    lightbulb: {
        enabled: true
    }
});