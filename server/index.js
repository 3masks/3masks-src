const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

const {saveBid, getBids} = require('./data');

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
    getBids().then(
        (bids) => res.render('admin', {bids}),
        (err) => res.send(err)
    );
});

app.use('/', express.static(path.resolve(__dirname, '../docs')));

app.listen(PORT);
