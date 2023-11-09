const http = require('http');
const fs = require('fs');
const path = require('path');

const pokemons = [
    {'name': 'Tortank', 'description': 'tortank.txt', 'slug': 'tortank'},
    {'name': 'Carapuce', 'description': 'carapuce.txt', 'slug': 'carapuce'},
    {'name': 'Dracofeu', 'description': 'dracofeu.txt', 'slug': 'dracofeu'}
]

const server = http.createServer((request, response) => {
    const url = request.url;

    if (url === '/' || url === '/index') {
        response.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        response.end('<h1>Pokédex</h1>'
            + '<ul>' + pokemons.map(pkm => `<li><a href="/${pkm.slug}">${pkm.name}</a></li>`) + '</ul>'
        );
    } else {
        const pokemon = pokemons.find(pkm => `/${pkm.slug}` === url);

        if (pokemon) {
            const descriptionPath = path.join(__dirname, 'files', pokemon.description);
            fs.readFile(descriptionPath, 'utf8', (err, data) => {
                if (err) {
                    response.writeHead(500);
                    response.end('Erreur de lecture');
                } else {
                    response.writeHead(200, {
                        'Content-Type': 'text/plain; charset=utf-8'
                    });
                    response.end(data);
                }
            });
        } else {
            response.writeHead(404);
            response.end('Page non trouvée et/ou le pokemon nexiste pas');
        }
    }
});

// Ecoute sur le port 3000
server.listen(3000, '127.0.0.1', () => {
    console.log('Le serveur a démarré à l\'adresse 127.0.0.1 sur le port 3000');
});