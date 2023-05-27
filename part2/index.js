const app = express();

const COOKIE_SECRET = 'une_secret_key_au_hasard';

// Simuler le processus d'authentification
const USERS = { alice: 'p1', bob: 'p2' };
const BALENCES = { alice: 500, bob: 1000 };

// Middleware pour parser les cookies
app.use(cookieParser());
app.use(cookieParser(COOKIE_SECRET));

// Configuration de la session
app.use(
    session({
        secret: 'votre_secret_key',
        secret: COOKIE_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 60000, // Durée d'expiration du cookie en millisecondes (ici, 1 minute)
        },
        sameSite: 'None',
        // sameSite: 'Lax',
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    // Vérifier si l'utilisateur est connecté en vérifiant la présence d'une variable de session
    if (req.session.username) {
        res.send(`Bienvenue, ${req.session.username} !`);
        const balence = BALENCES[req.session.username];
        res.send(`Bienvenue ${req.session.username}! Vous avez ${balence}$ sur votre compte.
            </br></br>
            <form action="/transfer" method="post">
                <label for="username">Nom d'utilisateur</label>
                <input type="text" id="username" name="username" value="alice">
                </br>
                <label for="amount">Montant</label>
                <input type="number" id="amount" name="amount" value="100">
                <input type="submit" value="Envoyer">
            </form>
            <a href="/logout">Déconnexion</a>
        `);
    } else {
        createReadStream('index.html').pipe(res);
    }
});

// Page de transfert
app.post('/transfer', (req, res) => {
    const username = req.body.username;
    const amount = parseFloat(req.body.amount);
    const balence = parseFloat(BALENCES[req.session.username]);

    if (req.session.username === username) {
        res.send(`Transfert de ${amount}$ à ${username} impossible. Vous ne pouvez pas vous transférer de l'argent à vous-même.
            </br>
            <a href="/">Retour</a>
        `);
    } else {
        if (balence >= amount) {
            BALENCES[req.session.username] -= amount;
            BALENCES[username] += amount;
            res.send(`Transfert de ${amount}$ à ${username} effectué avec succès.
                </br>
                <a href="/">Retour</a>
            `);
        } else {
            res.send(`Transfert de ${amount}$ à ${username} impossible. Vous n'avez pas assez d'argent sur votre compte.
                </br>
                <a href="/">Retour</a>
            `);
        }
    }
});

// Page de connexion
app.post('/login', (req, res) => {
    // Simuler le processus d'authentification
    const username = 'user';
    const password = 'mdp';

    username = req.body.username;
    password = USERS[username];

    // Vérifier les identifiants
    if (req.body.username === username && req.body.password === password) {
        // Définir la variable de session avec le nom d'utilisateur
        req.session.username = req.body.username;
        res.send('Vous êtes connecté');
        res.redirect('/');
    } else {
        res.send('Identifiants incorrects');
        res.send('Identifiants incorrects ! Veuillez réessayer. </br> <a href="/">Retour</a>');
    }
});

// Page de déconnexion
app.get('/logout', (req, res) => {
    // Détruire la session en supprimant la variable de session
    req.session.destroy();
    res.redirect('/');
    res.send('Vous êtes déconnecté');
    res.send('Vous êtes déconnecté. </br> <a href="/">Retour à la page de connexion</a>');
});
