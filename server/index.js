const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const Busboy = require('busboy');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const pug = require('pug');

const processImage = require('./util/images');
const {sendMail} = require('./util/mail');
const {saveBid, getBids, registerFile, getFiles} = require('./util/data');
const {forLoggedInOnly, logIn} = require('./auth');
const {SESSION_SECRET} = require('./config'); 

const bodyParser = require('body-parser');
const PORT = process.env.NODE_ENV === 'production' ? 80 : 8000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, '..', 'src', 'pug'));

app.use(session({
    store: new FileStore({
        path: path.join(__dirname, '..', 'data', 'sessions')
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

const templateFileName = path.join(__dirname, '..', 'src', 'pug', 'newBid.pug');
const newBidTemplate = pug.compile(fs.readFileSync(templateFileName, 'utf8'));

app.post('/bid', (req, res) => {
    Promise.all([
        saveBid(req.body),
        sendMail(newBidTemplate(req.body))
    ])
    .then(
        () => { res.send('ok'); },
        () => { res.send('fail'); }
    );
});

app.get('/admin', forLoggedInOnly, (req, res) => {
    Promise.all([
        getBids(),
        getFiles()
    ]).then(
        ([bids, files]) => res.render('admin', {bids, files}),
        (err) => {
            console.log(err);
            res.send('Ой. Что-то пошло не так');
        }
    );
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', logIn);


app.post('/upload', forLoggedInOnly, (req, res) => {
    const busboy = new Busboy({headers: req.headers});
    const imageProcessingDone = new Promise((resolve, reject) => {
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            processImage(file, filename).then(resolve, reject);
        });
    });
    const busboyDone = new Promise((resolve, reject) => {
        busboy.on('error', reject)
              .on('finish', resolve);
    });
    Promise.all([
        imageProcessingDone,
        busboyDone
    ])
    .then((xs) => registerFile(xs[0]))
    .then(
        () => res.redirect('/admin'),
        (err) => {
            console.log(err);
            res.send('fail');
        }
    );

    req.pipe(busboy);
});

app.get('/photo', (req, res) => {
    getFiles()
        .then(
            (photos) => res.render('photo', {photos})
        )

});

app.use('/p', express.static(path.resolve(__dirname, '../public')));
app.use('/', express.static(path.resolve(__dirname, '../docs')));

app.listen(PORT);
