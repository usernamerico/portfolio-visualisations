// Script InDesign - Ajuster un bloc aux fonds perdus
// Sélectionnez un bloc et exécutez ce script

(function() {
    // Vérifier qu'InDesign est actif et qu'un document est ouvert
    if (app.documents.length === 0) {
        alert("Veuillez ouvrir un document InDesign.");
        return;
    }

    var doc = app.activeDocument;
    
    // Vérifier qu'un objet est sélectionné
    if (doc.selection.length === 0) {
        alert("Veuillez sélectionner un bloc à ajuster.");
        return;
    }

    var bloc = doc.selection[0];
    
    // Vérifier que la sélection est un objet de page valide
    if (!bloc.hasOwnProperty("geometricBounds")) {
        alert("L'objet sélectionné n'est pas un bloc valide.");
        return;
    }

    // Obtenir la page courante
    var page;
    try {
        page = bloc.parentPage;
    } catch (e) {
        alert("Le bloc doit être sur une page du document.");
        return;
    }

    // Récupérer les paramètres de fond perdu du document
    var bleedTop = doc.documentPreferences.documentBleedTopOffset;
    var bleedBottom = doc.documentPreferences.documentBleedBottomOffset;
    var bleedInside = doc.documentPreferences.documentBleedInsideOrLeftOffset;
    var bleedOutside = doc.documentPreferences.documentBleedOutsideOrRightOffset;

    // Obtenir les limites de la page
    var pageBounds = page.bounds; // [y1, x1, y2, x2]
    
    // Calculer les nouvelles limites avec les fonds perdus
    // Format: [top, left, bottom, right]
    var newBounds = [
        pageBounds[0] - bleedTop,           // top
        pageBounds[1] - bleedInside,        // left
        pageBounds[2] + bleedBottom,        // bottom
        pageBounds[3] + bleedOutside        // right
    ];

    // Appliquer les nouvelles limites au bloc
    bloc.geometricBounds = newBounds;

})();