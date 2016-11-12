const banner = document.querySelector('.banner');

function close() {
    banner.classList.add('banner--closed');
}

if (banner) {
    const cross = banner.querySelector('.banner__close');
    const overlay = banner.querySelector('.banner__overlay');

    cross.addEventListener('click', close);
    overlay.addEventListener('click', close);
}
