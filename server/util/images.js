const fs = require('fs');
const path = require('path');
const promisify = require('es6-promisify');
const gm = require('gm');
const mkdirp = require('mkdirp');

const formats = [
    ['xsmall', (s, name) => gm(s, name).resize(40, 40, '^')],
    ['small', (s, name) => gm(s, name).resize(240, 240, '^')]
];

const imgPath = (...name) => path.join(__dirname, '..', '..', 'public', 'i', ...name);

mkdirp(imgPath('original'));
formats.forEach(([formatName]) => { mkdirp(imgPath(formatName)); });

const promisifyStream = (stream) => new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
})

const applyMagick = ([formatName, process], stream, fileName) => {
    return process(stream, fileName)
        .stream()
        .pipe(fs.createWriteStream(imgPath(formatName, fileName)));
}

const saveOrignal = (stream, fileName) => {
    return stream
        .pipe(fs.createWriteStream(imgPath('original', fileName)));
};

module.exports = (stream, fileName) => {
    return Promise.all([
        ...formats.map((format) => applyMagick(format, stream, fileName)),
        saveOrignal(stream, fileName)
    ]
    .map(promisifyStream))
    .then(() => formats.reduce((acc, [formatName]) => {
        acc[formatName] = '/' + formatName + '/' + fileName;
        return acc;
    }, {original: '/original/' + fileName}));
}
