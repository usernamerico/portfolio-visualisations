// =========================================================================
// CALCULATEUR D'OPTIMISATION DE COUPE POUR ADOBE INDESIGN (ScriptUI)
// =========================================================================

/**
 * Fonction centrale de calcul du nesting.
 * Elle prend les valeurs des champs de saisie (inputs) et met à jour
 * la zone de résultat (resultDisplay).
 *
 * @param {Object} inputs - Un objet contenant les éléments ScriptUI EditText pour laize, format_w, format_h, et quantity.
 * @param {Object} resultDisplay - L'élément ScriptUI StaticText pour afficher le résultat.
 */
function calculateNesting(inputs, resultDisplay) {
    // 1. Récupération des données depuis les éléments ScriptUI (propriété .text)
    var laize = parseFloat(inputs.laize.text);
    var formatW = parseFloat(inputs.format_w.text);
    var formatH = parseFloat(inputs.format_h.text);
    var quantity = parseInt(inputs.quantity.text);

    // Vérification des entrées
    if (isNaN(laize) || isNaN(formatW) || isNaN(formatH) || isNaN(quantity) || quantity <= 0) {
        resultDisplay.text = "Veuillez entrer des valeurs numériques valides et une quantité positive.";
        return;
    }

    // Surface d'une seule pièce (mm²)
    var surfacePiece_mm2 = formatW * formatH;
    // Surface totale utilisée (mm²)
    var surfaceUtilisee_mm2 = surfacePiece_mm2 * quantity;

    // Fonction pour calculer l'efficacité d'une orientation
    function getMeters(largeurPiece, longueurPiece) {
        // Nombre de pièces qu'on peut placer sur la laize
        var piecesSurLaize = Math.floor(laize / largeurPiece);
        if (piecesSurLaize === 0) {
            return {metrage_mm: Infinity}; // Impossible de placer la pièce
        }

        // Nombre de rangées nécessaires
        var rangées = Math.ceil(quantity / piecesSurLaize);

        // Métrage linéaire total (mm)
        var metrageLineaire_mm = rangées * longueurPiece;

        // Largeur de laize effectivement utilisée
        var largeurUtilisee = piecesSurLaize * largeurPiece;

        return {
            metrage_mm: metrageLineaire_mm,
            metrage_m: metrageLineaire_mm / 1000,
            piecesSurLaize: piecesSurLaize,
            largeurUtilisee: largeurUtilisee,
            longueurPiece: longueurPiece
        };
    }

    // 2. Test des deux orientations
    var resultA = getMeters(formatW, formatH); // Orientation A : Largeur=W, Longueur=H
    var resultB = getMeters(formatH, formatW); // Orientation B : Largeur=H, Longueur=W

    var bestResult;
    var bestOrientation = "";
    var output = "=== Résultats des Orientations ===\n";

    // 3. Affichage des deux scénarios et détermination du meilleur

    // Scénario A (W sur la laize)
    if (resultA.metrage_mm !== Infinity) {
        output += "\n--- Option A : Côté " + formatW + " mm sur la Laize ---\n";
        output += "  - Pièces par rangée : " + resultA.piecesSurLaize + "\n";
        output += "  - Laize utilisée : " + resultA.largeurUtilisee + " mm\n";
        output += "  - Métrage Linéaire : " + resultA.metrage_m.toFixed(3) + " m\n";
        bestResult = resultA;
        bestOrientation = "Côté " + formatW + " mm sur la Laize";
    } else {
         output += "\n--- Option A : Côté " + formatW + " mm sur la Laize ---\n";
         output += "❌ Impossible : " + formatW + " mm est trop grand pour la laize de " + laize + " mm.\n";
    }

    // Scénario B (H sur la laize)
    if (resultB.metrage_mm !== Infinity) {
        output += "\n--- Option B : Côté " + formatH + " mm sur la Laize ---\n";
        output += "  - Pièces par rangée : " + resultB.piecesSurLaize + "\n";
        output += "  - Laize utilisée : " + resultB.largeurUtilisee + " mm\n";
        output += "  - Métrage Linéaire : " + resultB.metrage_m.toFixed(3) + " m\n";

        // Comparaison pour trouver la meilleure option
        if (bestResult && resultB.metrage_mm < bestResult.metrage_mm) {
            bestResult = resultB;
            bestOrientation = "Côté " + formatH + " mm sur la Laize";
        } else if (!bestResult) {
            bestResult = resultB;
            bestOrientation = "Côté " + formatH + " mm sur la Laize";
        }
    } else {
        output += "\n--- Option B : Côté " + formatH + " mm sur la Laize ---\n";
        output += "❌ Impossible : " + formatH + " mm est trop grand pour la laize de " + laize + " mm.\n";
    }


    // 4. Affichage du résultat final

    if (!bestResult) {
        resultDisplay.text = "Aucune orientation n'est possible avec cette laize.";
        return;
    }

    var surfaceTotaleDeroulee_m2 = (laize / 1000) * bestResult.metrage_m;
    var surfaceUtilisee_m2_brut = surfaceUtilisee_mm2 / 1000000;
    var perte_m2 = surfaceTotaleDeroulee_m2 - surfaceUtilisee_m2_brut;
    var tauxPerte = (perte_m2 / surfaceTotaleDeroulee_m2) * 100;

    output += "\n====================================\n";
    output += "✅ SOLUTION OPTIMALE (" + bestOrientation + ")\n";
    output += "====================================\n";
    output += "Métrage Linéaire (Longueur) : " + bestResult.metrage_m.toFixed(3) + " m\n";
    output += "Largeur de coupe effective : " + bestResult.largeurUtilisee + " mm\n";
    output += "Surface Utilisée (" + quantity + " pièces) : " + surfaceUtilisee_m2_brut.toFixed(6) + " m²\n";
    output += "Surface Totale Déroulée : " + surfaceTotaleDeroulee_m2.toFixed(4) + " m²\n";
    output += "Perte (Chute de laize) : " + perte_m2.toFixed(4) + " m² (" + tauxPerte.toFixed(2) + " %)\n";


    // Mise à jour de l'élément de résultat
    resultDisplay.text = output;
    resultDisplay.layout.layout(true); // Redimensionne la zone de texte si nécessaire
}

