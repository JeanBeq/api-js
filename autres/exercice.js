// - À partir de la liste suivante, créez une nouvelle liste avec les chiffres mis au carré : [1, 2, 3, 4, 5]
mathList = [1,2,3,4,5].map((x) => x * x);

// - Filtrer les chiffres négatifs de la liste suivante : [1, -4, 12, 0, -3, 29, -150]
mathList = [1, -4, 12, 0, -3, 29, -150].filter(number => number < 0)

// - Effectuer la somme des chiffres négatifs de la liste suivante : [1, -4, 12, 0, -3, 29, -150]
mathList = [1, -4, 12, 0, -3, 29, -150].filter(number => number < 0).reduce((a, number) => a + number, 0)

// - Créer une nouvelle liste en mettant dans l'ordre croissant la liste suivante : [12, 46, 32, 64] (fonction pas vue ensemble)
listOrder = [12, 46, 32, 64].sort((a,b)=>a-b)

// - Créer une nouvelle liste contenant le nom des personnes trié par âge croissant à partir de la liste suivante : [
//     {'name': 'Jean', 'birthDate': 1985},
//     {'name': 'Édouard', 'birthDate': 1994},
//     {'name': 'Eugénie', 'birthDate': 1969},
//     {'name': 'Patrick', 'birthDate': 2015},
// ]
listAge = [{'name': 'Jean', 'birthDate': 1985},{'name': 'Édouard', 'birthDate': 1994},{'name': 'Eugénie', 'birthDate': 1969},{'name': 'Patrick', 'birthDate': 2015},].sort((a, b) => a.birthDate - b.birthDate)

// - Affichez les initiales du prénom suivant : "George Raymond Richard Martin" (fonction sur les string pas vues ensemble)