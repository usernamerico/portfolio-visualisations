// SCRIPT : ExportPDF_HDFOGRA39.jsx
// DESCRIPTION : Exporte le document InDesign actif en PDF
// en utilisant le préréglage "HDFOGRA39" et affiche
// une boîte de dialogue pour choisir l'emplacement.

(function() {
    // ----------------------------------------------------
    // *** PARAMÈTRE D'EXPORTATION DÉFINI PAR L'UTILISATEUR ***
    // ----------------------------------------------------
    var presetName = "HDFOGRA39"; 
    // ----------------------------------------------------

    // Vérifie si un document est ouvert
    if (app.documents.length == 0) {
        alert("Veuillez ouvrir un document InDesign avant d'exécuter ce script.");
        return;
    }

    var doc = app.activeDocument;
    
    // Récupère le paramètre prédéfini PDF
    var pdfPreset = app.pdfExportPresets.item(presetName);
    
    // Vérifie si le paramètre prédéfini est valide
    if (!pdfPreset.isValid()) {
        alert("Le paramètre prédéfini PDF '" + presetName + "' est introuvable. Veuillez vérifier le nom exact dans les réglages d'exportation PDF d'InDesign.");
        return;
    }

    // Définit le chemin par défaut (dossier du document ou Bureau)
    var fileName = doc.name.replace(/\.indd$/, "") + ".pdf";
    var defaultFolder;

    try {
        defaultFolder = File(doc.fullName).parent;
    } catch (e) {
        defaultFolder = Folder.desktop;
    }

    var defaultFile = new File(defaultFolder.fsName + "/" + fileName);

    // --- Étape 1 : Affichage de la boîte de dialogue de sauvegarde ---
    var saveFile = defaultFile.saveDlg("Enregistrer le PDF (HDFOGRA39) sous...", "Fichiers PDF:*.pdf");

    if (saveFile != null) {
        // --- Étape 2 : Exportation ---
        try {
            // Exporte le document en PDF en utilisant le préréglage spécifié
            doc.exportFile(
                ExportFormat.PDF_TYPE, 
                saveFile, 
                false, // Ne pas afficher la boîte de dialogue d'exportation InDesign
                pdfPreset // Utilise l'objet du préréglage HDFOGRA39
            );
            
            // alert("Exportation PDF HDFOGRA39 réussie : " + saveFile.fsName);
            
        } catch (e) {
            alert("Une erreur est survenue lors de l'exportation : " + e.description);
        }
    }
}());