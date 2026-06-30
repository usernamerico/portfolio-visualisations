// SCRIPT DE DÉCLINAISON DE FORMATS INDESIGN v2.0
// Simple et robuste
// ========================================================

// Vérifier qu'un document est ouvert
if (app.documents.length == 0) {
    alert("Veuillez ouvrir un document InDesign d'abord!");
} else {
    var doc = app.activeDocument;

    // Présets de formats
    var formats = [
        { label: "A3 → A5 (50%)", width: "148mm", height: "210mm" },
        { label: "A3 → A4 (70%)", width: "210mm", height: "297mm" },
        { label: "A4 → A5 (70%)", width: "148mm", height: "210mm" },
        { label: "A4 → A6 (50%)", width: "105mm", height: "148mm" },
        { label: "Instagram 1080x1080", width: "1080px", height: "1080px" },
        { label: "Instagram Story 1080x1920", width: "1080px", height: "1920px" },
        { label: "Web 1200x630", width: "1200px", height: "630px" },
        { label: "Mobile 375x667", width: "375px", height: "667px" },
        { label: "LinkedIn 1200x627", width: "1200px", height: "627px" },
        { label: "16:9 → 9:16", width: "1080px", height: "1920px" }
    ];

    // Créer le dialog
    var dialog = new Window("dialog", "Décliner un Format");

    // Liste des formats
    var group1 = dialog.add("group");
    group1.orientation = "column";
    group1.alignChildren = "fill";
    
    group1.add("statictext", undefined, "Sélectionnez le format :");
    var listbox = group1.add("listbox", undefined);
    listbox.preferredSize = [350, 200];
    
    for (var i = 0; i < formats.length; i++) {
        listbox.add("item", formats[i].label);
    }
    listbox.selection = 0;

    // Options
    var group2 = dialog.add("group");
    group2.orientation = "vertical";
    group2.alignChildren = "left";
    group2.add("statictext", undefined, "Options :");
    
    var newDocCheck = group2.add("checkbox", undefined, "Créer un nouveau document");
    newDocCheck.value = true;

    // Boutons
    var buttonGroup = dialog.add("group");
    buttonGroup.add("button", undefined, "Créer", { name: "ok" });
    buttonGroup.add("button", undefined, "Annuler", { name: "cancel" });

    // Traiter le résultat
    if (dialog.show() == 1) {
        var selectedIndex = listbox.selection.index;
        var selectedFormat = formats[selectedIndex];

        if (newDocCheck.value == true) {
            createNewDocument(doc, selectedFormat);
            alert("Nouveau document créé avec succès !");
        } else {
            modifyCurrentDoc(doc, selectedFormat);
            alert("Document modifié avec succès !");
        }
    }
}

// Créer un nouveau document
function createNewDocument(sourceDoc, format) {
    var newDoc = app.documents.add();
    newDoc.documentPreferences.pageWidth = format.width;
    newDoc.documentPreferences.pageHeight = format.height;
}

// Modifier le document courant
function modifyCurrentDoc(sourceDoc, format) {
    sourceDoc.documentPreferences.pageWidth = format.width;
    sourceDoc.documentPreferences.pageHeight = format.height;
}
