const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const glob = require('glob');
const promisify = require('es6-promisify');

module.exports = {saveBid, getBids, registerFile, getFiles};

function saveBid(bidData) {
    const now = new Date();
    const formatted = [now.getFullYear(), now.getMonth(), now.getDate()].join('-');

    const dir = path.join(__dirname, '..', '..', 'data', 'bids', formatted);
    const fileName = now.valueOf() + '-' + ((Math.random() * 89 + 10) | 0) + '.json';

    const fullName = path.join(dir, fileName);

    bidData.created = now.valueOf();
    bidData.fileName = fileName;

    return new Promise((resolve, reject) => {
        mkdirp(dir, (err) => {
            if (err) {
                reject(err);
                return;
            }
            
            fs.writeFile(fullName, JSON.stringify(bidData), (err) => {
                if (err) {reject(err);}
                else resolve(fileName);
            });
        });
    })
}

function getBids() {
    const dir = path.join(__dirname, '..', '..', 'data', 'bids');
    return new Promise((resolve, reject) => {
        glob('**/*.json', {cwd: dir}, (err, files) => {
            if (err) {
                reject();
                return;
            }
            Promise.all(
                files
                    .map(name => path.resolve(dir, name))
                    .map(
                        (file) => promisify(fs.readFile)(file, 'utf8').then(x => JSON.parse(x))
                    )
                ).then(resolve, reject);
        });
    });
}

const uploadsConfigFileName = path.join(__dirname, '..', '..', 'data', 'uploads.json');

fs.stat(uploadsConfigFileName, (err, stats) => {
    if (err) {
        if (err.code === "ENOENT") {
            promisify(mkdirp)(path.dirname(uploadsConfigFileName))
                .then(() => {
                    fs.writeFile(uploadsConfigFileName, '{}', () => {});
                })
        } else {
            console.log(err);
        }
    }
})

function registerFile(names) {
    return promisify(fs.readFile)(uploadsConfigFileName, 'utf8')
        .then(JSON.parse)
        .then((uploadsConfig) => {
            uploadsConfig[names.original] = names;
            return promisify(fs.writeFile)(uploadsConfigFileName, JSON.stringify(uploadsConfig));
        });
}

function getFiles() {
    return promisify(fs.readFile)(uploadsConfigFileName, 'utf8')
        .then(JSON.parse);
}
