require('./sass/main.sass');
require('./pages');
require('./pages/photo');
require('./pages/video');
require('./pages/campaign');
require('./pages/contacts');
require('./pages/price');
require('./pages/form');

const xhr = require('xhr');
let formIsOpen = false;

document
    .querySelector('.show-form-button')
    .addEventListener('click', () => {
        if (formIsOpen) {
            return;
        }
        xhr('/__form__', (err, resp, body) => {
            if (err) {
                return;
            }
            attachForm(body);
            initForm();
        })
    })

function attachForm(code) {
    document.body.insertAdjacentHTML('beforeEnd', code);
}

function initForm() {
    const root = document.querySelector('.form');
    const button = document.querySelector('.form__send');

    setTimeout(() => {
        root.classList.add('form--is-open');
    }, 50);

    formIsOpen = true;

    button.addEventListener('click', () => {
        root.classList.remove('form--is-open');
        setTimeout(() => {
            root.parentNode.removeChild(root);
            formIsOpen = false;
        }, 500);
    });
}
