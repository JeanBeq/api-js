const fs = require("fs");

const text = fs.readFileSync('./fichier.txt', 'utf8');
console.log("J'ai finis de lire le fichier");
console.log("Le fichier contient " . text);

console.log("Passage en asynchrone");

console.log("Je vais ouvrir le fichier");
fs.readFile('./fichier.txt', 'utf8', (error, text) => {
    console.log("Le fichier contient " + text + " (asynchrone)");
});

console.log("L'ordre d'ouvrir le fichier a été donné.");