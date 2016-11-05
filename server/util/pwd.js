const fs = require('fs');
const path = require('path');
const promisify = require('es6-promisify');

const crypto = require('crypto');
const {SALT} = require('../config');
const pwdFileName = path.join(__dirname, '..', '..', 'data', 'pwd');

module.exports = {checkPassword, savePassword};

function checkPassword(pwd) {
    const hash = crypto.createHash('sha256');
    hash.update(pwd + SALT);
    const aHash = hash.digest('hex');

    return promisify(fs.readFile)(
        pwdFileName,
        'utf8'
    ).then(
        (savedHash) => {
            return savedHash === aHash
        }
    );
}

function savePassword(pwd) {
    const hash = crypto.createHash('sha256');
    hash.update(pwd + SALT);
    return promisify(fs.writeFile)(
        pwdFileName,
        hash.digest('hex'),
        'utf8'
    );
}
