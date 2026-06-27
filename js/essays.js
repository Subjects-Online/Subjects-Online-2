/* essays.js */
document.addEventListener('DOMContentLoaded', () => {
    const favs = getFavorites();
    const grid = document.getElementById('essays-grid');
    grid.innerHTML = ESSAYS.map(e => essayCardHTML(e, favs.includes(e.id))).join('');
    bindFavButtons(grid);

    gsap.fromTo('.essay-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.15 }
    );
});
