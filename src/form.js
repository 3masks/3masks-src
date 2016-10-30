require('./pages/form');

const xhr = require('xhr');
let formIsOpen = false;

const formButton = document.querySelector('.show-form-button');

if (formButton) {
    formButton
        .addEventListener('click', () => {
            if (formIsOpen) {
                return;
            }
            xhr('/bid-form/index.html', (err, resp, body) => {
                if (err) {
                    return;
                }
                attachForm(body);
                initForm();
            })
        });
}

function attachForm(code) {
    document.body.insertAdjacentHTML('beforeEnd', code);
}

function initForm() {
    const root = document.querySelector('.form');
    const button = document.querySelector('.form__send');
    const close = root.querySelector('.form__close');

    const closeForm = () => {
        root.classList.remove('form--is-open');
        document.removeEventListener('click', closeForm);
        setTimeout(() => {
            root.parentNode.removeChild(root);
            formIsOpen = false;
        }, 500);
    };

    root.addEventListener('click', (e) => {e.stopPropagation();});

    document.addEventListener('click', closeForm);

    close.addEventListener('click', closeForm);

    setTimeout(() => {
        root.classList.add('form--is-open');
    }, 50);

    formIsOpen = true;

    button.addEventListener('click', () => {
        xhr.post('/bid', {
            json: {
                name: root.querySelector('input[name=name]').value,
                phone: root.querySelector('input[name=phone]').value,
                age: root.querySelector('input[name=age]').value,
                program: root.querySelector('select[name=program]').value
            }
        }, closeForm, 500);
    });
}