// ----------------------------------------------------------------------
// SCRIPTUI (Interface Utilisateur pour InDesign)
// ----------------------------------------------------------------------

function createNestingCalculatorUI() {
    // Crée la fenêtre principale (Palette ou Dialog)
    var win = new Window("palette", "📏 Calculateur Nesting (InDesign)", undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = "fill";

    // Groupe principal pour les entrées
    var inputGroup = win.add("group");
    inputGroup.orientation = "column";
    inputGroup.alignChildren = ["fill", "top"];
    inputGroup.spacing = 8;
    inputGroup.margins = 15;

    // Structure pour stocker les références aux champs de saisie
    var inputElements = {};

    // Fonction utilitaire pour ajouter une étiquette et un champ de saisie
    function addInput(parent, labelText, id, defaultValue) {
        var group = parent.add("group");
        group.orientation = "row";
        group.alignChildren = ["left", "center"];
        group.alignment = "left";

        group.add("statictext", undefined, labelText, {multiline: false}).preferredSize = [200, 20];

        // Le champ de saisie réel (EditText)
        var inputField = group.add("edittext", undefined, defaultValue);
        inputField.preferredSize = [80, 20];
        // En ScriptUI, il n'y a pas de "type='number'". On doit s'assurer que c'est un nombre dans calculateNesting.

        // Stocke la référence pour la fonction de calcul
        inputElements[id] = inputField;
    }

    // Champs de saisie
    addInput(inputGroup, "Laize du Rouleau (mm):", "laize", "1200");
    addInput(inputGroup, "Format - Largeur (W) (mm):", "format_w", "594");
    addInput(inputGroup, "Format - Hauteur (H) (mm):", "format_h", "841");
    addInput(inputGroup, "Nombre d'Exemplaires:", "quantity", "6");

    // Bouton de calcul
    var btn = inputGroup.add("button", undefined, "Calculer le Nesting");
    btn.alignment = "center";
    btn.helpTip = "Lance le calcul d'optimisation de coupe.";

    // Zone de résultat (utiliser StaticText multiligne)
    var resultPanel = win.add("group");
    resultPanel.orientation = "column";
    resultPanel.alignChildren = ["fill", "top"];
    resultPanel.margins = [15, 0, 15, 15]; // Ajuste les marges

    var resultDisplay = resultPanel.add("statictext", undefined, "Entrez les valeurs et cliquez sur 'Calculer le Nesting'.", {multiline: true});
    resultDisplay.preferredSize = [300, 200]; // Taille initiale de la zone de résultat
    resultDisplay.justify = "left";

    // Attacher l'événement au bouton
    btn.onClick = function() {
        calculateNesting(inputElements, resultDisplay);
    };

    // Exécuter une fois avec les valeurs par défaut au chargement
    win.onShow = function() {
        calculateNesting(inputElements, resultDisplay);
        win.layout.layout(true); // S'assure que tout s'affiche correctement
    };

    // Afficher la fenêtre
    win.center();
    win.show();
}

// Lancement du script
createNestingCalculatorUI();