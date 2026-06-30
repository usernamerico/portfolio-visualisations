// Script Calcul Surface + Force System Clipboard
var dialog = new Window("dialog", "Calculateur m²");
dialog.add("statictext", undefined, "Collez le format (ex: 1370x1255) :");

var inputField = dialog.add("edittext", undefined, "");
inputField.characters = 20;
inputField.active = true;

var btnGroup = dialog.add("group");
var btnOK = btnGroup.add("button", undefined, "OK", {name: "ok"});
var btnCancel = btnGroup.add("button", undefined, "Annuler");

btnOK.onClick = function() {
    var rawText = inputField.text;
    
    // 1. Nettoyage et Extraction
    rawText = rawText.replace(',', '.'); 
    var numbers = rawText.match(/[0-9]+(\.[0-9]+)?/g);

    if (numbers && numbers.length >= 2) {
        dialog.close();

        var w = parseFloat(numbers[0]);
        var h = parseFloat(numbers[1]);

        // Calcul
        var m2 = (w * h) / 1000000;
        m2 = Math.round(m2 * 100) / 100;
        
        // Remplacer le point par une virgule pour le format français
        var resultString = m2.toString().replace('.', ',');

        // 2. Copie dans le presse-papier SYSTÈME (La partie importante)
        copyToClipboard(resultString);
        
        // Petit bip ou message pour confirmer (optionnel)
        // alert("Copié : " + resultString); 

    } else {
        alert("Erreur : Format non reconnu. Il faut 2 chiffres.");
    }
}

// Fonction qui force la copie système selon l'OS
function copyToClipboard(text) {
    if (File.fs == "Windows") {
        // Méthode Windows (VBScript via ligne de commande)
        // Cette commande utilise 'clip' qui est natif dans Windows
        var cmd = 'echo ' + text + '| clip';
        app.doScript('CreateObject("WScript.Shell").Run "cmd.exe /c echo ' + text + ' | clip", 0, True', ScriptLanguage.VISUAL_BASIC);
    } else {
        // Méthode Mac (AppleScript)
        var appleScriptCommand = 'set the clipboard to "' + text + '"';
        app.doScript(appleScriptCommand, ScriptLanguage.APPLESCRIPT_LANGUAGE);
    }
}

dialog.show();