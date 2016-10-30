const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const Busboy = require('busboy');

const processImage = require('./util/images');
const {saveBid, getBids, registerFile, getFiles} = require('./util/data');

const bodyParser = require('body-parser');

const PORT = process.env.NODE_ENV === 'production' ? 80 : 8000;

app.use(bodyParser.json());

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, '..', 'src', 'pug'));


app.post('/bid', (req, res) => {
    saveBid(req.body).then(
        () => { res.send('ok'); },
        () => { res.send('fail'); }
    );
});

app.get('/admin', (req, res) => {
    Promise.all([
        getBids(),
        getFiles()
    ]).then(
        ([bids, files]) => res.render('admin', {bids, files}),
        (err) => res.send('Ой. Что-то пошло не так')
    );
});


app.post('/upload', (req, res) => {
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
        imageProcessingDone.then((x) => { console.log('gm: done'); return x; }),
        busboyDone.then(() => { console.log('bb: done') })
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
