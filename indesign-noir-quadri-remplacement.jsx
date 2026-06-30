// ... (code précédent) ...

    // Remplace la nuance "Black" par la nouvelle nuance
    try {
        originalBlack.duplicate(newSwampColor);
        // originalBlack.remove(); // <-- Commentez ou supprimez cette ligne
        alert("La nuance 'Black' a été remplacée par '" + newColorName + "' dans le document.");
    } catch (e) {
        alert("Une erreur est survenue lors du remplacement de la nuance : " + e.message);
    }