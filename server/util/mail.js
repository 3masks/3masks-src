const nodemailer = require('nodemailer');
const {TRANSPORT_EMAIL, SOURCE_EMAIL, TARGET_EMAIL} = require('../config');

const transport = nodemailer.createTransport(TRANSPORT_EMAIL);

module.exports = {sendMail};

function sendMail(html) {
    return transport.sendMail({
        to: TARGET_EMAIL,
        from: SOURCE_EMAIL,
        subject: 'Новая заявка (trimaski.ru)',
        html 
    });
}
