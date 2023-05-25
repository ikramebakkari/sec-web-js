const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.get('/api/data', (req, res) => {
    const data = {
        message: 'Exemple de réponse de l\'API backend'
    };

    res.json(data);
});

app.listen(port, () => {
    console.log(`Le serveur backend est en cours d'exécution sur le port ${port}`);
});
