[].forEach.call(
    document.querySelectorAll('.videos__item'),
    (el) => {
        const video = el.querySelector('.video');
        const close = el.querySelector('.videos__item');
        el.addEventListener('click', () => {
            el.removeChild(video);
            el.insertAdjacentElement('afterbegin', video);
        });
    }
)
