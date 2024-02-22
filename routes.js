const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = (app, myDataBase) => {
    // ruta para pagina principal
    app.route('/')
        .get((req, res) => {
            res.render('index', {
                title: 'Connected to Database',
                message: 'Please log in',
                showLogin: true,
                showRegistration: true,
                showSocialAuth: true
            });
        });

    // ruta para iniciar sesion con autenticacion de usuario
    app.route('/login')
        .post(
            passport.authenticate('local', { failureRedirect: '/' }),
            (req, res) => {
                res.redirect('/profile');
            }
        );

    // ruta para acceder al perfil del usuario una vez logueado
    app.route('/profile')
        .get(ensureAuthenticated, (req, res) => {
            res.render('profile', {
                username: req.user.username
            });
        });

    // ruta para cerrar sesion
    app.route('/logout')
        .get((req, res) => {
            req.logout();
            res.redirect('/');
        });

    // ruta para registrarse
    app.route('/register')
        .post((req, res, next) => {
            // hasheamos la contraseña
            const hash = bcrypt.hashSync(req.body.password, 12);
            // realizamos la busqueda del usuario en la db
            myDataBase.findOne({ username: req.body.username }, (err, user) => {
                // si hay un error llamamos a next
                if (err) {
                    next(err);
                } else if (user) {
                    // si el usuario ya existe, redirigimos a la pagina de login
                    res.redirect('/');
                } else {
                    // si no existe y no hay error, lo insertamos en la db
                    myDataBase.insertOne({
                        username: req.body.username,
                        password: hash
                    },
                        (err, doc) => {
                            // manejamos el error de crear el usuario
                            if (err) {
                                // si hubo un error, redirigimos a la pagina del login
                                res.redirect('/');
                            } else {
                                next(null, doc.ops[0])
                            }
                        }
                    )
                }
            })
        },
            // funcion next que autentica de manera local a los usuarios
            passport.authenticate('local', { failureRedirect: '/' }),
            // en caso de que todo salga bien, deebemos redirigir al usuario a su perfil 
            (req, res, next) => {
                res.redirect('/profile');
            }
        );


    // ruta para autenticacion de github
    app.route('/auth/github')
        .get(passport.authenticate('github'));


    // ruta para la redireccion despues de la autorizacion
    app.route('/auth/github/callback')
        .get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
            req.session.user_id = req.user.id;
            res.redirect('/chat');
        });

    // ruta para renderizar la vista de chats en /chat
    app.route('/chat')
        .get(ensureAuthenticated, (req, res) => {
            res.render('chat', {
                user: req.user
            });
        });

    // manejamos las rutas no encontradas
    app.use((req, res, next) => {
        res.status(404)
            .type('text')
            .send('Not Found');
        });
}

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};