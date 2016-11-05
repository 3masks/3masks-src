const {checkPassword} = require('./util/pwd');

module.exports = {
    logIn,
    forLoggedInOnly
};

function forLoggedInOnly(req, res, next) {
    if (req.session.isLoggedIn) {
        return next();
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }
}

function logIn(req, res) {
    return checkPassword(req.body.password)
        .then(
            (ok) => {
                console.log(ok);
                const {redirectTo} = req.session;
                req.session.isLoggedIn = ok;
                req.session.redirectTo = '/';
                res.redirect(redirectTo || '/');
            }
        )
        .catch(
            (err) => {
                console.log(err);
                res.send('Ой. Что-то пошло не так.')
            }
        );
}
