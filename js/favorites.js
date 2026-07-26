/* favorites.js */
document.addEventListener('DOMContentLoaded', () => {
    const favs = getFavorites();

    // Search across ALL departments so favorited items always appear
    // regardless of which department the user currently belongs to
    const allMaterials = Object.values(MATERIALS).flat();
    const allItems = [...allMaterials, ...ESSAYS];
    const favItems = allItems.filter(item => favs.includes(item.id));

    const grid  = document.getElementById('favorites-grid');
    const empty = document.getElementById('favorites-empty');

    if (favItems.length === 0) {
        empty.classList.remove('hidden');
        empty.classList.add('flex');
    } else {
        grid.innerHTML = favItems.map(item => {
            const isEssay = !!item.doctor;
            if (isEssay) return essayCardHTML(item, true);
            return materialCardHTML(item, true);
        }).join('');

        bindFavButtons(grid);

        // Re-render on unfav
        grid.querySelectorAll('.fav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => location.reload(), 300);
            });
        });

        gsap.fromTo('.material-card, .essay-card',
            { y: 40, opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
        );
    }
});
